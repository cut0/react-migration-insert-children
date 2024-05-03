# React Migration Insert Children

After React18, `children: React.Node` was removed from `React.FC`.
This tool is a migration tool that inserts the required children when transitioning from versions earlier than React18 to React18.

```diff
export const Component: React.FC <{
  hoge:string
+ children?: React.ReactNode
}> = ({ children }) => <div/>
```

It offers an **"Instant Mode"** for simple migration and an **"Advanced Mode"** to achieve more sophisticated migration.

- [Instant Mode](./InstantMode.md)
- [Advanced Mode](./AdvancedMode.md)

## How To Use

Comming Soon.

It can be executed via commands from the shell.

```shell

```

## Keywords

- React
- React18
- React.FC
- Insert Children
- Codemod
- Migration
- ts-morph
- Deno
