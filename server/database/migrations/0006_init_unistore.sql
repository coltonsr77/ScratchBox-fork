CREATE TABLE `unistore_data` (
	`revision` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `unistore_data` VALUES(0)
--> statement-breakpoint
ALTER TABLE `projects` ADD `last_updated` integer NOT NULL DEFAULT (CURRENT_TIMESTAMP);
