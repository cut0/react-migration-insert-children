import { SyntaxKind, VariableDeclaration } from "ts-morph";

/**
 * NOTE:
 * - Detect if the declaration is a React.FC declaration.
 */
export const isFcDeclartion = (declaration: VariableDeclaration): boolean => {
  const type = declaration.getType();
  const symbol = type.getAliasSymbol();

  return symbol?.getName() === "FC";
};

/**
 * NOTE:
 * - Detect if the children is refered.
 */
export const isChildrenRefered = (
  declaration: VariableDeclaration,
): boolean => {
  const parameter = declaration
    .getInitializer()
    ?.getFirstChildByKind(SyntaxKind.Parameter);

  /**
   * Is children refered from the component props.
   */
  const hasChildren = parameter
    ?.getFirstChildByKind(SyntaxKind.ObjectBindingPattern)
    ?.getElements()
    .some((element) => element.getNameNode().getText() === "children");
  return hasChildren ?? false;
};
