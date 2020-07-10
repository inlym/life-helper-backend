CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id，别名「用户ID」',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间，可当作用户的「注册时间」',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `openid` varchar(50) NOT NULL COMMENT '微信小程序openid，用于唯一区分小程序用户',
  `nickname` varchar(32) DEFAULT NULL COMMENT '微信用户昵称，从微信授权获取',
  `avatar_url` varchar(200) DEFAULT NULL COMMENT '微信头像的URL，从微信授权获取',
  `gender` tinyint(4) DEFAULT NULL COMMENT '性别，0-未知，1-男性，2-女性，从微信授权获取',
  `country` varchar(32) DEFAULT NULL COMMENT '用户所在国家，从微信授权获取',
  `province` varchar(32) DEFAULT NULL COMMENT '用户所在省份，从微信授权获取',
  `city` varchar(32) DEFAULT NULL COMMENT '用户所在城市，从微信授权获取',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表'