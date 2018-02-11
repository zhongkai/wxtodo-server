CREATE TABLE `todo` (
 `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'todo id',
 `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'open id',
 `content` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '具体内容',
 `tag1` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '标签1',
 `tag2` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '标签2',
 `tag3` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '标签3',
 `extra` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '备注',
 `status`int(4) DEFAULT '0' COMMENT 'todo状态，0进行中，1完成',
 PRIMARY KEY (`id`),
 KEY `id` (`id`) USING BTREE,
 KEY `open_id` (`open_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='todo项目'