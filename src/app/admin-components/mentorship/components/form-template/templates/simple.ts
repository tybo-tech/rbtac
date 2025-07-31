import { IFormTemplate } from "../../../../../../models/mentorship-form.interfaces";

export const SIMPLE_FORM_TEMPLATE: IFormTemplate ={
  title: 'Take On Baseline - Entrepreneur Information',
  description: 'Initial mentorship intake form for entrepreneurs',
  groups: [
    {
      key: 'entrepreneur_info',
      title: 'Entrepreneur Information',
      fields: [
        { key: 'gps_session_number', label: 'GPS Session Number', type: 'text' },
        { key: 'gps_round', label: 'GPS Round', type: 'text' },
        { key: 'business_name', label: 'Business Name', type: 'text' },
        { key: 'entrepreneur_name', label: 'Entrepreneur Name/s', type: 'text' },
        { key: 'industry', label: 'Industry', type: 'text' },
        { key: 'type_of_business', label: 'Type of Business', type: 'text' },
        { key: 'strategy_guide', label: 'Strategy Guide', type: 'text' },
        { key: 'personal_guide', label: 'Personal Guide', type: 'text' },
        { key: 'category_programme', label: 'Category and Programme', type: 'text' },
        { key: 'gps_date', label: 'GPS Date', type: 'date' },
        { key: 'programme_category', label: 'Programme/Category', type: 'text' },
        { key: 'prosperator', label: 'Prosperator', type: 'text' },
        { key: 'finance_guide', label: 'Finance Guide', type: 'text' },
        { key: 'sales_marketing_guide', label: 'Sales/Marketing Guide', type: 'text' }
      ]
    },
    {
      key: 'introduction',
      title: 'Introduction to the Business',
      fields: [
        {
          key: 'intro_description',
          label: 'Briefly describe how and why you started your business and tell us about the current state.',
          type: 'textarea'
        }
      ]
    },
    {
      key: 'self_assessment',
      title: 'Self Assessment',
      fields: [
        { key: 'sales_ability', label: 'Sales Ability (1-10)', type: 'number' },
        { key: 'marketing_ability', label: 'Marketing Ability (1-10)', type: 'number' },
        { key: 'vat_status', label: 'State of VAT', type: 'select', options: ['Compliant', 'Non-Compliant'] },
        { key: 'paye_status', label: 'State of PAYE', type: 'select', options: ['Compliant', 'Non-Compliant'] }
      ]
    },
    {
      key: 'executive_summary',
      title: 'Executive Summary',
      type: 'table',
      fields: [
        {
          key: 'exec_summary_table',
          label: 'Financials',
          type: 'table',
          columns: [
            { key: 'item', label: 'Period', type: 'text' },
            { key: 'pre_ignition', label: 'Pre-Ignition', type: 'text' },
            { key: 'end_year_1', label: 'End of Year 1', type: 'text' },
            { key: 'end_year_2', label: 'End of Year 2', type: 'text' },
            { key: 'change_1', label: 'Change 1st Year', type: 'text' },
            { key: 'change_2', label: 'Change 2nd Year', type: 'text' }
          ]
        }
      ]
    },
    {
      key: 'hr_overview',
      title: 'HR Overview',
      type: 'table',
      fields: [
        {
          key: 'hr_table',
          label: 'Staff Breakdown',
          type: 'table',
          columns: [
            { key: 'role', label: 'Role', type: 'text' },
            { key: 'pre_ignition', label: 'Pre-Ignition', type: 'number' },
            { key: 'year1', label: 'End of 1st Year', type: 'number' },
            { key: 'year2', label: 'End of 2nd Year', type: 'number' },
            { key: 'change1', label: 'Change 1st Year', type: 'text' },
            { key: 'change2', label: 'Change 2nd Year', type: 'text' }
          ]
        }
      ]
    },
    {
      key: 'strategic_objective',
      title: 'Strategic Objective',
      fields: [
        { key: 'current_turnover', label: 'Current Turnover (monthly avg.)', type: 'text' },
        { key: '1yr_turnover', label: '1 Year Turnover (monthly avg.)', type: 'text' },
        { key: '3yr_turnover', label: '3 Year Turnover (monthly avg.)', type: 'text' },
        { key: '1yr_profitability', label: '1 Year Profitability (%)', type: 'text' },
        { key: '3yr_profitability', label: '3 Year Profitability (%)', type: 'text' },
        { key: 'customer_dependency', label: 'Customer Dependency', type: 'text' },
        { key: 'entrepreneur_dependency', label: 'Entrepreneur Dependency', type: 'text' },
        { key: 'supplier_dependency', label: 'Supplier Dependency', type: 'text' }
      ]
    },
    {
      key: 'strategic_direction',
      title: 'Strategic Direction',
      fields: [
        {
          key: 'strategic_direction',
          label: 'In 1 to 2 sentences describe the state of your business one year from now',
          type: 'textarea'
        }
      ]
    },
    {
      key: 'strategy_cascade',
      title: 'Strategy Cascade',
      fields: [
        { key: 'winning_aspiration', label: 'What is our winning aspiration?', type: 'textarea' },
        { key: 'where_play', label: 'Where will we play?', type: 'textarea' },
        { key: 'how_win', label: 'How will we win?', type: 'textarea' },
        { key: 'capabilities', label: 'What capabilities must we have?', type: 'textarea' },
        { key: 'management_systems', label: 'What management systems do we need?', type: 'textarea' }
      ]
    },
    {
      key: 'swot_analysis',
      title: 'SWOT-A',
      type: 'table',
      fields: [
        {
          key: 'swot_table',
          label: 'SWOT Breakdown',
          type: 'table',
          columns: [
            { key: 'strengths', label: 'Strengths', type: 'text' },
            { key: 'action_s', label: 'Action', type: 'text' },
            { key: 'weaknesses', label: 'Weaknesses', type: 'text' },
            { key: 'action_w', label: 'Action', type: 'text' }
          ]
        },
        {
          key: 'swot_external',
          label: 'External SWOT',
          type: 'table',
          columns: [
            { key: 'opportunities', label: 'Opportunities', type: 'text' },
            { key: 'action_o', label: 'Action', type: 'text' },
            { key: 'threats', label: 'Threats', type: 'text' },
            { key: 'action_t', label: 'Action', type: 'text' }
          ]
        }
      ]
    },
    {
      key: 'gps_targets',
      title: 'GPS Targets',
      type: 'table',
      fields: [
        {
          key: 'targets_table',
          label: 'Targets',
          type: 'table',
          columns: [
            { key: 'strategy_targets', label: 'Strategy/General Targets', type: 'text' },
            { key: 'by_when1', label: 'By When?', type: 'date' },
            { key: 'finance_targets', label: 'Finance Targets', type: 'text' },
            { key: 'by_when2', label: 'By When?', type: 'date' }
          ]
        },
        {
          key: 'marketing_targets',
          label: 'Sales & Marketing / Personal Development',
          type: 'table',
          columns: [
            { key: 'marketing_target', label: 'Sales & Marketing Targets', type: 'text' },
            { key: 'by_when_marketing', label: 'By When?', type: 'date' },
            { key: 'personal_dev_target', label: 'Personal Development Targets', type: 'text' },
            { key: 'by_when_dev', label: 'By When?', type: 'date' }
          ]
        }
      ]
    }
  ]
};
