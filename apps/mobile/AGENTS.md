# 颐享健康大讲堂 Mobile Agent Guide

## Project Overview

`apps/mobile` is the Expo React Native prototype for `颐享健康大讲堂`, a private-domain health education app based on `obytes/react-native-template-obytes`.

The first demo focuses on five bottom tabs:

- `首页`: brand header, live hero card, quick entries, today activities, health learning grid.
- `直播`: live/replay/reservation list with local reservation toggles.
- `健康`: search, category filters, health article/video list, quiz and encyclopedia entries.
- `题库`: daily single-choice practice with locked answer state and explanation.
- `我的`: member summary, learning progress, reservations, favorites, consultation and quiz progress.

This version uses local mock data only. It does not include real login, payment, livestream push, video SDK, CMS, or backend APIs.

## Stack

- Expo SDK 54 with React Native 0.81.5 and React 19.
- TypeScript with strict checking.
- Expo Router 6 for file-based routing.
- Uniwind / Tailwind CSS utilities from `apps/mobile/src/global.css`.
- Zustand for prototype interaction state.
- React Query, TanStack Form, Zod, and MMKV are available from the Obytes base template.
- Jest and React Testing Library for tests.

Use `corepack pnpm` from the monorepo root. The repo pins `pnpm@10.12.3`.

## Key Paths

- `apps/mobile/src/app/(app)/_layout.tsx`: tab navigator. Auth and onboarding are bypassed for the prototype.
- `apps/mobile/src/app/(app)/index.tsx`: home tab.
- `apps/mobile/src/app/(app)/live.tsx`: live tab.
- `apps/mobile/src/app/(app)/health.tsx`: health tab.
- `apps/mobile/src/app/(app)/quiz.tsx`: quiz tab.
- `apps/mobile/src/app/(app)/profile.tsx`: profile tab.
- `apps/mobile/src/app/course/[id].tsx`: course detail placeholder.
- `apps/mobile/src/app/content/[id].tsx`: health content detail placeholder.
- `apps/mobile/src/features/yixiang/mock-data.ts`: local Chinese demo data.
- `apps/mobile/src/features/yixiang/store.ts`: Zustand state for reservations, favorites, answers, and live filter.
- `apps/mobile/src/features/yixiang/types.ts`: prototype domain types.
- `apps/mobile/src/features/yixiang/components/primitives.tsx`: shared screen, scroll, text, pill, icon, and progress primitives.
- `apps/mobile/env.ts`: app name, schemes, bundle IDs, packages, and environment validation.
- `apps/mobile/app.config.ts`: Expo app configuration.

## Commands

```sh
corepack pnpm install
corepack pnpm run mobile:web -- --port 8081
corepack pnpm run mobile:ios
corepack pnpm run mobile:android
corepack pnpm run lint
corepack pnpm run type-check
corepack pnpm test --runInBand
```

For iOS development, Xcode and an iOS Simulator are required. The development bundle identifier is `com.yixiang.health.development`.

## Web Coding Workflow

- Use `corepack pnpm run mobile:web -- --port 8081` for fast preview and interaction checks.
- Web preview is only a fast feedback loop; layout, visual, or mobile interaction changes still need iOS Simulator validation.
- When Web and iOS rendering differ, prefer the iOS prototype experience, especially safe areas, scrolling, bottom navigation, and Chinese text wrapping.

## Implementation Rules

- Keep mobile feature work under `apps/mobile/src/features/yixiang` unless a piece is truly shared across the app.
- Use absolute imports with the `@/` alias.
- Keep Chinese product copy and demo data local in the feature module until a backend contract exists.
- Use the existing Zustand store for lightweight prototype state.
- Prefer Expo config and plugins over direct `apps/mobile/ios` or `apps/mobile/android` edits.
- Preserve the tab-first app flow. Do not reintroduce login or onboarding redirects unless explicitly requested.
- Wrap vertical pages with the shared `Screen` and `PageScroll` primitives so safe areas, bottom spacing, and visible scroll indicators remain consistent on iOS.
- For critical layout containers, keep explicit React Native `style` fallbacks in addition to utility classes. iOS simulator rendering previously exposed blank content when root flex styles only relied on class names.
- Maintain the visual direction from the drafts: warm off-white background, black primary text, red-brown accent, thin borders, large rounded cards, and Chinese title styling.
- Do not add real payment, livestream, video SDK, or member authentication in the prototype without a separate product decision.

## Testing Checklist

Run these before handing off code changes:

```sh
corepack pnpm run lint
corepack pnpm run type-check
corepack pnpm test --runInBand
```

For UI changes, also launch the app on iOS Simulator and check:

- all five tabs are reachable;
- lists scroll and show scroll affordance;
- bottom navigation stays fixed;
- Chinese text does not overlap or overflow;
- reservation, favorite, live filter, and quiz answer states work locally.

## Notes For Future Agents

- `apps/mobile/uniwind-types.d.ts` is generated and intentionally ignored by ESLint.
- Some original Obytes template routes and tests remain in the mobile app; do not assume they are part of the `颐享` demo flow.
- If introducing real APIs, define a small typed boundary first and keep mock data usable for demo mode.
