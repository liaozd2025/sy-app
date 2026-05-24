# ADR-0004：直播与课程解耦

- **状态**：Accepted
- **日期**：2026-05-24
- **决策者**：产品负责人（grill 访谈 Q4）
- **相关**：[ADR-0005](0005-live-platform-volcengine.md), [PRD §5.4](../../../docs/prd-v1.md#54-直播模块仅嵌入式), [PRD §5.5](../../../docs/prd-v1.md#55-课程模块apps-mobile-courseid已存在原型)

## 背景 (Context)

**现有数据库设计**预设了直播与课程的强关联：

- `dh_live_course.courseType` 默认值是 `'live_series'`（直播系列课）
- `dh_live_session` 表有 `courseId` 字段
- `dh_live_course_chapter.sourceType` 枚举包含 `'live'`（章节可以是一场直播）

设计意图是"**一门课 = 1 场或多场直播 + 配套图文 + 课后题**"的复合形态。

但 grill 访谈中产品负责人明确：**"直播不挂课。课程只是'录播+图文+题'组合，与直播彻底分开。"**

这是一个**业务决策与现有 DB 设计正面冲突**的场景，必须立 ADR。

## 决策 (Decision)

**直播与课程在 v1 完全解耦**：

1. **直播是独立实体**：`dh_live_session` 不再属于任何课程
2. **课程不含直播章节**：`dh_live_course_chapter.sourceType` 仅 `'video' / 'content' / 'quiz'` 三种
3. **课程不再叫"直播系列"**：`courseType` 默认值改为 `'standard'`

### Schema 变更

- **删字段**：`dh_live_session.courseId`
- **改枚举**：`dh_live_course_chapter.sourceType` 移除 `'live'`
- **改默认值**：`dh_live_course.courseType` → `'standard'`

### Service 层影响

- `IDhLiveAdminService` / `IDhLiveAppService` 中如有"按课程查直播列表"的方法，需删除
- 直播创建 API 不再接受 `courseId` 参数
- 课程章节创建 API 校验 `sourceType` 必须在新枚举内

## 后果 (Consequences)

### 正面
- **必修课的截止时间问题消失**：必修课不含直播章节 → 无须考虑"截止时间 > 直播时间"约束
- 直播运营更灵活：老板临时开直播无需先建一门课
- 课程的"完成"判定纯粹基于录播+图文+题，逻辑简化
- 直播间 UI 完全裸用火山引擎（详见 ADR-0005），无须与"课程章节"概念交互

### 负面
- 与现有 DB 设计冲突 → 未来读者读到 `courseType='live_series'` 会困惑
- 失去"系列直播课"概念 → 用户在直播列表里看不到"这场直播属于哪个课程"

### 缓解策略
- 本 ADR 显式存档冲突原因，未来读者可回溯
- 直播详情页可以展示"主讲人的其他课程"作为软关联
- 如果未来要恢复关联，可在 v2 新增 `dh_live_session_related_course` 关联表（多对多），而非恢复 `courseId` 字段
