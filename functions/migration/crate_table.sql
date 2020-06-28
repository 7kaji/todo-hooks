CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `auth_uid` varchar(255) NOT NULL,
  `auth_provider` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `icon_url` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_uid_and_provider` (`auth_uid`,`auth_provider`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `todos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `done` boolean NOT NULL DEFAULT FALSE,
  `user_id` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_todos_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE=utf8mb4_bin;
