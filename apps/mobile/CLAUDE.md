# CLAUDE.md

本仓库以 `AGENTS.md` 作为唯一事实来源；本文件只保留 Claude Code 高频执行规则，避免两份说明漂移。

## 必读文档（开始任何 vibe coding 前）

- 产品需求 → [`../../docs/prd-v1.md`](../../docs/prd-v1.md)（v1 范围）
- 领域术语 → [`../../CONTEXT.md`](../../CONTEXT.md)
- v1 明确不做项 / 关键决策 → 见 `apps/mobile/AGENTS.md` "v1 产品定位"段


## 关键约定

- 使用 `corepack pnpm ...` 执行包管理和项目脚本。
- 新增原型代码默认放在 `apps/mobile/src/features/yixiang`，除非确实属于共享基础能力。
- 使用 `@/` 绝对导入。
- 保持 Tab-first 流程，不要重新启用登录或 onboarding 跳转，除非用户明确要求。
- 可滚动移动端页面使用 `apps/mobile/src/features/yixiang/components/primitives.tsx` 中的 `Screen` 和 `PageScroll`。
- 继续使用本地 mock 数据和 Zustand 交互状态，直到引入后端 API。
- 优先使用 Expo 配置，不直接改原生目录。
- 日常 Web Coding 可用 `corepack pnpm run mobile:web -- --port 8081` 快速预览；视觉和移动端交互改动最终仍要在 iOS Simulator 验证。

## 常用检查

```sh
corepack pnpm run lint
corepack pnpm run type-check
corepack pnpm test --runInBand
```
