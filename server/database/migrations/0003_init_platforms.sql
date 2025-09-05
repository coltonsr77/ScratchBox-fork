CREATE TABLE `project_platforms` (
	`project_id` text NOT NULL,
	`platform` text NOT NULL,
	PRIMARY KEY(`project_id`, `platform`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
