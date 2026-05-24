# API Contracts

颐享平台的前后端共享 API 契约。**OpenAPI 是单一事实来源**，前后端围绕它生成代码 / 类型 / 文档。

## 当前内容

- [`openapi.yaml`](./openapi.yaml) — v1 端点骨架。详细 schema 在 v1.1 迭代中补全。

## 设计原则（来自 PRD §8）

1. **App / Admin 严格分离**：
   - `/api/app/v1/**` 移动端使用，鉴权用学员手机号 token
   - `/api/admin/v1/**` 管理后台使用，受 Shiro 权限保护
2. **OpenAPI 优先**：前端通过生成的 TypeScript 客户端调用，**禁止手写 axios / fetch**
3. **schema 与 PRD 双向追溯**：每个端点都能在 [`../../docs/prd-v1.md`](../../docs/prd-v1.md) 找到对应模块

## TODO（v1.1）

- [ ] 完善 200 响应的 `components/schemas`
- [ ] 标准化错误响应（`ApiError`）
- [ ] 标准化分页参数（`pageNum / pageSize`）
- [ ] 加入火山引擎 webhook 回调端点（如有）
- [ ] 配置 OpenAPI codegen 脚本：
  - `apps/mobile` 用 `openapi-typescript` 或 `orval` 生成 TS client
  - `apps/admin-web` 用 `openapi-typescript`
- [ ] CI 校验 OpenAPI 文件有效性
