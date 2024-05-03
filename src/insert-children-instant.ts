import type { SourceFile, VariableDeclaration } from "ts-morph";
import { SyntaxKind } from "ts-morph";
import { isChildrenRefered, isFcDeclartion } from "./detect-fc.ts";

const insertComment = (
  sourceFile: SourceFile,
  declaration: VariableDeclaration
) => {
  const componentName = declaration.getSymbol()?.getEscapedName() ?? "";

  const statement = sourceFile.getVariableStatementOrThrow(componentName);

  const startLineNumber = statement.getStart();

  sourceFile.insertText(
    startLineNumber,
    "// Automatically added by react-migration-insert-children\n"
  );
};

export const convert = (sourceFile: SourceFile) => {
  const componentDeclarationList = sourceFile
    .getVariableDeclarations()
    .filter((declaration) => isFcDeclartion(declaration))
    .filter((declaration) => isChildrenRefered(declaration));

  componentDeclarationList.forEach((declaration) => {
    /**
     * NOTE:
     * - Check if the declaration is an intersection type.
     * - from: React.FC<Props & { hoge:fuga }>
     * - to: React.FC<Props & { hoge:fuga } & { children?: React.ReactNode }>
     */
    const isIntersection =
      declaration
        .getTypeNodeOrThrow()
        .getFirstChildByKind(SyntaxKind.IntersectionType) != null;

    if (isIntersection) {
      const typeNode = declaration.getTypeNodeOrThrow();
      const [genericType] = typeNode.getChildren();

      if (genericType != null) {
        const intersectionType = declaration
          .getTypeNodeOrThrow()
          .getFirstChildByKindOrThrow(SyntaxKind.IntersectionType);
        const newInnerType = `${intersectionType.getText()} & { children?: React.ReactNode }`;
        const newTypeAnnotation = `${genericType.getText()}<${newInnerType}>`;

        declaration.setType(newTypeAnnotation);

        insertComment(sourceFile, declaration);
      }
      return;
    }

    /**
     * NOTE:
     * - Check if the declaration is a type reference.
     * - from: React.FC<Props>
     * - to: React.FC<Props & { children?: React.ReactNode }>
     */
    const isTypeReference =
      declaration
        .getTypeNodeOrThrow()
        .getFirstChildByKind(SyntaxKind.TypeReference) != null;

    if (isTypeReference) {
      const typeNode = declaration.getTypeNodeOrThrow();
      const [genericType, , innerType] = typeNode.getChildren();

      if (genericType != null && innerType != null) {
        const newInnerType = `${innerType.getText()} & { children?: React.ReactNode }`;
        const newTypeAnnotation = `${genericType.getText()}<${newInnerType}>`;

        declaration.setType(newTypeAnnotation);

        insertComment(sourceFile, declaration);
      }

      if (genericType != null && innerType == null) {
        const newInnerType = `{ children?: React.ReactNode }`;
        const newTypeAnnotation = `${genericType.getText()}<${newInnerType}>`;

        declaration.setType(newTypeAnnotation);

        insertComment(sourceFile, declaration);
      }
      return;
    }

    /**
     * NOTE:
     * - Check if the declaration is a type reference.
     * - from: React.FC<{ hoge:fuga }>
     * - to: React.FC<{ hoge:fuga; children?: React.ReactNode }>
     */
    const isTypeLiteral =
      declaration
        .getTypeNodeOrThrow()
        .getFirstChildByKind(SyntaxKind.TypeLiteral) != null;

    if (isTypeLiteral) {
      const typeNode = declaration.getTypeNodeOrThrow();
      const [genericType] = typeNode.getChildren();
      const innerType = typeNode.getFirstChildByKind(SyntaxKind.TypeLiteral);

      if (genericType != null && innerType != null) {
        innerType.addProperty({
          name: "children?",
          type: "React.ReactNode",
        });

        insertComment(sourceFile, declaration);
      }
      return;
    }

    /**
     * NOTE:
     * - Check if the declaration is a empty.
     * - from: React.FC
     * - to: React.FC<{ children?: React.ReactNode }>
     */
    const isEmpty = declaration.getTypeNodeOrThrow().getChildCount() === 1;

    if (isEmpty) {
      const typeNode = declaration.getTypeNodeOrThrow();
      const [genericType] = typeNode.getChildren();

      const newTypeAnnotation = `${genericType.getText()}<{ children?: React.ReactNode }>`;

      declaration.setType(newTypeAnnotation);

      insertComment(sourceFile, declaration);
    }
  });

  sourceFile.saveSync();

  return sourceFile;
};
