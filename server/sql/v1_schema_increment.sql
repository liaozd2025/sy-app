-- =====================================================================
-- 颐享健康直播学习平台 v1 - Schema 增量迁移脚本
-- =====================================================================
-- 执行顺序：先 ry_20260319.sql → 再 dh_live_app.sql → 最后本文件
-- 决策来源：docs/prd-v1.md §7 + server/docs/adr/0001~0008
-- 设计约定：沿用 dh_live_app.sql 既有规范（snake_case、bigint(20) 主键、
--          RuoYi 标准元数据列、innodb + utf8mb4）
-- =====================================================================


-- =====================================================================
-- 1. 字典补充与修订
-- =====================================================================

-- 1.1 新增 v1 字典类型
delete from sys_dict_data
where dict_type in (
  'dh_course_type',
  'dh_required_scope',
  'dh_announcement_scope',
  'dh_reward_item_status'
);
delete from sys_dict_type
where dict_type in (
  'dh_course_type',
  'dh_required_scope',
  'dh_announcement_scope',
  'dh_reward_item_status'
);

insert into sys_dict_type
  (dict_name, dict_type, status, create_by, create_time, update_by, update_time, remark)
values
  ('颐享课程类型',    'dh_course_type',         '0', 'admin', sysdate(), '', null, '课程类型（v1 仅 standard）'),
  ('颐享必修范围',    'dh_required_scope',      '0', 'admin', sysdate(), '', null, '必修课对象范围'),
  ('颐享公告范围',    'dh_announcement_scope',  '0', 'admin', sysdate(), '', null, '公告对象范围'),
  ('颐享福利状态',    'dh_reward_item_status',  '0', 'admin', sysdate(), '', null, '福利 SKU 上下架状态');

insert into sys_dict_data
  (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, update_by, update_time, remark)
values
  -- dh_course_type
  (1, '标准课程', 'standard', 'dh_course_type', '', 'primary', 'Y', '0', 'admin', sysdate(), '', null, 'v1 默认类型（录播+图文+题章节组合）'),
  -- dh_required_scope
  (1, '全员必修', 'all', 'dh_required_scope', '', 'primary', 'Y', '0', 'admin', sysdate(), '', null, '所有学员必修'),
  (2, '指定公司', 'org', 'dh_required_scope', '', 'warning', 'N', '0', 'admin', sysdate(), '', null, '仅指定经销商公司必修'),
  -- dh_announcement_scope
  (1, '全员',     'all', 'dh_announcement_scope', '', 'primary', 'Y', '0', 'admin', sysdate(), '', null, '全体学员可见'),
  (2, '指定公司', 'org', 'dh_announcement_scope', '', 'warning', 'N', '0', 'admin', sysdate(), '', null, '仅指定公司可见'),
  (3, '指定标签', 'tag', 'dh_announcement_scope', '', 'info',    'N', '0', 'admin', sysdate(), '', null, '按会员标签筛选'),
  -- dh_reward_item_status
  (1, '上架', '1', 'dh_reward_item_status', '', 'success', 'Y', '0', 'admin', sysdate(), '', null, '可兑换'),
  (2, '下架', '0', 'dh_reward_item_status', '', 'default', 'N', '0', 'admin', sysdate(), '', null, '不可兑换');

-- 1.2 dh_quiz_type 新增"判断题"
insert into sys_dict_data
  (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, create_time, update_by, update_time, remark)
values
  (3, '判断', 'judge', 'dh_quiz_type', '', 'info', 'N', '0', 'admin', sysdate(), '', null, '判断题（v1 新增）');


-- =====================================================================
-- 2. 新增表（PRD §7.1）
-- =====================================================================

-- 2.1 经销商公司
drop table if exists dh_live_organization;
create table dh_live_organization (
  org_id          bigint(20)    not null auto_increment    comment '经销商公司ID',
  org_code        varchar(64)   not null                   comment '公司业务编码',
  org_name        varchar(100)  not null                   comment '公司名称',
  region          varchar(100)  default ''                 comment '所在地区',
  contact_name    varchar(50)   default ''                 comment '联系人姓名',
  contact_phone   varchar(20)   default ''                 comment '联系电话',
  status          char(1)       default '0'                comment '状态（0正常 1停用）',
  sort            int           default 0                  comment '排序',
  create_by       varchar(64)   default ''                 comment '创建者',
  create_time     datetime                                 comment '创建时间',
  update_by       varchar(64)   default ''                 comment '更新者',
  update_time     datetime                                 comment '更新时间',
  remark          varchar(500)  default null               comment '备注',
  del_flag        char(1)       default '0'                comment '删除标志（0存在 2删除）',
  primary key (org_id),
  unique key uk_dh_live_organization_code (org_code),
  key idx_dh_live_organization_status (status, sort)
) engine=innodb auto_increment=10000 default charset=utf8mb4 comment='颐享经销商公司表';

-- 2.2 总部公告
drop table if exists dh_live_announcement;
create table dh_live_announcement (
  ann_id          bigint(20)    not null auto_increment    comment '公告ID',
  biz_code        varchar(64)   not null                   comment '公告业务编码',
  title           varchar(200)  not null                   comment '公告标题',
  summary         varchar(500)  default ''                 comment '公告摘要',
  content         longtext                                 comment '公告正文（富文本 HTML）',
  scope           varchar(20)   default 'all'              comment '范围（all/org/tag）',
  scope_ids_json  json                                     comment '范围目标 ID 列表（scope=org/tag 时使用）',
  is_pinned       char(1)       default '0'                comment '是否置顶（0否 1是）',
  publish_time    datetime                                 comment '发布时间',
  expire_time     datetime                                 comment '过期时间（可空，到期后不展示）',
  publish_status  char(1)       default '0'                comment '发布状态（0草稿 1已发布 2已下线）',
  read_count      int           default 0                  comment '已读人次',
  sort            int           default 0                  comment '排序',
  create_by       varchar(64)   default ''                 comment '创建者',
  create_time     datetime                                 comment '创建时间',
  update_by       varchar(64)   default ''                 comment '更新者',
  update_time     datetime                                 comment '更新时间',
  remark          varchar(500)  default null               comment '备注',
  del_flag        char(1)       default '0'                comment '删除标志',
  primary key (ann_id),
  unique key uk_dh_live_announcement_biz_code (biz_code),
  key idx_dh_live_announcement_pin_publish (is_pinned desc, publish_status, publish_time desc)
) engine=innodb auto_increment=10000 default charset=utf8mb4 comment='颐享总部公告表';

-- 2.3 福利 SKU
drop table if exists dh_live_reward_item;
create table dh_live_reward_item (
  item_id           bigint(20)    not null auto_increment    comment '福利ID',
  biz_code          varchar(64)   not null                   comment '福利业务编码',
  item_name         varchar(200)  not null                   comment '福利名称',
  cover_image       varchar(255)  default ''                 comment '封面图',
  description       text                                     comment '福利说明（包含发货指引）',
  required_points   int           not null                   comment '兑换所需积分',
  stock_total       int           default 0                  comment '总库存（=已上传的码总数）',
  stock_remaining   int           default 0                  comment '剩余库存（=未使用的码数）',
  status            char(1)       default '1'                comment '状态（1上架 0下架）',
  sort              int           default 0                  comment '排序',
  create_by         varchar(64)   default ''                 comment '创建者',
  create_time       datetime                                 comment '创建时间',
  update_by         varchar(64)   default ''                 comment '更新者',
  update_time       datetime                                 comment '更新时间',
  remark            varchar(500)  default null               comment '备注',
  del_flag          char(1)       default '0'                comment '删除标志',
  primary key (item_id),
  unique key uk_dh_live_reward_item_biz_code (biz_code),
  key idx_dh_live_reward_item_status_sort (status, sort)
) engine=innodb auto_increment=10000 default charset=utf8mb4 comment='颐享积分商城福利表';

-- 2.4 兑换码池
drop table if exists dh_live_reward_code;
create table dh_live_reward_code (
  code_id        bigint(20)    not null auto_increment    comment '兑换码ID',
  item_id        bigint(20)    not null                   comment '关联福利ID',
  code           varchar(100)  not null                   comment '兑换码字符串',
  is_used        char(1)       default '0'                comment '是否已使用（0否 1是）',
  used_by        bigint(20)    default null               comment '使用者会员ID',
  used_time      datetime                                 comment '使用时间',
  expire_time    datetime                                 comment '码过期时间（可空）',
  create_by      varchar(64)   default ''                 comment '创建者',
  create_time    datetime                                 comment '创建时间',
  update_time    datetime                                 comment '更新时间',
  remark         varchar(500)  default null               comment '备注',
  del_flag       char(1)       default '0'                comment '删除标志',
  primary key (code_id),
  unique key uk_dh_live_reward_code_str (code),
  key idx_dh_live_reward_code_item_used (item_id, is_used),
  key idx_dh_live_reward_code_used_by (used_by)
) engine=innodb auto_increment=10000 default charset=utf8mb4 comment='颐享积分商城兑换码池表';

-- 2.5 学员兑换记录
drop table if exists dh_live_member_reward_record;
create table dh_live_member_reward_record (
  record_id          bigint(20)    not null auto_increment    comment '兑换记录ID',
  member_id          bigint(20)    not null                   comment '会员ID',
  item_id            bigint(20)    not null                   comment '福利ID',
  code_id            bigint(20)    not null                   comment '兑换码ID',
  points_consumed    int           not null                   comment '本次消耗积分',
  exchange_time      datetime      not null                   comment '兑换时间',
  delivery_status    varchar(20)   default 'pending'          comment '发货状态（pending/contacted/shipped/received）',
  delivery_note      varchar(500)  default ''                 comment '发货备注（运营手动维护）',
  create_time        datetime                                 comment '创建时间',
  update_time        datetime                                 comment '更新时间',
  remark             varchar(500)  default null               comment '备注',
  del_flag           char(1)       default '0'                comment '删除标志',
  primary key (record_id),
  key idx_dh_live_member_reward_record_member (member_id, exchange_time desc),
  key idx_dh_live_member_reward_record_item (item_id),
  unique key uk_dh_live_member_reward_record_code (code_id)
) engine=innodb auto_increment=10000 default charset=utf8mb4 comment='颐享学员兑换记录表';


-- =====================================================================
-- 3. 修改既有表（PRD §7.2）
-- =====================================================================

-- 3.1 dh_live_member 加 organization_id（公司归属）
alter table dh_live_member
  add column organization_id bigint(20) default null comment '所属经销商公司ID' after member_label;
alter table dh_live_member
  add key idx_dh_live_member_org (organization_id);

-- 3.2 dh_live_course 加必修字段
alter table dh_live_course
  add column is_required     char(1)       default '0' comment '是否必修（0否 1是）'              after course_type,
  add column deadline        datetime      default null comment '必修课截止时间（仅必修课使用）' after is_required,
  add column required_scope  varchar(20)   default 'all' comment '必修范围（all 全员 / org 指定公司）' after deadline,
  add column required_scope_ids_json json    default null comment '必修指定范围 ID 列表'         after required_scope;
alter table dh_live_course
  add key idx_dh_live_course_required (is_required, deadline);

-- 3.3 dh_live_course.course_type 默认值改为 standard
alter table dh_live_course
  modify column course_type varchar(20) default 'standard' comment '课程类型（v1 仅 standard）';

-- 3.4 dh_live_course_chapter.source_type 默认值改为 video（不再默认为 live）
-- 注意：字段枚举的实际约束在应用层（MyBatis 校验 + 字典），数据库不加 CHECK
alter table dh_live_course_chapter
  modify column source_type varchar(20) default 'video' comment '来源类型（video/content/quiz；v1 移除 live）';


-- =====================================================================
-- 4. 删除字段 / 弃用表（PRD §7.3）
-- =====================================================================

-- 4.1 删除 dh_live_session.course_id（直播与课程解耦，见 ADR-0004）
-- 先删索引（如存在），再删字段
alter table dh_live_session drop index if exists idx_dh_live_session_course;
alter table dh_live_session drop column if exists course_id;

-- 4.2 删除 dh_live_chat_message（直播聊天交火山引擎，见 ADR-0005）
drop table if exists dh_live_chat_message;

-- 4.3 删除 dh_live_material（v1 不做资料下载，见 ADR-0005）
drop table if exists dh_live_material;


-- =====================================================================
-- 5. 完成
-- =====================================================================
-- v1 schema 增量执行完毕。
--
-- v1 保留但不启用的表（UI 隐藏，DB 不动）：
--   dh_live_feed, dh_live_comment, dh_live_member_favorite,
--   dh_live_member_like, dh_live_creator_follow,
--   dh_live_consultation, dh_live_consultation_reply, dh_live_recommendation
-- =====================================================================
