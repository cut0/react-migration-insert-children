# Advanced Mode

This has a bit of a learning curve in advanced migration mode.

※ It works with both `React.FC` and `FC`.

## Case 1

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

## Case 2

```tsx
export const Component: React.FC = ({ children }) => <div />;
```

```tsx
export const Component: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div />;
```

## Case 3

```tsx
export const Component: React.FC<{}> = ({ children }) => <div />;
```

```tsx
export const Component: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => <div />;
```

## Case 4

```tsx
export const Component: React.FC<{ hoge: string }> = ({ children }) => <div />;
```

```tsx
export const Component: React.FC<{
  hoge: string;
  children?: React.ReactNode;
}> = ({ children }) => <div />;
```

## Case 5

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

## Case 6

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
