# React Migration Insert Children

After React18, `children: React.Node` was removed from `React.FC`.
This tool is a migration tool that inserts the required children when transitioning from versions earlier than React18 to React18.

It offers an **"Instant Mode"** for simple migration and an **"Advanced Mode"** to achieve more sophisticated migration.

## How To Use

Comming Soon.

It can be executed via commands from the shell.

```shell

```

## Instant Mode

This is instant migration and insert migrated comment.

※ It works with both `React.FC` and `FC`.

### Case 1

```tsx
import React from "react";

export const Component: React.FC = ({ children }) => <div />;
```

```tsx
import React from "react";

// Automatically added by react-migration-insert-children
export const Component: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div />;
```

### Case 2

```tsx
import React from "react";

export const Component: React.FC<{}> = ({ children }) => <div />;
```

```tsx
import React from "react";

// Automatically added by react-migration-insert-children
export const Component: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => <div />;
```

### Case 3

```tsx
import React from "react";

export const Component: React.FC<{ hoge: fuga }> = ({ children }) => <div />;
```

```tsx
import React from "react";

// Automatically added by react-migration-insert-children
export const Component: React.FC<{
  hoge: fuga;
  children?: React.ReactNode;
}> = ({ children }) => <div />;
```

### Case 4

```tsx
import React from "react";

export const Component: React.FC<Props> = ({ children }) => <div />;
```

```tsx
import React from "react";

// Automatically added by react-migration-insert-children
export const Component: React.FC<Props & { children?: React.ReactNode }> = ({
  children,
}) => <div />;
```

### Case 5

```tsx
import React from "react";

export const Component: React.FC<Props & Hoge> = ({ children }) => <div />;
```

```tsx
import React from "react";

// Automatically added by react-migration-insert-children
export const Component: React.FC<
  Props & Hoge & { children?: React.ReactNode }
> = ({ children }) => <div />;
```

### Case 6

```tsx
import React from "react";

export const Component: React.FC<Props & { hoge: string }> = ({ children }) => (
  <div />
);
```

```tsx
import React from "react";

// Automatically added by react-migration-insert-children
export const Component: React.FC<
  Props & { hoge: string } & { children?: React.ReactNode }
> = ({ children }) => <div />;
```

## Advanced Mode

This has a bit of a learning curve in advanced migration mode.

※ It works with both `React.FC` and `FC`.

### Case 1

```tsx
export type Props = {
  hoge: string;
};

export const Component: React.FC<Props> = ({ children }) => <div />;
```

```tsx
export type Props = {
  hoge: string;
  children?: React.ReactNode;
};

export const Component: React.FC<Props> = ({ children }) => <div />;
```

### Case 2

```tsx
export const Component: React.FC = ({ children }) => <div />;
```

```tsx
export const Component: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div />;
```

### Case 3

```tsx
export const Component: React.FC<{}> = ({ children }) => <div />;
```

```tsx
export const Component: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => <div />;
```

### Case 4

```tsx
export const Component: React.FC<{ hoge: string }> = ({ children }) => <div />;
```

```tsx
export const Component: React.FC<{
  hoge: string;
  children?: React.ReactNode;
}> = ({ children }) => <div />;
```

### Case 5

```tsx
type Hoge = {
  hoge: string;
};

export type Props = Hoge;

export const Component: React.FC<Props> = ({ children }) => <div />;
```

```tsx
type Hoge = {
  hoge: string;
  children?: React.ReactNode;
};

export type Props = Hoge;

export const Component: React.FC<Props> = ({ children }) => <div />;
```

```tsx
type Hoge = {
  hoge: string;
};

export type Props = Hoge & { fuga: string };

export const Component: React.FC<Props> = ({ children }) => <div />;
```

```tsx
type Hoge = {
  hoge: string;
};

export type Props = Hoge & { fuga: string; children?: React.ReactNode };

export const Component: React.FC<Props> = ({ children }) => <div />;
```

## Keywords

- React
- React18
- React.FC
- Insert Children
- Codemod
- Migration
- Deno
