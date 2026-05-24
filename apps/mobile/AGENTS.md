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

## v1 产品定位（必读 — 详见 PRD）

**颐享平台是面向一级经销商的"严肃打卡型" B 端培训 App**，不是 C 端品牌产品。所有功能围绕"看直播 → 学课程 → 答题 → 攒积分 → 兑福利"的内向闭环。

**唯一事实来源**：
- 产品需求 → [`../../docs/prd-v1.md`](../../docs/prd-v1.md)
- 领域术语 → [`../../CONTEXT.md`](../../CONTEXT.md)
- 关键决策 → [`../../server/docs/adr/`](../../server/docs/adr/)
- API 契约 → [`../../packages/api-contracts/openapi.yaml`](../../packages/api-contracts/openapi.yaml)

**v1 明确不做（即使原型/DB 已有也不要启用）**：

| 模块 | 状态 | 原因 |
|------|------|------|
| 社区 Feed / 评论 / 收藏 / 点赞 / 关注 | UI 隐藏，DB 保留 | ADR-0007 |
| 分享给客户 / 海报生成 | v2 | ADR-0007 |
| 排行榜 | v2 | ADR-0007 |
| 推送通道（APNs/FCM/极光） | 不接 | ADR-0006 |
| 短信通知（非登录场景） | 不接 | ADR-0006 |
| 直播间自建聊天 / 资料下载 / 互动 | 全交火山引擎 | ADR-0005 |
| 直播与课程关联 | 解耦 | ADR-0004 |
| 简答题 / 防作弊 / 及格线 / 认证考 | 不做 | ADR-0003 |
| 实物商城物流 / ERP 对接 | 不做 | ADR-0008 |

**v1 做但易混淆的细节**：

- 直播间页面 = **纯 WebView**，不在直播间内叠加任何聊天 / 互动 / 资料 UI
- 公告 = **仅 App 内首页置顶 + 通知中心**，不推送、不发短信
- 兑换福利 = 拿"兑换码"，**线下发货**，App 不参与物流
- 晶升等级 = **纯虚拟身份**，不联动进货价/返点

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
