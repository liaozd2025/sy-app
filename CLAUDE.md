# 颐享健康平台 (sy-app)

## 项目概述

私域直播学习平台，面向私域老板客户提供学习功能。

## 技术栈

| 应用 | 技术 |
|------|------|
| 移动端 APP | Expo + React Native + Tailwind CSS |
| 后台管理 Web | React |
| 后端服务 | Java 17 + Spring Boot 3.x + Spring Cloud |
| 包管理 | pnpm (corepack) |

## Monorepo 结构

```
sy-app/
├── apps/
│   ├── mobile/          # Expo React Native 应用
│   │   ├── ios/         # iOS 原生项目 (Expo prebuild)
│   │   ├── android/      # Android 原生项目 (Expo prebuild)
│   │   └── ...
│   └── admin-web/       # React 后台管理 (预留)
├── packages/
│   └── api-contracts/   # OpenAPI 契约与生成的客户端
├── services/
│   └── api/              # Java Spring Boot 后端 (预留)
├── docs/                 # 产品与架构文档
└── cli/                  # CLI 工具
```

## 常用命令

```sh
# 安装依赖
corepack pnpm install

# 移动端开发
corepack pnpm run mobile:web      # Web 预览 (port 8081)
corepack pnpm run mobile:ios      # iOS 模拟器
corepack pnpm run mobile:android  # Android

# 代码检查
corepack pnpm run lint
corepack pnpm run type-check
corepack pnpm run test
```

## 核心约定

- **移动端开发规则**: 参考 `apps/mobile/CLAUDE.md`
- **API 契约优先**: 前后端集成使用 `packages/api-contracts` 中的 OpenAPI schema
- **App 与 Admin API 分离**: 后端区分 `/api/app/v1/**` 和 `/api/admin/v1/**`
- **不直接修改原生目录**: iOS/Android 原生代码通过 Expo 配置管理

## 当前状态

- `apps/mobile`: 可运行的 Expo 原型，使用本地 mock 数据
- `apps/admin-web`: 预留占位
- `services/api`: 预留占位，尚未创建 Spring Boot 项目
- `packages/api-contracts`: 预留占位，尚未创建 schema

## 重要路径

- 移动端源码: `apps/mobile/src/`
- 移动端页面路由: `apps/mobile/src/app/` (expo-router)
- 移动端功能模块: `apps/mobile/src/features/`
- 移动端共享组件: `apps/mobile/src/components/`