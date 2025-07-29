-- Enhanced Database Schema for Optimal Program Stages UX
-- Run these modifications to improve the user experience

-- 1. Enhanced program_stages table
ALTER TABLE `program_stages` 
ADD COLUMN `requirements` JSON NULL COMMENT 'Stage requirements and criteria',
ADD COLUMN `expected_duration_days` INT DEFAULT 30 COMMENT 'Expected days to complete this stage',
ADD COLUMN `min_duration_days` INT DEFAULT 7 COMMENT 'Minimum days before advancement allowed',
ADD COLUMN `max_duration_days` INT DEFAULT 90 COMMENT 'Maximum days before escalation needed',
ADD COLUMN `auto_advance_criteria` JSON NULL COMMENT 'Criteria for automatic advancement',
ADD COLUMN `stage_color` VARCHAR(7) DEFAULT '#3B82F6' COMMENT 'UI color for this stage',
ADD COLUMN `stage_icon` VARCHAR(50) DEFAULT 'document' COMMENT 'Icon identifier for UI',
ADD COLUMN `is_milestone` BOOLEAN DEFAULT FALSE COMMENT 'Whether this stage is a major milestone',
ADD COLUMN `approval_required` BOOLEAN DEFAULT FALSE COMMENT 'Whether manual approval is needed',
ADD COLUMN `notification_settings` JSON NULL COMMENT 'When to send notifications',
ADD COLUMN `status` ENUM('active', 'inactive', 'archived') DEFAULT 'active';

-- 2. Enhanced company_program_stages table for better tracking
ALTER TABLE `company_program_stages`
ADD COLUMN `current_stage_id` INT NULL COMMENT 'Reference to current stage',
ADD COLUMN `stage_entered_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN `expected_completion_date` DATETIME NULL,
ADD COLUMN `actual_completion_date` DATETIME NULL,
ADD COLUMN `stage_progress_percentage` DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN `notes` TEXT NULL COMMENT 'Stage-specific notes and comments',
ADD COLUMN `assigned_mentor_id` INT NULL COMMENT 'Assigned mentor for this stage',
ADD COLUMN `priority_level` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
ADD COLUMN `stage_data` JSON NULL COMMENT 'Custom data for this stage',
ADD COLUMN `completion_criteria_met` JSON NULL COMMENT 'Which criteria have been met',
ADD COLUMN `blocked_reason` TEXT NULL COMMENT 'Why progression is blocked (if any)',
ADD COLUMN `created_by` INT NULL,
ADD COLUMN `updated_by` INT NULL;

-- 3. Create stage_transitions table for workflow tracking
CREATE TABLE `stage_transitions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT NOT NULL,
  `program_id` INT NOT NULL,
  `from_stage_id` INT NULL,
  `to_stage_id` INT NOT NULL,
  `transition_type` ENUM('manual', 'automatic', 'bulk', 'rollback') DEFAULT 'manual',
  `transition_reason` TEXT NULL,
  `approved_by` INT NULL,
  `approval_notes` TEXT NULL,
  `transition_data` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  INDEX `idx_company_program` (`company_id`, `program_id`),
  INDEX `idx_stages` (`from_stage_id`, `to_stage_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Create stage_templates table for reusable stage configurations
CREATE TABLE `stage_templates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `template_data` JSON NOT NULL COMMENT 'Template configuration',
  `category` VARCHAR(100) DEFAULT 'general',
  `is_public` BOOLEAN DEFAULT TRUE,
  `created_by` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Create stage_analytics table for performance tracking
CREATE TABLE `stage_analytics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stage_id` INT NOT NULL,
  `program_id` INT NOT NULL,
  `metric_date` DATE NOT NULL,
  `companies_entered` INT DEFAULT 0,
  `companies_completed` INT DEFAULT 0,
  `companies_in_progress` INT DEFAULT 0,
  `companies_blocked` INT DEFAULT 0,
  `avg_duration_days` DECIMAL(8,2) DEFAULT 0.00,
  `completion_rate` DECIMAL(5,2) DEFAULT 0.00,
  `bottleneck_score` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Higher = more bottlenecked',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_stage_date` (`stage_id`, `metric_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Add sample stage templates
INSERT INTO `stage_templates` (`name`, `description`, `template_data`, `category`) VALUES
('Basic Incubator Stages', 'Standard 5-stage incubator program', 
 '{"stages": [
   {"title": "Application Review", "duration": 14, "requirements": ["Complete application", "Business plan"], "color": "#EF4444"},
   {"title": "Due Diligence", "duration": 21, "requirements": ["Financial docs", "Market analysis"], "color": "#F97316"},
   {"title": "Program Entry", "duration": 7, "requirements": ["Legal docs", "Agreement signing"], "color": "#EAB308"},
   {"title": "Development", "duration": 90, "requirements": ["Milestone meetings", "Progress reports"], "color": "#3B82F6"},
   {"title": "Graduation", "duration": 30, "requirements": ["Final presentation", "Exit plan"], "color": "#10B981"}
 ]}', 'incubator'),
('Accelerator Track', 'Fast-track 3-month accelerator program',
 '{"stages": [
   {"title": "Bootcamp", "duration": 30, "requirements": ["Workshop attendance"], "color": "#8B5CF6"},
   {"title": "Mentorship", "duration": 60, "requirements": ["Weekly mentor meetings"], "color": "#3B82F6"},
   {"title": "Demo Day", "duration": 30, "requirements": ["Pitch preparation", "Investor readiness"], "color": "#10B981"}
 ]}', 'accelerator');

-- 7. Add indexes for performance
ALTER TABLE `company_program_stages` 
ADD INDEX `idx_current_stage` (`current_stage_id`),
ADD INDEX `idx_stage_entered_at` (`stage_entered_at`),
ADD INDEX `idx_priority_level` (`priority_level`),
ADD INDEX `idx_company_program_current` (`company_id`, `program_id`, `current_stage_id`);

ALTER TABLE `program_stages`
ADD INDEX `idx_program_order` (`program_id`, `stage_order`),
ADD INDEX `idx_status` (`status`);
