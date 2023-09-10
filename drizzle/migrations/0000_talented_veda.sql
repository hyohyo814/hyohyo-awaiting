CREATE TABLE `codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text,
	`created_at` integer DEFAULT (cast (unixepoch () as int))
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codeId` integer NOT NULL,
	`userId` text NOT NULL,
	`time` integer,
	`created_at` integer DEFAULT (cast (unixepoch () as int))
);
--> statement-breakpoint
CREATE TABLE `users` (
	`userId` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_userId_unique` ON `users` (`userId`);