CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL,
	`private` integer NOT NULL,
	`user` text NOT NULL,
	`likes` integer
);
