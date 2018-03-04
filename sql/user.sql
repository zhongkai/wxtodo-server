CREATE TABLE `user` (
 `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'open id',
 `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
 `avatar` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '头像地址',
 PRIMARY KEY (`open_id`),
 KEY `openid` (`open_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户'