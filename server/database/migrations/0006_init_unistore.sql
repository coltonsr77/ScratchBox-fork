CREATE TABLE `unistore_data` (
	`revision` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `unistore_data` VALUES(0)
--> statement-breakpoint
ALTER TABLE "projects" ADD "last\_updated" integer NOT NULL DEFAULT (strftime('%s', 'now'));
