import { assertEquals } from "jsr:@std/assert";
import { Project } from "ts-morph";
import { convert } from "./insert-children-instant.ts";

Deno.test("Add FC Children", () => {
  const map = [
    // React.FC
    [
      `
      import React from "react";

      export const Component: React.FC = ({ children }) => <div />;
      `,
      `
      import React from "react";

      // Automatically added by react-migration-insert-children
export const Component: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import React from "react";

      export const Component: React.FC<{}> = ({ children }) => <div />;
      `,
      `
      import React from "react";

      // Automatically added by react-migration-insert-children
export const Component: React.FC<{
              children?: React.ReactNode;
}> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import React from "react";

      export const Component: React.FC<{ hoge:string }> = ({ children }) => <div />;
      `,
      `
      import React from "react";

      // Automatically added by react-migration-insert-children
export const Component: React.FC<{ hoge:string
              children?: React.ReactNode;
 }> = ({ children }) => <div />;
 `,
    ],
    [
      `
      import React from "react";

      export const Component: React.FC<Props> = ({ children }) => <div />;
      `,
      `
      import React from "react";

      // Automatically added by react-migration-insert-children
export const Component: React.FC<Props & { children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import React from "react";

      export const Component: React.FC<Props & Hoge> = ({ children }) => <div />;
      `,
      `
      import React from "react";

      // Automatically added by react-migration-insert-children
export const Component: React.FC<Props & Hoge & { children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import React from "react";

      export const Component: React.FC<Props & { hoge:string }> = ({ children }) => <div />;
      `,
      `
      import React from "react";

      // Automatically added by react-migration-insert-children
export const Component: React.FC<Props & { hoge:string } & { children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    // FC
    [
      `
      import { FC } from "react";

      export const Component: FC = ({ children }) => <div />;
      `,
      `
      import { FC } from "react";

      // Automatically added by react-migration-insert-children
export const Component: FC<{ children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import { FC } from "react";;

      export const Component: FC<{}> = ({ children }) => <div />;
      `,
      `
      import { FC } from "react";;

      // Automatically added by react-migration-insert-children
export const Component: FC<{
              children?: React.ReactNode;
}> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import { FC } from "react";;

      export const Component: FC<{ hoge:string }> = ({ children }) => <div />;
      `,
      `
      import { FC } from "react";;

      // Automatically added by react-migration-insert-children
export const Component: FC<{ hoge:string
              children?: React.ReactNode;
 }> = ({ children }) => <div />;
 `,
    ],
    [
      `
      import { FC } from "react";;

      export const Component: FC<Props> = ({ children }) => <div />;
      `,
      `
      import { FC } from "react";;

      // Automatically added by react-migration-insert-children
export const Component: FC<Props & { children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import { FC } from "react";;

      export const Component: FC<Props & Hoge> = ({ children }) => <div />;
      `,
      `
      import { FC } from "react";;

      // Automatically added by react-migration-insert-children
export const Component: FC<Props & Hoge & { children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
    [
      `
      import { FC } from "react";;

      export const Component: FC<Props & { hoge:string }> = ({ children }) => <div />;
      `,
      `
      import { FC } from "react";;

      // Automatically added by react-migration-insert-children
export const Component: FC<Props & { hoge:string } & { children?: React.ReactNode }> = ({ children }) => <div />;
      `,
    ],
  ];

  for (const [input, expected] of map) {
    const project = new Project({
      useInMemoryFileSystem: true,
    });
    const source = project.createSourceFile("example.tsx", input.trim());

    assertEquals(convert(source).getFullText(), expected.trim());
  }
});
