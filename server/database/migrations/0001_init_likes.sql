CREATE TABLE `project_likes` (
	`project_id` text NOT NULL,
	`user` text NOT NULL,
	PRIMARY KEY(`project_id`, `user`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
