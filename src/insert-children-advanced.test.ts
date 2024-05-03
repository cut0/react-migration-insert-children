import { assertEquals } from "jsr:@std/assert";
import { Project } from "ts-morph";
import { convert } from "./insert-children-advanced.ts";

Deno.test("Add FC Children", () => {
  const map = [
    [
      `
      export type Props = {
        hoge: string;
      };

      export const Component: React.FC<Props> = ({ children }) => <div />;
      `,
      `
      export type Props = {
        hoge: string;
    children?: React.ReactNode;
      };

      export const Component: React.FC<Props> = ({ children }) => <div />;
      `,
    ],
    [
      `
      export type Props = {
        hoge: string;
      };

      export const Component: FC<Props> = ({ children }) => <div />;
      `,
      `
      export type Props = {
        hoge: string;
    children?: React.ReactNode;
      };

      export const Component: FC<Props> = ({ children }) => <div />;
      `,
    ],
    [
      `
      export const Component: React.FC = ({ children }) => <div />;
      `,
      `
      export const Component: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      export const Component: FC = ({ children }) => <div />;
      `,
      `
      export const Component: FC<{ children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      export const Component: React.FC<{}> = ({ children }) => <div />;
      `,
      `
      export const Component: React.FC<{
        children?: React.ReactNode;
}> = ({ children }) => <div />;
      `,
    ],
    [
      `
      export const Component: FC<{}> = ({ children }) => <div />;
      `,
      `
      export const Component: FC<{
        children?: React.ReactNode;
}> = ({ children }) => <div />;
      `,
    ],
    [
      `
      export const Component: React.FC<{ hoge:string }> = ({ children }) => <div />;
      `,
      `
      export const Component: React.FC<{ hoge:string
        children?: React.ReactNode;
 }> = ({ children }) => <div />;
`,
    ],
    [
      `
      export const Component: FC<{ hoge:string }> = ({ children }) => <div />;
      `,
      `
      export const Component: FC<{ hoge:string
        children?: React.ReactNode;
 }> = ({ children }) => <div />;
`,
    ],
    [
      `
      type Hoge = {
        hoge: string;
      }

      export type Props = Hoge;

      export const Component: React.FC<Props> = ({ children }) => <div />;
      `,
      `
      type Hoge = {
        hoge: string;
    children?: React.ReactNode;
      }

      export type Props = Hoge;

      export const Component: React.FC<Props> = ({ children }) => <div />;
      `,
    ],
    [
      `
      type Hoge = {
        hoge: string;
      }

      export type Props = Hoge;

      export const Component: FC<Props> = ({ children }) => <div />;
      `,
      `
      type Hoge = {
        hoge: string;
    children?: React.ReactNode;
      }

      export type Props = Hoge;

      export const Component: FC<Props> = ({ children }) => <div />;
      `,
    ],
    [
      `
      type Hoge = {
        hoge: string;
      }

      export type Props = Hoge & { fuga:string; };

      export const Component: React.FC<Props> = ({ children }) => <div />;
      `,
      `
      type Hoge = {
        hoge: string;
      }

      export type Props = Hoge & { fuga:string;
          children?: React.ReactNode;
 };

      export const Component: React.FC<Props> = ({ children }) => <div />;
      `,
    ],
    [
      `
      type Hoge = {
        hoge: string;
      }

      export type Props = Hoge & { fuga:string; };

      export const Component: FC<Props> = ({ children }) => <div />;
      `,
      `
      type Hoge = {
        hoge: string;
      }

      export type Props = Hoge & { fuga:string;
          children?: React.ReactNode;
 };

      export const Component: FC<Props> = ({ children }) => <div />;
      `,
    ],
  ];

  for (const [input, expected] of map) {
    const project = new Project({
      useInMemoryFileSystem: true,
    });
    const source = project.createSourceFile("example.tsx", input.trim());

    assertEquals(convert(source).getText(), expected.trim());
  }
});
