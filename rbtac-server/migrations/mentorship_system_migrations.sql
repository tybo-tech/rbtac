-- =============================================
-- MENTORSHIP SYSTEM DATABASE MIGRATIONS
-- =============================================
-- This file contains all the database updates needed for the mentorship system
-- Run these migrations separately from the main db.sql export

-- 1. UPDATE mentorship_templates table structure
ALTER TABLE `mentorship_templates`
ADD COLUMN `name` varchar(255) NOT NULL AFTER `id`,
ADD COLUMN `program_type` varchar(100) DEFAULT 'baseline' AFTER `description`,
ADD COLUMN `version` varchar(50) DEFAULT '1.0' AFTER `program_type`,
ADD COLUMN `is_active` tinyint(1) DEFAULT '1' AFTER `version`,
ADD COLUMN `created_by` int DEFAULT NULL AFTER `updated_at`,
MODIFY COLUMN `title` varchar(255) NULL;

-- Update existing data to use name field
UPDATE `mentorship_templates` SET `name` = `title` WHERE `name` IS NULL OR `name` = '';

-- 2. UPDATE mentorship_categories table structure
ALTER TABLE `mentorship_categories`
ADD COLUMN `description` text AFTER `name`,
ADD COLUMN `order_index` int DEFAULT '0' AFTER `description`,
ADD COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP AFTER `order_index`,
DROP COLUMN `parent_id`,
CHANGE COLUMN `sort_order` `sort_order_old` int DEFAULT '0';

-- Migrate sort_order to order_index
UPDATE `mentorship_categories` SET `order_index` = `sort_order_old`;
ALTER TABLE `mentorship_categories` DROP COLUMN `sort_order_old`;

-- 3. UPDATE mentorship_questions table structure
ALTER TABLE `mentorship_questions`
ADD COLUMN `question_key` varchar(255) NOT NULL AFTER `category_id`,
ADD COLUMN `label` varchar(500) NOT NULL AFTER `question_key`,
ADD COLUMN `items` json DEFAULT NULL AFTER `options`,
ADD COLUMN `calculated` text DEFAULT NULL AFTER `items`,
ADD COLUMN `due_date` date DEFAULT NULL AFTER `calculated`,
ADD COLUMN `placeholder` varchar(255) DEFAULT NULL AFTER `is_required`,
ADD COLUMN `validation_rules` json DEFAULT NULL AFTER `placeholder`,
ADD COLUMN `order_index` int DEFAULT '0' AFTER `validation_rules`,
ADD COLUMN `created_at` datetime DEFAULT CURRENT_TIMESTAMP AFTER `order_index`,
MODIFY COLUMN `question_type` enum('text','number','date','dropdown','textarea','list','task','calculated','boolean') NOT NULL,
CHANGE COLUMN `question_text` `question_text_old` text NOT NULL,
CHANGE COLUMN `sort_order` `sort_order_old` int DEFAULT '0',
CHANGE COLUMN `calculation` `calculation_old` json DEFAULT NULL,
CHANGE COLUMN `trigger_task` `trigger_task_old` tinyint(1) DEFAULT '0';

-- Migrate old data to new structure
UPDATE `mentorship_questions` SET
    `label` = `question_text_old`,
    `question_key` = LOWER(REPLACE(REPLACE(REPLACE(`question_text_old`, ' ', '_'), '?', ''), '.', '')),
    `order_index` = `sort_order_old`;

-- Clean up old columns after migration
ALTER TABLE `mentorship_questions`
DROP COLUMN `template_id`,
DROP COLUMN `question_text_old`,
DROP COLUMN `sort_order_old`,
DROP COLUMN `calculation_old`,
DROP COLUMN `trigger_task_old`;

-- 4. CREATE mentorship_task_triggers table
CREATE TABLE `mentorship_task_triggers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `trigger_condition` varchar(500) NOT NULL,
  `task_description` text NOT NULL,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `due_days_offset` int DEFAULT '7',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`question_id`) REFERENCES `mentorship_questions`(`id`) ON DELETE CASCADE,
  KEY `idx_question_trigger` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. UPDATE mentorship_sessions table structure
ALTER TABLE `mentorship_sessions`
ADD COLUMN `status` enum('scheduled','in_progress','completed','reviewed') DEFAULT 'scheduled' AFTER `session_date`,
ADD COLUMN `completion_percentage` decimal(5,2) DEFAULT '0.00' AFTER `status`,
ADD COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_by`;

-- 6. UPDATE mentorship_responses table structure
ALTER TABLE `mentorship_responses`
ADD COLUMN `response_value` json NOT NULL AFTER `question_id`,
ADD COLUMN `completion_status` enum('pending','completed','skipped') DEFAULT 'pending' AFTER `response_value`,
ADD COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`,
CHANGE COLUMN `response_text` `response_text_old` text,
CHANGE COLUMN `numeric_value` `numeric_value_old` decimal(15,2) DEFAULT NULL,
CHANGE COLUMN `date_value` `date_value_old` date DEFAULT NULL,
CHANGE COLUMN `boolean_value` `boolean_value_old` tinyint(1) DEFAULT NULL;

-- Migrate old response data to new JSON structure
UPDATE `mentorship_responses` SET
    `response_value` = CASE
        WHEN `response_text_old` IS NOT NULL THEN JSON_OBJECT('text', `response_text_old`)
        WHEN `numeric_value_old` IS NOT NULL THEN JSON_OBJECT('number', `numeric_value_old`)
        WHEN `date_value_old` IS NOT NULL THEN JSON_OBJECT('date', `date_value_old`)
        WHEN `boolean_value_old` IS NOT NULL THEN JSON_OBJECT('boolean', `boolean_value_old`)
        ELSE JSON_OBJECT('text', '')
    END,
    `completion_status` = 'completed';

-- Clean up old columns
ALTER TABLE `mentorship_responses`
DROP COLUMN `response_text_old`,
DROP COLUMN `numeric_value_old`,
DROP COLUMN `date_value_old`,
DROP COLUMN `boolean_value_old`;

-- 7. UPDATE mentorship_tasks table structure
ALTER TABLE `mentorship_tasks`
ADD COLUMN `priority` enum('low','medium','high') DEFAULT 'medium' AFTER `status`,
ADD COLUMN `completed_at` datetime DEFAULT NULL AFTER `due_date`,
ADD COLUMN `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`,
MODIFY COLUMN `status` enum('pending','in_progress','done','cancelled') DEFAULT 'pending';

-- 8. CREATE mentorship_triggered_tasks table
CREATE TABLE `mentorship_triggered_tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `trigger_id` int NOT NULL,
  `task_description` text NOT NULL,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `assigned_to` int DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_id`) REFERENCES `mentorship_sessions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`trigger_id`) REFERENCES `mentorship_task_triggers`(`id`),
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`),
  KEY `idx_session_triggered` (`session_id`),
  KEY `idx_status_triggered` (`status`),
  KEY `idx_due_date_triggered` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 9. Add foreign key constraints
ALTER TABLE `mentorship_categories`
ADD CONSTRAINT `fk_categories_template`
FOREIGN KEY (`template_id`) REFERENCES `mentorship_templates`(`id`) ON DELETE CASCADE;

ALTER TABLE `mentorship_questions`
ADD CONSTRAINT `fk_questions_category`
FOREIGN KEY (`category_id`) REFERENCES `mentorship_categories`(`id`) ON DELETE CASCADE;

ALTER TABLE `mentorship_sessions`
ADD CONSTRAINT `fk_sessions_company`
FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_sessions_template`
FOREIGN KEY (`template_id`) REFERENCES `mentorship_templates`(`id`),
ADD CONSTRAINT `fk_sessions_creator`
FOREIGN KEY (`created_by`) REFERENCES `users`(`id`);

ALTER TABLE `mentorship_responses`
ADD CONSTRAINT `fk_responses_session`
FOREIGN KEY (`session_id`) REFERENCES `mentorship_sessions`(`id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_responses_question`
FOREIGN KEY (`question_id`) REFERENCES `mentorship_questions`(`id`);

ALTER TABLE `mentorship_tasks`
ADD CONSTRAINT `fk_tasks_session`
FOREIGN KEY (`session_id`) REFERENCES `mentorship_sessions`(`id`) ON DELETE CASCADE,
ADD CONSTRAINT `fk_tasks_question`
FOREIGN KEY (`question_id`) REFERENCES `mentorship_questions`(`id`),
ADD CONSTRAINT `fk_tasks_company`
FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`),
ADD CONSTRAINT `fk_tasks_assignee`
FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`);

-- 10. Add indexes for better performance
CREATE INDEX `idx_templates_active` ON `mentorship_templates`(`is_active`);
CREATE INDEX `idx_templates_program_type` ON `mentorship_templates`(`program_type`);
CREATE INDEX `idx_categories_template_order` ON `mentorship_categories`(`template_id`, `order_index`);
CREATE INDEX `idx_questions_category_order` ON `mentorship_questions`(`category_id`, `order_index`);
CREATE INDEX `idx_sessions_company` ON `mentorship_sessions`(`company_id`);
CREATE INDEX `idx_sessions_template` ON `mentorship_sessions`(`template_id`);
CREATE INDEX `idx_sessions_status` ON `mentorship_sessions`(`status`);
CREATE INDEX `idx_responses_session` ON `mentorship_responses`(`session_id`);
CREATE INDEX `idx_tasks_session` ON `mentorship_tasks`(`session_id`);
CREATE INDEX `idx_tasks_status` ON `mentorship_tasks`(`status`);
CREATE INDEX `idx_tasks_due_date` ON `mentorship_tasks`(`due_date`);

-- =============================================
-- MIGRATION COMPLETE
-- =============================================
