# CONTEXT — 颐享健康直播学习平台领域术语表

> 本文件是项目领域术语的**唯一权威定义**。仅含术语，不含实现细节、不含 PRD、不含 ADR。
> 当代码或文档中出现下列术语时，必须遵循此处的定义；如发现冲突应优先修正其他文档。

---

## 角色与组织

### 学员 (Member)
唯一的 App 用户。在系统中均为**一级经销商**身份，App 内所有学员平等，无上下级关系。每个学员归属一家经销商公司（可空）。

- 代码实体：`dh_live_member`
- 不可与"终端消费者""二级经销商"混用

### 经销商公司 (Organization)
一级经销商所在的法人/经营实体。一家公司下可挂多名学员（老板、销售、销售助理等）。公司维度可生成汇总报表。

- 代码实体：`dh_live_organization`（v1 新增）
- 与"学员"的关系：1 公司 : N 学员

### 总部 (Headquarters)
颐享公司本身，通过 admin-web 后台运营平台。在 App 内不可见，只通过"公告 / 必修课 / 兑换码"等机制对学员产生影响。

### 运营 / 管理员 (Operator / Admin)
总部内部使用 admin-web 的人。受 Shiro 权限系统约束，按"运营""超级管理员"等角色细分权限。

### 讲师 (Creator)
课程、直播、内容等创作品的**署名实体**。**v1 不绑账号、不登录、不发权限**，仅作为内容封面署名。

- 代码实体：`dh_live_creator`
- 重要：讲师不是用户角色，是元数据

---

## 学习内容

### 课程 (Course)
一组围绕同一主题的章节集合。可标记为**必修**或**选修**。课程类型在 v1 统一为 `'standard'`（不再使用 `'live_series'`）。

- 代码实体：`dh_live_course`
- 包含字段（v1 新增）：`is_required`, `deadline`, `required_scope`

### 章节 (Chapter)
课程的最小学习单元。v1 章节来源类型 `sourceType` 仅三种：

- `video`：录播视频章节（完成判定：观看 ≥80%）
- `content`：图文章节（完成判定：浏览 ≥10s 或滚动到底）
- `quiz`：习题章节（完成判定：答完所有题，不卡正确率）

**v1 不存在 `live` 类型的章节**（详见 ADR-0004）。

- 代码实体：`dh_live_course_chapter`

### 必修课 (Required Course)
总部下发、明确要求学员在 `deadline` 前完成的课程。

- 必修课与选修课的差别**仅在标记位**，章节结构、完成判定完全一致
- 必修课**完成判定**：所有章节完成 + 结业考已作答

### 选修课 (Elective Course)
学员可自由学习的课程，无 deadline 约束。

### 结业考 (Final Exam)
课程末尾的 quiz 章节。**不卡及格线**，答完即"完成"。积分按准确率比例发放。

### 直播 (Live)
总部组织的实时直播活动。**v1 直播与课程完全解耦**，直播不挂任何课程，章节也不含直播类型。

- 代码实体：`dh_live_session`
- 状态：`0 预约` / `1 直播中` / `2 可回放` / `3 已结束`
- 直播间 UI 完全裸用火山引擎 WebView，App 不在直播间内叠加任何 UI 元素

### 健康内容 (Health Content)
独立于课程的图文/视频内容。在 App 内为"发现页"主体，定位是**经销商的知识弹药库**。

- 代码实体：`dh_live_content`
- `contentKind`：`'article'`（文章）/ `'video'`（视频）

### 百科词条 (Encyclopedia Entry)
轻量短文档，按"节气 / 食材 / 习惯"分类。定位是**经销商面对客户问题时的速查手册**。

- 代码实体：`dh_live_encyclopedia`

### 公告 (Announcement)
总部 → 学员的官方通知。可设置对象范围（全员 / 指定公司 / 指定标签）与是否置顶。

- 代码实体：`dh_live_announcement`（v1 新增）
- v1 仅 App 内展示（首页置顶 + 通知中心），不通过推送或短信发送

---

## 行为与状态

### 预约 (Reservation)
学员对未开播的直播表达"我想看"的意图。预约后开播时进入直播间无需二次确认。

- 代码实体：`dh_live_reservation`

### 观看记录 (Watch Record)
学员每次进入/离开直播间的时长记录，用于完成判定和积分计算。

- 代码实体：`dh_live_watch_record`

### 学习进度 (Learning Progress)
学员对某个学习目标（课程/章节/直播/内容）的累积进度。

- 代码实体：`dh_live_learning_progress`

### 答题记录 (Answer Record)
学员对单道题的一次作答记录，含选项、正确性、获得积分。

- 代码实体：`dh_live_quiz_answer_record`

### 签到 (Sign-in)
学员当日首次打开 App 触发的行为。计入连签天数。

### 连签 (Streak)
学员连续签到天数。7 天与 30 天阈值触发一次性额外积分奖励。

---

## 激励体系

### 积分 (Points)
学员的"通用学习币"。**永不过期、累计制**。一个学员一个账户，含三个数字：

- `currentPoints`：当前可消耗
- `totalEarned`：累计获得（**晶升依据**，只增不减）
- `totalConsumed`：累计消耗

- 代码实体：`dh_live_member_points_account` / `dh_live_member_points_log`

### 晶升等级 (Tier / Level)
基于 `totalEarned` 计算的**虚拟身份**。4 级阈值制：

| 等级 | 阈值 (totalEarned) |
|------|---------------------|
| 见习学员 | 0 |
| 进阶学员 | 500 |
| 资深学员 | 2000 |
| 金牌讲师 | 5000 |

**晶升不挂钩 ERP**：不影响进货价、不影响返点、不影响实物权益。

### 福利 (Reward Item)
学员可用积分兑换的物品/虚拟权益。每个福利对应一个 SKU + 一批兑换码。

- 代码实体：`dh_live_reward_item`

### 兑换码 (Reward Code)
每个福利下的具体兑换字符串。学员兑换后从池中取走一个码，标记已使用。

- 代码实体：`dh_live_reward_code`

### 兑换记录 (Reward Record)
学员一次兑换行为的快照（谁、何时、扣多少分、得了哪个码）。

- 代码实体：`dh_live_member_reward_record`

---

## 区分容易混淆的术语

| 容易混淆 | 区别 |
|----------|------|
| **学员 vs 经销商** | "学员"是 App 内身份，"经销商"是业务身份。两者在 v1 是 1:1 关系 |
| **课程 vs 直播** | v1 中两者**完全独立**。课程是录播+图文+题章节；直播是独立场次，不挂课程 |
| **必修课 vs 结业考** | 必修课是整门课的标记位；结业考是课程末尾的 quiz 章节 |
| **积分 (currentPoints) vs 积分 (totalEarned)** | 兑换花的是 currentPoints；晶升看的是 totalEarned |
| **公告 vs 推送** | v1 公告仅 App 内可见（首页置顶+通知中心），**不发任何推送** |
| **讲师 vs 学员** | 讲师是内容署名，不是 App 用户；学员才是 App 用户 |
| **健康内容 vs 课程** | 健康内容是单篇文章/视频；课程是结构化多章节系列 |
| **百科 vs 健康内容** | 百科是查阅型短词条；健康内容是阅读型长篇 |

---

## 历史决策追溯

当本术语与代码现状不一致时，请参考对应 ADR：

- 讲师无账号 → [ADR-0002](server/docs/adr/0002-identity-model.md)
- 结业考不卡及格 → [ADR-0003](server/docs/adr/0003-learning-hardness.md)
- 直播不挂课 → [ADR-0004](server/docs/adr/0004-live-course-decoupling.md)
- 直播间 UI 全裸 → [ADR-0005](server/docs/adr/0005-live-platform-volcengine.md)
- 公告无推送 → [ADR-0006](server/docs/adr/0006-no-push-notifications-v1.md)
- 兑换码而非真电商 → [ADR-0008](server/docs/adr/0008-reward-code-model.md)
