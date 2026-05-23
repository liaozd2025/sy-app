# 颐享健康平台

这是 `颐享健康大讲堂` 的轻量 monorepo。当前可运行应用是 Expo React Native 移动端原型，后续会补充 React 后台管理和 Java / Spring Boot 后端服务。

## 目录结构

```txt
apps/
  mobile/        # Expo React Native App
  admin-web/     # React 后台管理预留目录
packages/
  api-contracts/ # OpenAPI / 生成的 TypeScript client 预留目录
services/
  api/           # Spring Boot 后端服务预留目录
docs/            # 跨端架构、学习和产品文档
```

## 本地运行

```sh
corepack pnpm install
corepack pnpm run mobile:web -- --port 8081
```

打开 `http://localhost:8081` 预览移动端 Web 原型。

移动端常用命令：

```sh
corepack pnpm run mobile:start
corepack pnpm run mobile:ios
corepack pnpm run mobile:android
corepack pnpm run mobile:doctor
```

## 验证

```sh
corepack pnpm run lint
corepack pnpm run type-check
corepack pnpm test --runInBand
```

## 文档

- [移动端项目说明](./apps/mobile/README-project.md)
- [1 周 Expo React Native 速成路线](./docs/learning/expo-react-native-vibe-coding-week.md)

当前首版只使用本地 mock 数据，不包含真实登录、支付、直播推流、视频播放 SDK 或后端接口。
