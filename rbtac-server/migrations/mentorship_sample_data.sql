-- =============================================
-- MENTORSHIP SYSTEM SAMPLE DATA
-- =============================================
-- This file contains sample templates and data for the mentorship system

-- Insert sample mentorship templates
INSERT INTO `mentorship_templates` (`name`, `description`, `program_type`, `version`, `is_active`, `created_by`) VALUES
('Baseline – Entrepreneur Information', 'Captures baseline business info, goals, and strategic vision for new entrepreneurs in the mindset shift program.', 'baseline', '1.0', 1, 1),
('Financial Turnaround Assessment', 'Comprehensive financial health check and turnaround strategy development for struggling businesses.', 'financial_turnaround', '1.0', 1, 1),
('Growth Strategy Planning', 'Advanced growth strategy development for established businesses ready to scale.', 'growth_strategy', '1.0', 1, 1),
('Compliance & Readiness Check', 'Legal and regulatory compliance assessment for businesses preparing for investment or partnerships.', 'compliance_readiness', '1.0', 1, 1);

-- Get the template IDs for reference
SET @baseline_template_id = (SELECT id FROM mentorship_templates WHERE program_type = 'baseline' LIMIT 1);
SET @financial_template_id = (SELECT id FROM mentorship_templates WHERE program_type = 'financial_turnaround' LIMIT 1);
SET @growth_template_id = (SELECT id FROM mentorship_templates WHERE program_type = 'growth_strategy' LIMIT 1);
SET @compliance_template_id = (SELECT id FROM mentorship_templates WHERE program_type = 'compliance_readiness' LIMIT 1);

-- =============================================
-- BASELINE TEMPLATE STRUCTURE
-- =============================================

-- Categories for Baseline Template
INSERT INTO `mentorship_categories` (`template_id`, `name`, `description`, `order_index`) VALUES
(@baseline_template_id, 'Entrepreneur Info', 'Basic business and entrepreneur information', 0),
(@baseline_template_id, 'Self Assessment', 'Self-assessment metrics and compliance status', 1),
(@baseline_template_id, 'Executive Summary', 'Financial overview and business metrics', 2),
(@baseline_template_id, 'Strategic Objective', 'Business goals and growth targets', 3),
(@baseline_template_id, 'Strategy Cascade', 'Strategic planning framework questions', 4),
(@baseline_template_id, 'SWOT Analysis', 'Strengths, weaknesses, opportunities, and threats', 5),
(@baseline_template_id, 'GPS Targets', 'Goal-setting and milestone planning', 6);

-- Get category IDs for Baseline Template
SET @entrepreneur_info_cat = (SELECT id FROM mentorship_categories WHERE template_id = @baseline_template_id AND name = 'Entrepreneur Info');
SET @self_assessment_cat = (SELECT id FROM mentorship_categories WHERE template_id = @baseline_template_id AND name = 'Self Assessment');
SET @executive_summary_cat = (SELECT id FROM mentorship_categories WHERE template_id = @baseline_template_id AND name = 'Executive Summary');
SET @strategic_objective_cat = (SELECT id FROM mentorship_categories WHERE template_id = @baseline_template_id AND name = 'Strategic Objective');
SET @strategy_cascade_cat = (SELECT id FROM mentorship_categories WHERE template_id = @baseline_template_id AND name = 'Strategy Cascade');
SET @swot_analysis_cat = (SELECT id FROM mentorship_categories WHERE template_id = @baseline_template_id AND name = 'SWOT Analysis');
SET @gps_targets_cat = (SELECT id FROM mentorship_categories WHERE template_id = @baseline_template_id AND name = 'GPS Targets');

-- Questions for Entrepreneur Info Category
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `is_required`, `order_index`) VALUES
(@entrepreneur_info_cat, 'business_name', 'Business Name', 'text', 1, 0),
(@entrepreneur_info_cat, 'entrepreneur_name', 'Entrepreneur Name', 'text', 1, 1),
(@entrepreneur_info_cat, 'industry', 'Industry', 'text', 0, 2),
(@entrepreneur_info_cat, 'type_of_business', 'Type of Business', 'text', 0, 3),
(@entrepreneur_info_cat, 'strategy_guide', 'Strategy Guide', 'text', 0, 4),
(@entrepreneur_info_cat, 'programme_category', 'Programme/Category', 'text', 0, 5),
(@entrepreneur_info_cat, 'gps_date', 'GPS Date', 'date', 0, 6);

-- Questions for Self Assessment Category
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `is_required`, `validation_rules`, `order_index`) VALUES
(@self_assessment_cat, 'sales_ability', 'Sales Ability (1–10)', 'number', 1, JSON_OBJECT('min', 1, 'max', 10), 0),
(@self_assessment_cat, 'marketing_ability', 'Marketing Ability (1–10)', 'number', 1, JSON_OBJECT('min', 1, 'max', 10), 1);

INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `options`, `order_index`) VALUES
(@self_assessment_cat, 'vat_compliance', 'State of VAT', 'dropdown', JSON_ARRAY('Compliant', 'Non-Compliant'), 2),
(@self_assessment_cat, 'paye_compliance', 'State of PAYE', 'dropdown', JSON_ARRAY('Compliant', 'Non-Compliant'), 3);

-- Questions for Executive Summary Category
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `placeholder`, `order_index`) VALUES
(@executive_summary_cat, 'turnover_avg', 'Turnover (monthly avg)', 'number', 'Enter amount in local currency', 0),
(@executive_summary_cat, 'cost_of_sales', 'Cost of Sales (monthly avg)', 'number', 'Enter amount in local currency', 1),
(@executive_summary_cat, 'gross_profit', 'Gross Profit (monthly avg)', 'number', 'Enter amount in local currency', 2),
(@executive_summary_cat, 'expenses', 'Operating Expenses (monthly avg)', 'number', 'Enter amount in local currency', 3),
(@executive_summary_cat, 'cash_on_hand', 'Cash on Hand', 'number', 'Enter current cash amount', 5),
(@executive_summary_cat, 'inventory', 'Inventory on Hand', 'number', 'Enter inventory value', 6);

INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `calculated`, `order_index`) VALUES
(@executive_summary_cat, 'net_profit', 'Net Profit before tax', 'calculated', 'gross_profit - expenses', 4),
(@executive_summary_cat, 'net_asset_value', 'Net Asset Value (Assets – Liabilities)', 'calculated', 'assets - liabilities', 7);

-- Questions for Strategic Objective Category
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `order_index`) VALUES
(@strategic_objective_cat, '1yr_turnover', 'Target Turnover (1 year from now)', 'number', 0),
(@strategic_objective_cat, '1yr_profitability', 'Target Profitability (%)', 'number', 1);

INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `options`, `order_index`) VALUES
(@strategic_objective_cat, 'entrepreneur_dependency', 'Entrepreneur Dependency', 'dropdown', JSON_ARRAY('Yes', 'No'), 2);

-- Questions for Strategy Cascade Category
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `placeholder`, `order_index`) VALUES
(@strategy_cascade_cat, 'winning_aspiration', 'What is our winning aspiration?', 'textarea', 'Describe your long-term vision and goals', 0),
(@strategy_cascade_cat, 'geography_strategy', 'Where will we play?', 'textarea', 'Define your target markets and geographic focus', 1),
(@strategy_cascade_cat, 'competitive_advantage', 'How will we win?', 'textarea', 'Describe your competitive advantage and differentiation', 2),
(@strategy_cascade_cat, 'required_capabilities', 'What capabilities must we have?', 'textarea', 'List the key capabilities needed to succeed', 3);

-- Questions for SWOT Analysis Category
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `items`, `order_index`) VALUES
(@swot_analysis_cat, 'strengths', 'Strengths', 'list', JSON_ARRAY('Existing business with paying customers', 'Trained staff', 'Own equipment', 'Strong brand recognition', 'Good location'), 0),
(@swot_analysis_cat, 'weaknesses', 'Weaknesses', 'list', JSON_ARRAY('No accounting system', 'Weak marketing', 'Limited cash flow', 'Outdated technology', 'Lack of skilled staff'), 1),
(@swot_analysis_cat, 'opportunities', 'Opportunities', 'list', JSON_ARRAY('New market segments', 'Digital transformation', 'Partnership opportunities', 'Government support programs', 'Export potential'), 2),
(@swot_analysis_cat, 'threats', 'Threats', 'list', JSON_ARRAY('Strong competition', 'Economic uncertainty', 'Regulatory changes', 'Supply chain disruptions', 'Technology changes'), 3);

-- Questions for GPS Targets Category
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `due_date`, `order_index`) VALUES
(@gps_targets_cat, 'certify_equipment', 'Complete the certification of equipment', 'task', '2024-04-30', 0),
(@gps_targets_cat, 'implement_booking_system', 'Introduce booking system', 'task', '2024-03-15', 1),
(@gps_targets_cat, 'develop_marketing_plan', 'Develop comprehensive marketing plan', 'task', '2024-02-28', 2),
(@gps_targets_cat, 'setup_accounting_system', 'Set up proper accounting system', 'task', '2024-02-15', 3);

-- =============================================
-- TASK TRIGGERS
-- =============================================

-- Get question IDs for triggers
SET @weakness_question_id = (SELECT id FROM mentorship_questions WHERE question_key = 'weaknesses');
SET @vat_compliance_id = (SELECT id FROM mentorship_questions WHERE question_key = 'vat_compliance');
SET @paye_compliance_id = (SELECT id FROM mentorship_questions WHERE question_key = 'paye_compliance');

-- Create task triggers based on responses
INSERT INTO `mentorship_task_triggers` (`question_id`, `trigger_condition`, `task_description`, `priority`, `due_days_offset`) VALUES
(@weakness_question_id, 'No accounting system', 'Introduce an accounting system', 'high', 14),
(@weakness_question_id, 'Weak marketing', 'Create a marketing strategy', 'medium', 21),
(@weakness_question_id, 'Limited cash flow', 'Develop cash flow management plan', 'high', 7),
(@vat_compliance_id, 'Non-Compliant', 'Assist with VAT compliance and registration', 'high', 10),
(@paye_compliance_id, 'Non-Compliant', 'Help with PAYE compliance setup', 'high', 10);

-- =============================================
-- FINANCIAL TURNAROUND TEMPLATE (Sample)
-- =============================================

-- Categories for Financial Turnaround Template
INSERT INTO `mentorship_categories` (`template_id`, `name`, `description`, `order_index`) VALUES
(@financial_template_id, 'Financial Health Check', 'Comprehensive financial analysis and assessment', 0),
(@financial_template_id, 'Cash Flow Analysis', 'Detailed cash flow examination and projections', 1),
(@financial_template_id, 'Cost Structure Review', 'Analysis of cost structure and optimization opportunities', 2),
(@financial_template_id, 'Turnaround Strategy', 'Development of financial recovery plan', 3);

-- Get category IDs for Financial Turnaround Template
SET @financial_health_cat = (SELECT id FROM mentorship_categories WHERE template_id = @financial_template_id AND name = 'Financial Health Check');

-- Sample questions for Financial Health Check
INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `is_required`, `order_index`) VALUES
(@financial_health_cat, 'debt_to_equity_ratio', 'Current Debt-to-Equity Ratio', 'number', 1, 0),
(@financial_health_cat, 'burn_rate', 'Monthly Burn Rate', 'number', 1, 1),
(@financial_health_cat, 'runway_months', 'Cash Runway (months)', 'number', 1, 2);

INSERT INTO `mentorship_questions` (`category_id`, `question_key`, `label`, `type`, `options`, `order_index`) VALUES
(@financial_health_cat, 'financial_crisis_level', 'Financial Crisis Level', 'dropdown', JSON_ARRAY('Mild concern', 'Moderate risk', 'Severe distress', 'Critical - immediate action required'), 3);

-- =============================================
-- SAMPLE SESSION DATA
-- =============================================

-- Insert a sample session (using a company that exists in your system)
-- You may need to adjust the company_id based on your actual data
INSERT INTO `mentorship_sessions` (`company_id`, `template_id`, `session_date`, `status`, `completion_percentage`, `notes`, `created_by`) VALUES
(1, @baseline_template_id, '2025-01-15 10:00:00', 'completed', 85.50, 'Initial baseline assessment completed. Company shows strong potential with some areas for improvement.', 1);

-- =============================================
-- DATA SEEDING COMPLETE
-- =============================================
