-- 典恒直播 APP 数据库表结构
-- 执行方式: mysql -u root -p < init.sql

CREATE DATABASE IF NOT EXISTS yixiang DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yixiang;

-- ----------------------------
-- 1. 用户相关表
-- ----------------------------

-- 用户表
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `phone` VARCHAR(11) COMMENT '手机号',
    `email` VARCHAR(100) COMMENT '邮箱',
    `avatar` VARCHAR(255) COMMENT '头像',
    `member_type` TINYINT DEFAULT 0 COMMENT '0:普通 1:VIP',
    `member_expire_time` DATETIME COMMENT '会员到期时间',
    `points` INT DEFAULT 0 COMMENT '积分',
    `streak_days` INT DEFAULT 0 COMMENT '连续学习天数',
    `status` TINYINT DEFAULT 0 COMMENT '0:正常 1:禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 用户学习进度表
DROP TABLE IF EXISTS `user_learning_progress`;
CREATE TABLE `user_learning_progress` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `content_id` BIGINT NOT NULL COMMENT '内容ID',
    `content_type` VARCHAR(20) NOT NULL COMMENT '内容类型: live/content',
    `progress` INT DEFAULT 0 COMMENT '学习进度 百分比',
    `last_study_time` DATETIME COMMENT '最后学习时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_content` (`user_id`, `content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户学习进度表';

-- 用户积分变动日志表
DROP TABLE IF EXISTS `user_points_log`;
CREATE TABLE `user_points_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `points_change` INT NOT NULL COMMENT '积分变动',
    `change_type` VARCHAR(20) NOT NULL COMMENT '类型: earn/consume',
    `description` VARCHAR(200) COMMENT '描述',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户积分变动日志表';

-- ----------------------------
-- 2. 内容相关表
-- ----------------------------

-- 直播会话表
DROP TABLE IF EXISTS `live_session`;
CREATE TABLE `live_session` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `description` TEXT COMMENT '描述',
    `teacher_name` VARCHAR(50) COMMENT '讲师名称',
    `teacher_avatar` VARCHAR(255) COMMENT '讲师头像',
    `cover_image` VARCHAR(255) COMMENT '封面图',
    `start_time` DATETIME COMMENT '开始时间',
    `end_time` DATETIME COMMENT '结束时间',
    `status` TINYINT DEFAULT 0 COMMENT '0:预告 1:直播中 2:回放 3:结束',
    `h5_url` VARCHAR(500) COMMENT 'H5直播地址',
    `audience_count` INT DEFAULT 0 COMMENT '观看人数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_status` (`status`),
    KEY `idx_start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播会话表';

-- 健康内容表
DROP TABLE IF EXISTS `health_content`;
CREATE TABLE `health_content` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `cover_image` VARCHAR(255) COMMENT '封面图',
    `category` VARCHAR(20) COMMENT '分类: 图文/视频',
    `author_name` VARCHAR(50) COMMENT '作者名称',
    `author_avatar` VARCHAR(255) COMMENT '作者头像',
    `content_body` LONGTEXT COMMENT '正文内容',
    `likes_count` INT DEFAULT 0 COMMENT '点赞数',
    `favorites_count` INT DEFAULT 0 COMMENT '收藏数',
    `comments_count` INT DEFAULT 0 COMMENT '评论数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健康内容表';

-- 百科词条表
DROP TABLE IF EXISTS `encyclopedia`;
CREATE TABLE `encyclopedia` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(100) NOT NULL COMMENT '标题',
    `category` VARCHAR(20) COMMENT '分类: 节气/食材/习惯',
    `description` TEXT COMMENT '描述',
    `tags` VARCHAR(200) COMMENT '标签',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='百科词条表';

-- 课程章节表
DROP TABLE IF EXISTS `course_chapter`;
CREATE TABLE `course_chapter` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `live_session_id` BIGINT COMMENT '关联直播ID',
    `title` VARCHAR(200) COMMENT '标题',
    `duration` INT COMMENT '时长(秒)',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 0 COMMENT '0:待学 1:进行中 2:已完成',
    PRIMARY KEY (`id`),
    KEY `idx_live_session` (`live_session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程章节表';

-- 直播资料表
DROP TABLE IF EXISTS `live_material`;
CREATE TABLE `live_material` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `live_session_id` BIGINT COMMENT '关联直播ID',
    `title` VARCHAR(200) COMMENT '标题',
    `file_url` VARCHAR(500) COMMENT '文件地址',
    `file_type` VARCHAR(50) COMMENT '文件类型',
    `file_size` BIGINT COMMENT '文件大小',
    PRIMARY KEY (`id`),
    KEY `idx_live_session` (`live_session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播资料表';

-- ----------------------------
-- 3. 社交互动相关表
-- ----------------------------

-- 用户收藏表
DROP TABLE IF EXISTS `user_favorite`;
CREATE TABLE `user_favorite` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `target_id` BIGINT NOT NULL COMMENT '目标ID',
    `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型: content/live/encyclopedia',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏表';

-- 直播预约表
DROP TABLE IF EXISTS `user_reservation`;
CREATE TABLE `user_reservation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `live_session_id` BIGINT NOT NULL COMMENT '直播ID',
    `reminder_time` DATETIME COMMENT '提醒时间',
    `status` TINYINT DEFAULT 0 COMMENT '0:预约 1:已完成',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_live` (`user_id`, `live_session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播预约表';

-- 直播互动消息表
DROP TABLE IF EXISTS `chat_message`;
CREATE TABLE `chat_message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `live_session_id` BIGINT NOT NULL COMMENT '直播ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `message` TEXT COMMENT '消息内容',
    `is_host` TINYINT DEFAULT 0 COMMENT '是否主播',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_live_session` (`live_session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播互动消息表';

-- ----------------------------
-- 4. 学习相关表
-- ----------------------------

-- 题库题目表
DROP TABLE IF EXISTS `quiz_question`;
CREATE TABLE `quiz_question` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `content_id` BIGINT COMMENT '关联内容ID',
    `type` VARCHAR(20) COMMENT '类型: 单选/多选',
    `prompt` TEXT COMMENT '题目',
    `options` JSON COMMENT '选项JSON',
    `answer_id` VARCHAR(10) COMMENT '正确答案',
    `explanation` TEXT COMMENT '解析',
    PRIMARY KEY (`id`),
    KEY `idx_content_id` (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题库题目表';

-- 用户答题记录表
DROP TABLE IF EXISTS `user_quiz_answer`;
CREATE TABLE `user_quiz_answer` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `question_id` BIGINT NOT NULL COMMENT '题目ID',
    `answer_id` VARCHAR(10) COMMENT '用户答案',
    `is_correct` TINYINT COMMENT '是否正确',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户答题记录表';

-- ----------------------------
-- 5. 会员相关表
-- ----------------------------

-- 会员等级表
DROP TABLE IF EXISTS `member_level`;
CREATE TABLE `member_level` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `level_code` VARCHAR(20) NOT NULL COMMENT '等级代码',
    `level_name` VARCHAR(50) NOT NULL COMMENT '等级名称',
    `points_rate` INT DEFAULT 1 COMMENT '积分获得倍率',
    `privileges` TEXT COMMENT '权益描述JSON',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '0:禁用 1:启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_level_code` (`level_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员等级表';

-- 会员权益记录表
DROP TABLE IF EXISTS `member_rights_log`;
CREATE TABLE `member_rights_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `level_id` BIGINT COMMENT '等级ID',
    `action_type` VARCHAR(50) COMMENT '操作类型: upgrade/downgrade/expire',
    `description` VARCHAR(200) COMMENT '描述',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员权益记录表';

-- ----------------------------
-- 初始化测试数据
-- ----------------------------

-- 插入管理员用户 (密码: admin123)
INSERT INTO `sys_user` (`username`, `password`, `nickname`, `phone`, `email`, `status`, `create_time`)
VALUES ('admin', '$2a$10$7JB720yub.sz9Ol2ME4FweANWRCCkL5x5hA8uJlvIHL.vj8wKFKPu', '管理员', '13800138000', 'admin@example.com', 0, NOW());

-- 插入会员等级
INSERT INTO `member_level` (`level_code`, `level_name`, `points_rate`, `privileges`, `sort`, `status`)
VALUES
('bronze', '青铜会员', 1, '{"discount": 0.95, "freeContent": false}', 1, 1),
('silver', '白银会员', 1.5, '{"discount": 0.9, "freeContent": true}', 2, 1),
('gold', '黄金会员', 2, '{"discount": 0.85, "freeContent": true, "prioritySupport": true}', 3, 1),
('vip', 'VIP会员', 3, '{"allPrivileges": true}', 4, 1);

-- 插入测试直播
INSERT INTO `live_session` (`title`, `description`, `teacher_name`, `cover_image`, `start_time`, `status`)
VALUES
('春季养生堂开课啦', '春季养生知识分享', '李医生', 'https://picsum.photos/400/300', DATE_ADD(NOW(), INTERVAL 1 DAY), 0),
('新冠康复指南', '新冠康复后的养护知识', '张教授', 'https://picsum.photos/400/301', DATE_SUB(NOW(), INTERVAL 1 DAY), 2);

-- 插入测试健康内容
INSERT INTO `health_content` (`title`, `cover_image`, `category`, `author_name`, `content_body`)
VALUES
('如何正确春季养生', 'https://picsum.photos/400/302', '图文', '健康专家', '春季养生应注意...'),
('办公室颈椎保健操', 'https://picsum.photos/400/303', '视频', '运动康复师', '视频内容...');

-- 插入测试百科词条
INSERT INTO `encyclopedia` (`title`, `category`, `description`, `tags`)
VALUES
('立春', '节气', '立春是二十四节气之首', '养生,春季,节气'),
('枸杞', '食材', '枸杞具有养肝明目的功效', '养生,食材,滋补');