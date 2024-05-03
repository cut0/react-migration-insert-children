import type {
  IntersectionTypeNode,
  SourceFile,
  TypeLiteralNode,
  TypeReferenceNode,
  VariableDeclaration,
} from "ts-morph";
import { StructureKind, SyntaxKind, TypeAliasDeclaration } from "ts-morph";
import { isChildrenRefered, isFcDeclartion } from "./detect-fc.ts";

const convertDirectTypeLiteral = (declaration: VariableDeclaration) => {
  const typeLiteralNode = declaration
    .getFirstChildByKind(SyntaxKind.TypeReference)
    ?.getFirstChildByKind(SyntaxKind.TypeLiteral);

  if (typeLiteralNode == null) {
    if (
      declaration.getType().getText() === "React.FC" ||
      declaration.getType().getText() === "React.FC<{}>"
    ) {
      declaration
        .getTypeNode()
        ?.replaceWithText("React.FC<{ children?: React.ReactNode }>");
    }

    if (
      declaration.getType().getText() === "FC" ||
      declaration.getType().getText() === "FC<{}>"
    ) {
      declaration
        .getTypeNode()
        ?.replaceWithText("FC<{ children?: React.ReactNode }>");
    }

    return;
  }

  const alreadyHasChildren = typeLiteralNode.getMembers().some((member) => {
    const identifierNode = member.getFirstChildByKind(SyntaxKind.Identifier);
    return identifierNode?.getText() === "children";
  });

  if (alreadyHasChildren) {
    return;
  }

  typeLiteralNode?.addMember({
    kind: StructureKind.PropertySignature,
    name: "children?",
    type: "React.ReactNode",
  });

  return;
};

const convertTypeLiteral = (typeLiteralNode: TypeLiteralNode | undefined) => {
  if (typeLiteralNode == null) {
    return;
  }

  const alreadyHasChildren = typeLiteralNode.getMembers().some((member) => {
    const identifierNode = member.getFirstChildByKind(SyntaxKind.Identifier);
    return identifierNode?.getText() === "children";
  });

  if (alreadyHasChildren) {
    return;
  }

  typeLiteralNode.addMember({
    kind: StructureKind.PropertySignature,
    name: "children?",
    type: "React.ReactNode",
  });
  return;
};

const convertIntersectionType = (
  intersectionTypeNode: IntersectionTypeNode | undefined,
) => {
  if (intersectionTypeNode == null) {
    return;
  }
  const typeLiteral = intersectionTypeNode
    .getFirstChildByKind(SyntaxKind.SyntaxList)
    ?.getFirstChildByKind(SyntaxKind.TypeLiteral);

  if (typeLiteral) {
    const alreadyHasChildren = typeLiteral.getMembers().some((member) => {
      const identifierNode = member.getFirstChildByKind(SyntaxKind.Identifier);
      return identifierNode?.getText() === "children";
    });

    if (alreadyHasChildren) {
      return;
    }

    typeLiteral.addMember({
      kind: StructureKind.PropertySignature,
      name: "children?",
      type: "React.ReactNode",
    });
  }
  return;
};

const convertTypeReference = (
  typeReferenceNode: TypeReferenceNode | undefined,
  propsTypeAlias: TypeAliasDeclaration,
) => {
  if (typeReferenceNode == null) {
    return;
  }
  propsTypeAlias.setType(
    `${typeReferenceNode.getText()} & { children?: React.ReactNode }`,
  );
  return;
};

export const convert = (sourceFile: SourceFile) => {
  const componentDeclarationList = sourceFile
    .getVariableDeclarations()
    .filter((declaration) => isFcDeclartion(declaration))
    .filter((declaration) => isChildrenRefered(declaration));

  componentDeclarationList.forEach((declaration) => {
    let props = declaration.getType().getAliasTypeArguments()[0];

    /**
     * NOTE
     * - if declared as "React.FC<Props> & Hoge" target React.FC<Props>
     */
    if (props == null) {
      const intersectionTypeNodes = declaration
        .getType()
        .getIntersectionTypes()
        .filter(
          (node) =>
            node.getText().startsWith("React.FC") ||
            node.getText().startsWith("FC"),
        );

      if (intersectionTypeNodes.length > 0) {
        props = intersectionTypeNodes[0].getAliasTypeArguments()[0];
      }
    }

    /**
     * NOTE
     * - fetch props type declaration
     */
    const propsTypeAlias = sourceFile
      .getTypeAliases()
      .find(
        (statement) =>
          statement instanceof TypeAliasDeclaration &&
          statement.getType() === props,
      ) as TypeAliasDeclaration;

    /**
     * NOTE:
     * - from: React.FC<{ hoge:fuga }>
     * - to: React.FC<{ hoge:fuga; children?: React.ReactNode }>
     */
    if (propsTypeAlias == null) {
      convertDirectTypeLiteral(declaration);
      return;
    }

    /**
     * NOTE:
     * - from: type Props = { hoge:fuga }
     * - to: type Props = { hoge:fuga; children?: React.ReactNode }
     */
    const typeLiteralNode = propsTypeAlias.getFirstChildByKind(
      SyntaxKind.TypeLiteral,
    );
    convertTypeLiteral(typeLiteralNode);

    /**
     * NOTE:
     * - from: type Props = Hoge & { hoge:fuga }
     * - to: type Props = Hoge & { hoge:fuga; children?: React.ReactNode }
     */
    const intersectionTypeNode = propsTypeAlias.getFirstChildByKind(
      SyntaxKind.IntersectionType,
    );
    convertIntersectionType(intersectionTypeNode);

    /**
     * NOTE:
     * - from: type Props = Hoge
     * - to: type Props = Hoge & { children?: React.ReactNode }
     */
    const typeReferenceNode = propsTypeAlias.getFirstChildByKind(
      SyntaxKind.TypeReference,
    );
    convertTypeReference(typeReferenceNode, propsTypeAlias);
  });

  sourceFile.saveSync();

  return sourceFile;
};
