<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
颐享健康大讲堂 Mobile App</h1>

> Expo React Native prototype based on [Obytes starter](https://starter.obytes.com).

## Requirements

- React Native / Expo development environment
- Node.js LTS
- Git
- Watchman on macOS or Linux
- Pnpm via Corepack
- Cursor or VS Code

## Quick Start

From the monorepo root:

```sh
corepack pnpm install
corepack pnpm run mobile:web -- --port 8081
```

Open `http://localhost:8081` for the fast Web preview.

Run on native targets:

```sh
corepack pnpm run mobile:ios
corepack pnpm run mobile:android
```

## Verification

From the monorepo root:

```sh
corepack pnpm run lint
corepack pnpm run type-check
corepack pnpm test --runInBand
```

For UI changes, also verify on iOS Simulator.

## Documentation

- [颐享项目 1 周 Expo React Native 速成路线](../../docs/learning/expo-react-native-vibe-coding-week.md)
- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Project structure](https://starter.obytes.com/getting-started/project-structure)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
