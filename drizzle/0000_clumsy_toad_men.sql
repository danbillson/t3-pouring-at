-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Bar` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`line1` varchar(191) NOT NULL,
	`line2` varchar(191),
	`city` varchar(191) NOT NULL,
	`postcode` varchar(191) NOT NULL,
	`longitude` double NOT NULL,
	`latitude` double NOT NULL,
	`opening_hours` json NOT NULL,
	`url` varchar(191),
	`branding` json,
	`updated` datetime(3) NOT NULL,
	`verified` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `Bar_id` PRIMARY KEY(`id`),
	CONSTRAINT `Bar_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `BarBeverage` (
	`bar_id` varchar(191) NOT NULL,
	`beverage_id` varchar(191) NOT NULL,
	`tappedOn` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`tappedOff` datetime(3),
	CONSTRAINT `BarBeverage_bar_id_beverage_id` PRIMARY KEY(`bar_id`,`beverage_id`)
);
--> statement-breakpoint
CREATE TABLE `BarStaff` (
	`id` varchar(191) NOT NULL,
	`staff_id` varchar(191) NOT NULL,
	`bar_id` varchar(191) NOT NULL,
	CONSTRAINT `BarStaff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Beverage` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`abv` varchar(191) NOT NULL,
	`style` varchar(191) NOT NULL,
	`brewery_id` varchar(191) NOT NULL,
	`verified` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `Beverage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Brewery` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`url` varchar(191),
	`location` json,
	CONSTRAINT `Brewery_id` PRIMARY KEY(`id`),
	CONSTRAINT `Brewery_name_key` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE INDEX `BarBeverage_bar_id_idx` ON `BarBeverage` (`bar_id`);--> statement-breakpoint
CREATE INDEX `BarBeverage_beverage_id_idx` ON `BarBeverage` (`beverage_id`);--> statement-breakpoint
CREATE INDEX `BarStaff_bar_id_idx` ON `BarStaff` (`bar_id`);--> statement-breakpoint
CREATE INDEX `Beverage_brewery_id_idx` ON `Beverage` (`brewery_id`);
*/