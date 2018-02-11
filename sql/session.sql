CREATE TABLE `session` (
 `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'open id',
 `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '第三方key',
 `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
 `last_login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上次登录时间',
 `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'session key',
 PRIMARY KEY (`open_id`),
 KEY `openid` (`open_id`) USING BTREE,
 KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理'