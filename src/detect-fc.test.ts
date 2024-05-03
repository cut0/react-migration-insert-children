import { assertEquals } from "jsr:@std/assert";
import { Project } from "ts-morph";
import { isChildrenRefered, isFcDeclartion } from "./detect-fc.ts";

Deno.test("Detect FC declaration", () => {
  const map = [
    [
      `
      type Hoge = {}

      export const Component: Hoge = ({ children }) => <div />;
      `,
      false,
    ],
    [
      `
      export const Component: React.FC = ({ children }) => <div>{children}</div>;

      `,
      true,
    ],
    [
      `
      export const Component: React.FC<Props> = ({ children }) => <div>{children}</div>;

      `,
      true,
    ],
    [
      `
      export const Component: FC = ({ children }) => <div>{children}</div>;

      `,
      true,
    ],
    [
      `
      export const Component: FC<Props> = ({ children }) => <div />;
      `,
      true,
    ],
  ] as const;

  for (const [input, expected] of map) {
    const project = new Project({
      useInMemoryFileSystem: true,
    });
    const source = project.createSourceFile("example.tsx", input);

    const variableDeclartion =
      source.getVariableDeclarationOrThrow("Component");

    const result = isFcDeclartion(variableDeclartion);

    assertEquals(result, expected);
  }
});

Deno.test("Detect children refered", () => {
  const map = [
    [
      `
      export const Component = ({ children }) => <div />;
      `,
      true,
    ],
    [
      `
      export const Component = ({ something }) => <div />;
      `,
      false,
    ],
    [
      `
      export const Component = (props) => <div />;
      `,
      false,
    ],
    [
      `
      export const Component = () => <div />;
      `,
      false,
    ],
  ] as const;

  for (const [input, expected] of map) {
    const project = new Project({
      useInMemoryFileSystem: true,
    });
    const source = project.createSourceFile("example.tsx", input);

    const variableDeclartion =
      source.getVariableDeclarationOrThrow("Component");

    const result = isChildrenRefered(variableDeclartion);

    assertEquals(result, expected);
  }
});
