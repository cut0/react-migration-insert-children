# Instant Mode

This is instant migration and insert migrated comment.

※ It works with both `React.FC` and `FC`.

## Case 1

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

## Case 2

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

## Case 3

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

## Case 4

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

## Case 5

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

## Case 6

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
