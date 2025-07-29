-- Test data for Program Stages functionality
-- Run this SQL to create sample data for testing

-- Insert a test program (if it doesn't exist)
INSERT IGNORE INTO programs (id, name, description, created_at, updated_at)
VALUES (2, 'Business Incubation Program', 'A comprehensive program to guide startups through various stages of development', NOW(), NOW());

-- Insert program stages for the program
INSERT IGNORE INTO program_stages (id, program_id, title, description, stage_order, requirements, expected_duration_days, created_at, updated_at)
VALUES
(1, 2, 'Application Review', 'Initial application screening and review process', 1, 'Complete application form, business plan draft', 14, NOW(), NOW()),
(2, 2, 'Due Diligence', 'Comprehensive business evaluation and market analysis', 2, 'Financial documents, market research, team assessment', 21, NOW(), NOW()),
(3, 2, 'Program Entry', 'Onboarding and initial program setup', 3, 'Legal documentation, program agreement signing', 7, NOW(), NOW()),
(4, 2, 'Development Phase', 'Active development and mentoring phase', 4, 'Regular milestone meetings, progress reports', 90, NOW(), NOW()),
(5, 2, 'Market Preparation', 'Market readiness and launch preparation', 5, 'Product validation, go-to-market strategy', 45, NOW(), NOW()),
(6, 2, 'Graduation', 'Program completion and transition to independence', 6, 'Final presentation, sustainability plan', 30, NOW(), NOW());

-- Insert some test companies (if they don't exist)
INSERT IGNORE INTO companies (id, company_name, sector, founded_year, employees, revenue, status, created_at, updated_at)
VALUES
(1, 'TechStart Solutions', 'Technology', 2023, 5, 50000, 'Active', NOW(), NOW()),
(2, 'Green Energy Innovations', 'Energy', 2022, 8, 120000, 'Active', NOW(), NOW()),
(3, 'HealthTech Pro', 'Healthcare', 2024, 3, 25000, 'Active', NOW(), NOW()),
(4, 'EduPlatform Ltd', 'Education', 2023, 12, 200000, 'Active', NOW(), NOW()),
(5, 'FinTech Startup', 'Finance', 2024, 6, 80000, 'Active', NOW(), NOW());

-- Insert company program stage relationships
INSERT IGNORE INTO company_program_stages (id, company_id, program_id, current_stage_id, stage_entered_at, notes, created_at, updated_at)
VALUES
(1, 1, 2, 4, '2024-07-01 10:00:00', 'Making good progress on product development', NOW(), NOW()),
(2, 2, 2, 3, '2024-07-15 14:30:00', 'Recently entered the program, completing onboarding', NOW(), NOW()),
(3, 3, 2, 2, '2024-07-20 09:15:00', 'In due diligence phase, providing requested documents', NOW(), NOW()),
(4, 4, 2, 5, '2024-06-15 11:45:00', 'Preparing for market launch, developing marketing strategy', NOW(), NOW()),
(5, 5, 2, 1, '2024-07-25 16:20:00', 'Just submitted application, waiting for initial review', NOW(), NOW());

-- Insert some activity logs for tracking
INSERT IGNORE INTO activity_logs (id, company_id, program_stage_id, action_type, description, created_by, created_at)
VALUES
(1, 1, 4, 'stage_entry', 'Company advanced to Development Phase', 1, '2024-07-01 10:00:00'),
(2, 2, 3, 'stage_entry', 'Company advanced to Program Entry', 1, '2024-07-15 14:30:00'),
(3, 3, 2, 'stage_entry', 'Company advanced to Due Diligence', 1, '2024-07-20 09:15:00'),
(4, 4, 5, 'stage_entry', 'Company advanced to Market Preparation', 1, '2024-06-15 11:45:00'),
(5, 5, 1, 'stage_entry', 'Company entered Application Review', 1, '2024-07-25 16:20:00');
