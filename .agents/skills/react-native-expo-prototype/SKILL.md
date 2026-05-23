---
name: react-native-expo-prototype
description: Work on this Expo React Native health education prototype, including routes, mock data, Zustand state, iOS layout, and visual QA.
---

# React Native Expo Prototype Skill

Use this skill when changing the `颐享健康大讲堂` mobile prototype.

## Workflow

1. Read root `AGENTS.md` and `apps/mobile/AGENTS.md` for current project conventions.
2. Keep app-facing changes in `apps/mobile/src/features/yixiang` and routes in `apps/mobile/src/app/(app)` unless the task clearly requires shared infrastructure.
3. Use local mock data and the existing Zustand store for prototype interactions.
4. Wrap scrollable pages in `Screen` and `PageScroll`.
5. Use `corepack pnpm` from the monorepo root for installs, scripts, and checks.

## Verification

Run:

```sh
corepack pnpm run lint
corepack pnpm run type-check
```

For UI changes, also run on iOS Simulator and check that each tab renders, scrolls, and keeps the bottom navigation fixed.
