# 典恒直播 APP v1 — 产品需求文档（PRD）

> **本文档定位**：vibe coding 可直接喂给 AI 编码助手（Claude / Cursor / Copilot）作为上下文的产品需求文档。
> **决策来源**：2026-05-24 与产品负责人 grill 访谈（10 轮交互式确认）。
> **代码现状**：`apps/mobile` 有 Expo RN 原型；`server/` 有 RuoYi 基底；`server/sql/dh_live_app.sql` 已有 28 张表初稿。本 PRD 在已有现状基础上**收敛** v1 范围。
> **配套文档**：
> - 领域术语表见 [`CONTEXT.md`](../CONTEXT.md)
> - 关键技术决策见 [`server/docs/adr/`](../server/docs/adr/)
> - DB schema 增量见 [`server/sql/v1_schema_increment.sql`](../server/sql/v1_schema_increment.sql)
> - API 契约见 [`packages/api-contracts/openapi.yaml`](../packages/api-contracts/openapi.yaml)

---

## 1. 背景（Context）

### 1.1 为什么做这个项目
典恒是一家私域健康产品公司，已有一支**一级经销商**队伍。总部需要一个工具让经销商：
1. **持续学产品**（新品上市、政策更新、产品深度知识）
2. **持续学健康知识**（增强经销商在终端用户面前的专业感）
3. **被总部组织化触达**（必修课、官方公告、统一动作）

总部期望：**经销商越懂，终端用户服务越好，复购越稳**。

### 1.2 为什么写这份 PRD
- `apps/mobile` 已经画完一批静态原型，但偏 C 端视感；后端 DB 已设计 28 张表，但前后端业务定位未在文档中收敛
- 进入 vibe coding 阶段前，需要一份对齐**用户、模块、数据模型、v1 边界**的产品需求文档，避免 AI 代码生成时把方向跑偏
- 同时识别"现有 DB ≠ v1 业务决策"的冲突点，单独立 ADR

### 1.3 v1 一句话总结
> **面向一级经销商的"严肃打卡型"学习培训 App：看总部直播 → 学课程 → 答题 → 攒积分 → 兑福利。**
> v1 极度收敛、内向闭环：无社区、无分享、无榜单、无推送、无认证考。

---

## 2. 核心设计原则（Vibe Coding 时必读）

| # | 原则 | 含义 |
|---|------|------|
| P1 | **纯 B 端培训定位** | 用户是一级经销商，**不是终端消费者**。健康内容是"知识弹药库"，不是 C 端品牌内容 |
| P2 | **轻量激励、不施压** | 不卡及格、不防作弊、不发通报。学员是被赋能而非被考核的对象 |
| P3 | **内向闭环** | v1 无对外分享、无社区互动、无横向比较。所有动作都在"我自己 → 学 → 攒 → 兑"循环内完成 |
| P4 | **WebView 优先** | 直播间裸用火山引擎 WebView，App 不在直播间内叠加任何 UI。能用 H5 解决的不写原生 |
| P5 | **运营驱动** | v1 几乎所有触达都依赖运营：兑换码、必修课、首页置顶。App 是工具，运营才是引擎 |
| P6 | **现有 DB 优先复用** | 28 张表初稿尽量沿用，只在必要时增/改/弃。所有 schema 变更必须在 §7 列明 |
| P7 | **App / Admin API 分离** | 后端按 `/api/app/v1/**` 和 `/api/admin/v1/**` 严格分两套，鉴权与字段裁剪独立 |

---

## 3. 用户与角色

| 角色 | 说明 | 入口 | v1 范围 |
|------|------|------|---------|
| **一级经销商学员** | 唯一的 App 用户。所有人平等，无上下级；每人归属一家经销商公司（organization） | `apps/mobile` App | ✅ |
| **总部运营 / 管理员** | 在 admin-web 上管理一切（学员、公司、课程、题库、内容、福利、公告） | `apps/admin-web`（待建） | ✅ |
| **讲师 (creator)** | **仅为"内容署名"**。不绑账号、不登录、不发权限。所有内容由运营在 admin-web 代上传，封面署名 creator | 无 | ⚠️ 仅 DB 实体 |

**v1 明确不存在**：终端消费者账号、二级经销商账号、经销商上下级关系、讲师独立后台、讲师 App。

---

## 4. 核心业务闭环

```
                    ┌─────────────────────────────────────┐
                    │     总部 admin-web (运营)            │
                    │  发课/发直播/发公告/发兑换码/导白名单    │
                    └──────────────┬──────────────────────┘
                                   │
                                   ↓
   ┌───────────────────────────────────────────────────────────┐
   │  一级经销商 App（apps/mobile）                              │
   │                                                            │
   │   [首页]──→ [必修课 + 直播预告 + 公告]                       │
   │     │                                                      │
   │     ├──→ 学课程 (录播+图文+题章节) ──→ 完成章节 +积分        │
   │     │                                ──→ 完成结业考 +积分    │
   │     │                                ──→ 完成必修课 +积分    │
   │     │                                                      │
   │     ├──→ 看直播 (WebView 嵌火山引擎) ──→ 完整观看 +积分      │
   │     │                                                      │
   │     ├──→ 每日一题 (签到+答题) ──→ +积分 / 连签奖励           │
   │     │                                                      │
   │     ├──→ 百科 (随手查)                                      │
   │     │                                                      │
   │     ├──→ 健康内容 (文章/视频，仅 App 内消费)                  │
   │     │                                                      │
   │     └──→ 个人中心 ──→ 积分账户 → 商城兑换 → 拿兑换码         │
   │                  ──→ 晶升等级（青铜/白银/黄金/钻石徽章）       │
   │                                                            │
   └───────────────────────────────────────────────────────────┘
                                   ↑
                                   │ 兑换码线下发货
                    ┌──────────────┴──────────────────────┐
                    │  总部运营人工 / 物流伙伴              │
                    └─────────────────────────────────────┘
```

---

## 5. 功能模块详述

### 5.1 身份与登录

**做什么**：
- 后台运营在 admin-web 创建"经销商公司 (organization)"，再为每家公司导入 1..N 个学员手机号
- 学员在 App 用**手机号 + 短信验证码**登录（无密码、无注册）
- 公司里所有学员账号平等（不区分老板/销售）

**不做什么**：
- ❌ 自助注册
- ❌ 邀请码
- ❌ 微信授权登录（v2 评估）
- ❌ 多端互踢机制（v1 允许多端在线）

**前端路径**：`apps/mobile/src/features/auth/`（已存在）+ onboarding（首启引导，已存在）
**后端路径**：`/api/app/v1/auth/send-sms`、`/api/app/v1/auth/login`

---

### 5.2 学习首页（`apps/mobile` `/` tab）

**布局优先级**（从上到下）：
1. **公告置顶卡**（如有未读官方公告）
2. **进行中的必修课**（带截止倒计时；最多 3 张卡）
3. **今日直播预告**（如果有未来 24h 内的直播）
4. **推荐课程 / 内容**（运营在后台勾选"首页推荐"位）
5. **每日一题入口卡**（提示"今日还有 X 题未答"）

**不做什么**：
- ❌ 个性化推荐算法（v1 全人工运营推荐位）
- ❌ 信息流刷新加载（v1 一屏内容，下拉刷新即可）

---

### 5.3 发现页（`apps/mobile` `/health` tab）

**做什么**：
- 平铺浏览总部健康内容库
- 顶部分类筛选：**直播 / 文章 / 视频**（沿用现有原型）
- 直播子页：分"即将开始 / 直播中 / 可回看 / 已结束"

**不做什么**：
- ❌ 分享给客户（推 v2）
- ❌ 评论 / 点赞 / 收藏（v1 砍互动，DB 表保留）

---

### 5.4 直播模块（仅嵌入式）

**做什么**：
- 直播详情页 = 头图 + 标题 + 主讲人（creator 名字+头像）+ 时间 + 状态 + 简介 + **[进入直播间] 按钮**
- 进入直播间 = 一个 **WebView 全屏页**，加载火山引擎提供的直播间 URL
- **预约功能**：未开播状态可点"预约"，写入 `dh_live_reservation` 表
- **观看记录**：进入/退出直播间时上报时长到 `dh_live_watch_record`，用于积分计算

**不做什么**（火山引擎全包）：
- ❌ App 内自建聊天 UI（`dh_live_chat_message` 表 **删除**）
- ❌ App 内自建点赞/送礼/连麦/禁言
- ❌ App 内显示直播资料下载（`dh_live_material` 表 **删除**；老师在直播里发二维码引导扫码）
- ❌ 开播推送通知（v1 不接 APNs/FCM，仅 App 内首页提醒）
- ❌ 直播与课程关联（直播彻底独立，**`dh_live_session.courseId` 字段废**）

**关键约束**：
- 火山引擎直播 URL 通过后端按 `liveId` 接口下发，不在前端硬编码
- 进入直播间前必须校验"是否已预约"（运营可配置）

详见 [ADR-0005](../server/docs/adr/0005-live-platform-volcengine.md)

---

### 5.5 课程模块（`apps/mobile` `/course/[id]`，已存在原型）

**课程结构**：
- 课程 = 多个章节组成的系列
- 章节 sourceType = `video` | `content` | `quiz`（**v1 移除 `live` 选项**，详见 [ADR-0004](../server/docs/adr/0004-live-course-decoupling.md)）
- 章节自由顺序学习，**不强制顺序解锁**
- 章节完成判定：
  - `video`：观看 ≥80%
  - `content`：浏览 ≥10s（reach to bottom 或 dwell time）
  - `quiz`：答完所有题（不卡正确率）

**必修 vs 选修**：
- 课程表加 `is_required` (boolean) + `deadline` (datetime) + `required_scope` (string, 默认 `'all'`)
- 必修课：总部下发，学员"我的必修"清单可见，带截止倒计时
- 选修课：自由学习
- v1 必修课**不含直播章节**（直播与课程已解耦，无 deadline 与直播开播时间的耦合问题）

**结业考**：
- 课程末尾 quiz 章节 = 结业考
- 不卡及格线，答完即完成
- 积分按准确率比例给（满分 100，答对 80% = 80 分）

---

### 5.6 答题模块（`apps/mobile` `/quiz` tab + 课程内 quiz 章节）

**三个入口**：

| 入口 | 触发 | 题量 | 计分规则 |
|------|------|------|----------|
| 每日一题 | 学习页 tab | 每天 1 题 | 答对 +2 |
| 章节随堂测验 | 课程内 quiz 章节 | 3-5 题 | 答完即过，积分含在课程完成奖励里 |
| 结业考 | 课程末尾 | 10-15 题 | 按准确率比例给 |

**题型**：单选 / 多选 / **判断**（DB `dh_live_quiz_question.type` 枚举需加 `'judge'`）

**不做什么**：
- ❌ 简答题（v2）
- ❌ 防作弊（不倒计时、不防截屏、不打乱题序）
- ❌ 及格线 / 补考机制
- ❌ 错题本（v2）
- ❌ 自由刷题（v2）
- ❌ 产品认证考试 / 证书（v2）

详见 [ADR-0003](../server/docs/adr/0003-learning-hardness.md)

---

### 5.7 积分与晶升

**积分获取规则**（默认值，运营后台可改）：

| 行为 | 积分 |
|------|------|
| 每日签到（首次打开） | +5 |
| 连签 7 天奖励 | +20（一次性）|
| 连签 30 天奖励 | +100（一次性）|
| 看完一场直播（≥80%） | +30 |
| 完成 1 个课程章节 | +10 |
| 完成 1 门必修课 | +100 |
| 完成 1 门选修课 | +50 |
| 每日一题答对 | +2 |
| 结业考 | (题目数 × 5) × 准确率 |
| 评论 / 收藏 / 点赞 / 分享 | **0**（v1 不给分） |

**积分账户**（沿用 `dh_live_member_points_account`）：
- `currentPoints`（当前可消耗）
- `totalEarned`（累计获得，**只增不减、永不过期、晶升依据**）
- `totalConsumed`（累计消耗）

**晶升等级**（看 `totalEarned`，纯阈值制）：

| 等级 | 阈值 | 视觉 |
|------|------|------|
| 见习学员 | 0 | 默认 |
| 进阶学员 | 500 | 铜色徽章 |
| 资深学员 | 2000 | 银色徽章 |
| 金牌讲师 | 5000 | 金色徽章 + 个人页特效 |

**学习时长** 不参与阈值，但作为同等级内的"二级展示"（个人中心展示）。

**不做什么**：
- ❌ 排行榜（v2）
- ❌ 积分过期
- ❌ 季度清零
- ❌ 晶升与 ERP/进货价/返点联动（晶升是纯 App 内虚拟身份）

---

### 5.8 积分商城（兑换码模式）

**核心理念**：v1 不做真电商，**总部运营在后台发"福利兑换码"，学员扣积分领码，线下/异步发货**。

**学员侧流程**：
1. 个人中心 → 积分商城页
2. 浏览"可兑换福利"列表（卡片：图片、名称、所需积分、剩余数量）
3. 点击兑换 → 弹窗确认 → 扣积分 → 弹出"兑换码 + 兑换说明"
4. 兑换码自动存入个人中心 → "我的兑换码"页

**运营侧流程**（admin-web）：
1. 创建福利 SKU（`dh_live_reward_item`）：名称、图片、所需积分、库存上限、说明
2. 批量上传兑换码池（`dh_live_reward_code`）：每个码对应一个 reward_item
3. 学员兑换时自动从池中取出一个未使用的码、标记已使用、记录给谁
4. 兑换记录可导出（v1.5 加）

**不做什么**：
- ❌ 实物物流追踪
- ❌ 退换货
- ❌ 对接 ERP / 第三方电商
- ❌ 积分商城对接微信支付补差

详见 [ADR-0008](../server/docs/adr/0008-reward-code-model.md)

---

### 5.9 百科模块（`apps/mobile` `/encyclopedia`，已有原型）

**做什么**：
- 词条列表 + 分类筛选（节气 / 食材 / 习惯）+ 搜索框
- 词条详情：简介 + 正文 + 相关词条 + 相关课程入口
- **定位：经销商的"客户问起时随手查"快速手册**

**不做什么**：
- ❌ 用户提交词条（运营独家上传）
- ❌ 评论 / 互动

---

### 5.10 健康内容（文章 / 视频）

**做什么**：
- 沿用现有原型（`/content/[id]`）
- 文章 = 富文本渲染；视频 = 内嵌视频播放器
- 浏览即上报"完成"，记入学习时长

**不做什么**：
- ❌ 分享给客户（v2 杀手锏，本期不做）
- ❌ 评论 / 收藏 / 点赞（v1 砍互动）
- ❌ 海报生成

---

### 5.11 总部公告

**做什么**：
- 新增 `dh_live_announcement` 表
- admin-web 创建公告：标题 / 内容（富文本）/ 发布时间 / 对象范围（全员 / 指定公司 / 指定标签）/ 是否置顶
- App 端展示：
  - **首页置顶横幅**（如有未读置顶公告）
  - **个人中心 → 通知中心页**（公告列表 + 阅读状态）

**不做什么**：
- ❌ 推送（不接 APNs/FCM）
- ❌ 短信发送
- ❌ 站内信回复

详见 [ADR-0006](../server/docs/adr/0006-no-push-notifications-v1.md)

---

### 5.12 个人中心（`apps/mobile` `/profile` tab，已有原型）

**展示信息**：
- 头像、昵称、所属经销商公司
- **晶升等级徽章**（大字突出）
- 积分账户（当前/累计/累计消耗）
- 连签天数 / 累计学习时长 / 累计完成课程数
- 入口列表：
  - 我的必修课
  - 我的学习记录
  - 积分商城
  - 我的兑换码
  - 通知中心
  - 设置

**不做什么**：
- ❌ 我的收藏（v1 砍互动，DB 表保留）
- ❌ 我的关注（v1 砍互动）
- ❌ 我的预约（合并到"我的学习记录"）
- ❌ 邀请好友（v1 无邀请机制）

---

### 5.13 总部 admin-web 管理后台（新建项目）

**v1 必做模块**：
- 学员管理（白名单导入、单人增删改、查看个人学习数据）
- 经销商公司管理（CRUD、绑定/解绑学员）
- 课程管理（课程 + 章节 CRUD、必修发布、上下架、首页推荐勾选）
- 题库管理（题目 CRUD、按主题/课程归类、关联到章节/结业考）
- 直播管理（场次 CRUD、火山引擎 URL 配置、关联讲师 creator）
- 内容管理（文章/视频上传、富文本编辑器、封面、关联讲师）
- 百科管理（词条 CRUD）
- 福利商城管理（福利 SKU CRUD + 兑换码池上传 + 兑换记录查看）
- 公告管理（公告 CRUD、对象范围、置顶）
- 讲师管理（creator CRUD，仅作为内容署名）
- 数据看板（v1 基础版）：
  - 总览：DAU、累计学习时长、必修完成率
  - 公司维度：每家公司学习时长 / 完成率排名
  - 课程维度：每门课参学人数 / 完成率 / 平均得分
  - 个人维度：单学员明细页

**不做什么**：
- ❌ 经销商个人后台（v1 不做，所有数据在 App 内看）
- ❌ 讲师独立后台
- ❌ BI 工具集成（Metabase 等）
- ❌ 报表导出 Excel/PDF（v1.5 加）

---

## 6. v1 明确推迟项（防止 vibe coding 跑偏）

| 模块 | v1 状态 | 推迟原因 |
|------|---------|----------|
| 社区 Feed / 评论 / 点赞 / 收藏 / 关注 | **DB 保留，UI 隐藏** | 资源聚焦核心闭环 |
| 分享给客户（带水印 H5 / 海报） | v2 | B 端杀手锏但 v1 不做 |
| 经销商个人后台（H5 或 PC） | v2 评估 | 全部数据 App 内可见 |
| 讲师独立账号 / 后台 / App | v2 评估 | 内容由运营代发 |
| 产品认证考试 / 证书 | v2 | 简化考核 |
| 错题本 / 自由刷题 | v2 | 简化答题 |
| 排行榜 | v2 | v1 无横向比较 |
| 推送通道（APNs / FCM / 极光） | v2 | v1 仅 App 内提醒 |
| 短信通知 | v2 | 仅登录短信用 |
| 邀请好友 / 多层级经销商 | 不做 | v1 锁定单层 |
| 微信授权登录 | v2 | v1 仅手机号 |
| 多端互踢 | v2 | v1 允许多端 |
| 实物商城物流 | 不做 | 兑换码模式取代 |
| 直播间自建聊天 / 资料 / 互动 | 不做 | 火山引擎全包 |
| 在线咨询（`dh_live_consultation`） | DB 保留，v2 启用 | 简化 |

---

## 7. 数据模型增量

### 7.1 新增表

| 表名 | 用途 | 关键字段 |
|------|------|----------|
| `dh_live_organization` | 经销商公司 | orgId, orgCode, name, region, status, createTime |
| `dh_live_announcement` | 总部公告 | annId, title, content, publishTime, scope(all/org/tag), isPinned |
| `dh_live_reward_item` | 福利 SKU | itemId, name, image, requiredPoints, stockTotal, stockRemaining, description, status |
| `dh_live_reward_code` | 兑换码池 | codeId, itemId, code, isUsed, usedBy, usedTime |
| `dh_live_member_reward_record` | 学员兑换记录 | recordId, memberId, itemId, codeId, pointsConsumed, exchangeTime |

### 7.2 修改表

| 表名 | 修改 |
|------|------|
| `dh_live_member` | 加字段 `organization_id` BIGINT (FK → dh_live_organization.orgId, nullable, 早期可空) |
| `dh_live_course` | 加字段 `is_required` BOOLEAN, `deadline` DATETIME (nullable), `required_scope` VARCHAR(32) DEFAULT 'all' |
| `dh_live_course` | 修改字段 `courseType` 默认值改为 `'standard'`（不再叫 `'live_series'`） |
| `dh_live_course_chapter` | 修改字段 `sourceType` 枚举：移除 `'live'`，保留 `'video' / 'content' / 'quiz'` |
| `dh_live_quiz_question` | 修改字段 `type` 枚举：加 `'judge'` |

### 7.3 删除 / 弃用字段或表（v1）

| 项 | 处理 | 原因 |
|----|------|------|
| `dh_live_session.courseId` | **删字段** | 直播与课程彻底解耦 |
| `dh_live_chat_message` | **删表**（v1 不建） | 直播聊天交火山 |
| `dh_live_material` | **删表**（v1 不建） | 资料下载不做，老师直播内发二维码 |

### 7.4 v1 保留但不启用的表（UI 隐藏，DB 不动）

`dh_live_feed`, `dh_live_comment`, `dh_live_member_favorite`, `dh_live_member_like`, `dh_live_creator_follow`, `dh_live_consultation`, `dh_live_consultation_reply`, `dh_live_recommendation`

完整迁移 SQL 见 [`server/sql/v1_schema_increment.sql`](../server/sql/v1_schema_increment.sql)。

---

## 8. API 契约骨架

**严格分离**：`/api/app/v1/**` （App 端）与 `/api/admin/v1/**`（admin-web 端）

### 8.1 App 端关键端点（`apps/mobile` 使用）

| 模块 | 端点 |
|------|------|
| 登录 | `POST /api/app/v1/auth/send-sms`<br>`POST /api/app/v1/auth/login` |
| 首页 | `GET /api/app/v1/home/feed` |
| 课程 | `GET /api/app/v1/courses?type=required\|elective`<br>`GET /api/app/v1/courses/{id}`<br>`POST /api/app/v1/courses/{id}/chapters/{chapterId}/complete` |
| 直播 | `GET /api/app/v1/lives?status=upcoming\|live\|playback`<br>`GET /api/app/v1/lives/{id}`<br>`POST /api/app/v1/lives/{id}/reserve`<br>`POST /api/app/v1/lives/{id}/watch-report` |
| 答题 | `GET /api/app/v1/quiz/daily`<br>`POST /api/app/v1/quiz/{id}/answer` |
| 积分 | `GET /api/app/v1/points/account`<br>`GET /api/app/v1/points/log` |
| 商城 | `GET /api/app/v1/rewards`<br>`POST /api/app/v1/rewards/{itemId}/exchange`<br>`GET /api/app/v1/rewards/my-codes` |
| 公告 | `GET /api/app/v1/announcements`<br>`POST /api/app/v1/announcements/{id}/read` |
| 个人 | `GET /api/app/v1/me`<br>`GET /api/app/v1/me/learning-summary` |
| 内容/百科 | `GET /api/app/v1/contents`<br>`GET /api/app/v1/contents/{id}`<br>`GET /api/app/v1/encyclopedia`<br>`GET /api/app/v1/encyclopedia/{id}` |

### 8.2 Admin 端关键端点（admin-web 使用，受 Shiro 权限保护）

- `live:org:*` 公司管理
- `live:member:*` 学员管理（含白名单批量导入）
- `live:course:*` 课程管理
- `live:chapter:*` 章节管理
- `live:quiz:*` 题库
- `live:session:*` 直播场次（**现有 Controller 已存在**）
- `live:content:*` 内容
- `live:encyclopedia:*` 百科
- `live:reward-item:*` 福利 SKU
- `live:reward-code:*` 兑换码池
- `live:announcement:*` 公告
- `live:creator:*` 讲师
- `live:dashboard:*` 数据看板

### 8.3 API 契约管理

- 所有端点必须有 **OpenAPI schema**，沉淀到 [`packages/api-contracts/openapi.yaml`](../packages/api-contracts/openapi.yaml)
- 前端通过生成的 TypeScript 客户端调用，禁止手写 axios

---

## 9. 关键技术决策（ADR）

| # | 标题 | 路径 |
|---|------|------|
| ADR-0001 | 业务定位 = 纯 B 端培训平台 | [`server/docs/adr/0001-business-positioning.md`](../server/docs/adr/0001-business-positioning.md) |
| ADR-0002 | 身份模型 = 白名单单层 + 公司归属 | [`server/docs/adr/0002-identity-model.md`](../server/docs/adr/0002-identity-model.md) |
| ADR-0003 | 学习硬度 = 必修+激励、无及格无认证 | [`server/docs/adr/0003-learning-hardness.md`](../server/docs/adr/0003-learning-hardness.md) |
| ADR-0004 | 直播与课程解耦 | [`server/docs/adr/0004-live-course-decoupling.md`](../server/docs/adr/0004-live-course-decoupling.md) |
| ADR-0005 | 直播形态 = 火山引擎裸用 + WebView | [`server/docs/adr/0005-live-platform-volcengine.md`](../server/docs/adr/0005-live-platform-volcengine.md) |
| ADR-0006 | v1 不接推送通道 | [`server/docs/adr/0006-no-push-notifications-v1.md`](../server/docs/adr/0006-no-push-notifications-v1.md) |
| ADR-0007 | v1 无社交（无榜单/无社区/无分享） | [`server/docs/adr/0007-no-social-v1.md`](../server/docs/adr/0007-no-social-v1.md) |
| ADR-0008 | 积分商城 = 兑换码模式 | [`server/docs/adr/0008-reward-code-model.md`](../server/docs/adr/0008-reward-code-model.md) |

---

## 10. v1 关键风险

| 风险 | 原因 | 缓解 |
|------|------|------|
| 🔴 **留存风险** | v1 无推送 + 无社交 + 无分享 → 经销商打开 App 的高频钩子仅"签到 + 每日一题" | 运营必须高频上新课程/直播/福利；首批必修课节奏要紧 |
| 🔴 **福利吸引力风险** | 整个激励循环依赖兑换码的真实吸引力 | 总部首批福利 SKU 必须够"硬"（实物礼品、年会名额、新品试用） |
| 🟡 **火山引擎能力假设风险** | 假设火山引擎直播 SaaS 提供完整直播间（聊天/互动/回放） | 采购对接阶段逐项确认火山产品形态；若有缺口可能需要补做 |
| 🟡 **内容生产瓶颈** | 课程/题目/百科/内容/福利 全部由总部运营产出 | 上线前总部需储备 ≥ 10 门课程 + ≥ 100 题 + ≥ 30 百科 + ≥ 5 个福利 SKU |
| 🟡 **必修截止时间未约束** | 必修课截止时间是运营自填，没有系统强约束 | admin-web 必修发布表单需提示"截止时间应留足学习周期（建议 ≥ 7 天）" |
| 🟢 **数据迁移风险** | 现有 28 张表已有部分种子数据 | v1 上线前执行 schema migration，对历史数据做兼容处理 |

---

## 11. 验证计划（End-to-End）

v1 上线前必须跑通这 5 条 happy path：

| # | 端到端场景 | 验证手段 |
|---|------------|----------|
| 1 | 白名单 → 登录 → 看必修课 → 学完拿积分 | admin-web 导入手机号 → App 短信登录 → 完成 1 门必修 → 积分 +100 |
| 2 | 首页公告置顶推送 | admin-web 发置顶公告 → App 首页立即看到 → 阅读后置顶消失 |
| 3 | 直播预约 → 看直播 → 完整观看积分 | admin-web 创建直播场次（配火山 URL）→ App 预约 → 进入 WebView → 看完 → 积分 +30 |
| 4 | 每日一题 + 连签 7 天 | 学员连续 7 天打开 App + 答题 → 第 7 天积分 +5 + 一次性 +20 |
| 5 | 积分兑换福利码 | admin-web 创建福利 + 上传码池 → App 商城兑换 → 拿到码 + 积分扣减 → 在"我的兑换码"看到 |

**验证工具**：
- App: `corepack pnpm run mobile:web`（Web 预览）+ `corepack pnpm run mobile:ios`
- Admin-web: 待建项目（v1 可基于 RuoYi-Vue 前端模板 fork）
- 后端: `cd server/dh-admin && mvn spring-boot:run`
- 后端 API 直测: `curl` + Postman 集合（建议沉淀到 `docs/`）
