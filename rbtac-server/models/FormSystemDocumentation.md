# 📘 Form System Documentation

_Last updated: 2025-07-31 05:55:25_

## 🧱 Overview

This system enables the creation of **dynamic mentorship forms** where form templates are defined, sessions are submitted by users, and flattened answers are generated for reporting.

It supports:
- Customizable form templates with grouped fields and table-type components
- Capturing user responses via sessions
- Automatic flattening of structured values into atomic answer rows
- Powerful querying, analytics, and export capabilities

---

## 🗂️ Core Tables

### 1. `form_templates`
- Stores the blueprint of each form (title, description, and full field structure)
- Structure is stored as a JSON array of groups, each containing fields
- Key columns:
  - `structure` (JSON) → Defines grouped fields, field types, labels, and table columns
  - `created_by`, `created_at`, `updated_by`, `status_id`

### 2. `form_sessions`
- Represents one user's response/submission to a form template
- Stores `values` (JSON), mapped by group + field keys
- Tracks company ID, user ID, and form_template_id
- Key columns:
  - `values` (JSON) → Contains user responses in original nested format
  - Linked to `form_templates` via `form_template_id`
  - Used by `FormAnswerSync` to generate flattened `form_answers`

### 3. `form_answers`
- Stores one flattened atomic answer per field entry (text, table cell, etc.)
- Used for reporting, aggregation, and querying across all submissions
- Supports `table` types using:
  - `row_index` → Which row in a table field
  - `column_key` → Which column in the table
- Key columns:
  - `form_session_id`, `form_template_id`, `group_key`, `field_key`
  - `row_index`, `column_key`, `value`, `value_type`
  - `created_by`, `status_id`

---

## 🧠 Data Flow Summary

### Step 1: Define Form Template
- Use `FormTemplate` class to:
  - Create a template with nested group + field structure
  - Structure supports simple types (`text`, `number`, `date`, etc.) and `table` type
  - Tables contain `columns[]` which define the cell structure

### Step 2: Submit Form Session
- Use `FormSession` class to:
  - Add or update a user's session (`values`) linked to a template
  - Stores full values in JSON as submitted by the frontend
  - Auto-syncs answers using `FormAnswerSync`

### Step 3: Sync Answers via `FormAnswerSync`
- Deletes all existing answers for a session
- Parses `structure` and `values` to flatten:
  - Simple fields → One answer row per field
  - Table fields → One answer row per table cell, with `row_index` and `column_key`
- Bulk inserts into `form_answers` table

---

## 🔄 Syncing Strategy

- Always **delete and re-insert** answers for a session to ensure accuracy
- Sync is triggered:
  - After new session creation
  - After session update
  - On-demand (e.g., if template structure changes)
- Central logic lives in `FormAnswerSync::syncSessionAnswers()`

---

## 🛠️ Key Classes

### ✅ `FormTemplate.php`
- `addFormTemplate()`, `updateFormTemplate()`, `getFormTemplateById()`, `archiveFormTemplate()`

### ✅ `FormSession.php`
- `addFormSession()`, `updateFormSession()`, `deleteFormSession()`
- `getSessionWithTemplate()` → returns values and structure
- `updateSessionValuesWithSync()` → transactional update + sync
- `deleteFormSessionWithAnswers()` → safe hard delete with answer cleanup

### ✅ `FormAnswerSync.php`
- `syncSessionAnswers()` → Main method for syncing answers
- `resyncTemplate()` → Resync all sessions for a template
- `flattenFormValues()`, `flattenTableField()`, `flattenSimpleField()`

### ✅ `FormAnswer.php`
- `deleteAnswersBySession()`
- `bulkInsertAnswers()` → Efficient prepared inserts

---

## 📊 Example: Answer Flattening

For this table field:

```json
"hr_table": [
  { "role": "Manager", "year1": 3 },
  { "role": "Clerk", "year1": 1 }
]
```

The flattened `form_answers` will be:

| session_id | group_key   | field_key | row_index | column_key | value   |
|------------|-------------|-----------|-----------|------------|---------|
| 1          | hr_overview | hr_table  | 0         | role       | Manager |
| 1          | hr_overview | hr_table  | 0         | year1      | 3       |
| 1          | hr_overview | hr_table  | 1         | role       | Clerk   |
| 1          | hr_overview | hr_table  | 1         | year1      | 1       |

## 🚀 API Endpoints

### Form Templates
- `POST /api/form-templates/add.php` → Create new template
- `GET /api/form-templates/list.php?status_id=1` → List active templates
- `GET /api/form-templates/get.php?id=123` → Get single template
- `PUT /api/form-templates/update.php` → Update template
- `DELETE /api/form-templates/delete.php?id=123` → Delete template
- `GET /api/form-templates/analytics.php?template_id=123&type=overview` → Template analytics

### Form Sessions
- `POST /api/form-sessions/add.php` → Create session
- `POST /api/form-sessions/save-with-sync.php` → Create/update with auto-sync
- `GET /api/form-sessions/list.php?company_id=456` → List sessions
- `GET /api/form-sessions/get.php?id=789&with_template=true` → Get session + template
- `PUT /api/form-sessions/update.php` → Update session
- `POST /api/form-sessions/update-values.php` → Update values with sync
- `DELETE /api/form-sessions/delete.php?id=789&with_answers=true` → Safe delete

### Form Answers
- `GET /api/form-answers/list.php?session_id=789` → Get answers for session
- `POST /api/form-answers/resync.php` → Manual resync
- `GET /api/form-answers/analytics.php?template_id=123` → Field analytics
- `GET /api/form-answers/sync-status.php?session_id=789` → Check sync status

---

## 📊 Analytics Capabilities

### Field Analytics
```php
// Get response frequency for any field
GET /api/form-answers/analytics.php?template_id=7&group_key=self_assessment&field_key=sales_ability

// Get numeric statistics (avg, min, max, std_dev)
GET /api/form-answers/analytics.php?template_id=7&group_key=self_assessment&field_key=sales_ability&type=stats
```

### Template Analytics
```php
// Overview: session counts, completion rates
GET /api/form-templates/analytics.php?template_id=7&type=overview

// Field statistics across all sessions
GET /api/form-templates/analytics.php?template_id=7&type=field_stats

// Completion analysis
GET /api/form-templates/analytics.php?template_id=7&type=completion
```

---

## 🏗️ Advanced Usage Examples

### Creating a Complete Form Workflow
```php
// 1. Create template
$template = [
  'title' => 'Monthly Business Review',
  'structure' => [
    'groups' => [
      [
        'key' => 'performance',
        'title' => 'Performance Metrics', 
        'fields' => [
          ['key' => 'revenue', 'label' => 'Monthly Revenue', 'type' => 'number'],
          ['key' => 'customers', 'label' => 'New Customers', 'type' => 'number']
        ]
      ]
    ]
  ]
];

// 2. Submit session with auto-sync
$session = [
  'form_template_id' => 1,
  'company_id' => 123,
  'user_id' => 456,
  'values' => [
    'performance' => [
      'revenue' => 50000,
      'customers' => 12
    ]
  ]
];

// 3. Answers automatically flattened to:
// session_id=1, group_key='performance', field_key='revenue', value='50000', value_type='number'
// session_id=1, group_key='performance', field_key='customers', value='12', value_type='number'
```

### Complex Table Example
```php
// SWOT Analysis table structure
'swot_analysis' => [
  'swot_table' => [
    ['strengths' => 'Strong brand', 'action_s' => 'Leverage in marketing'],
    ['strengths' => 'Good location', 'action_s' => 'Expand local presence']
  ]
]

// Flattened answers:
// row_index=0, column_key='strengths', value='Strong brand'
// row_index=0, column_key='action_s', value='Leverage in marketing'  
// row_index=1, column_key='strengths', value='Good location'
// row_index=1, column_key='action_s', value='Expand local presence'
```

---

## 🔒 Security & Validation

### Input Validation
- All API endpoints validate required fields
- JSON structure validation for templates
- SQL injection protection via prepared statements
- User authentication required for all operations

### Data Integrity
- Foreign key constraints maintain relationships
- Transactional operations ensure atomicity
- Rollback protection on sync failures
- Soft delete with status_id for audit trails

---

## ⚡ Performance Considerations

### Optimization Features
- **Bulk operations**: `bulkInsertAnswers()` for efficient batch processing
- **Indexed queries**: Proper indexes on session_id, template_id, group_key, field_key
- **Lazy sync**: Optional sync flag to defer answer generation
- **Pagination support**: For large result sets in analytics

### Monitoring
- Sync statistics tracking via `getLastSyncStats()`
- Query logging for slow operations
- Answer count validation between sessions and answers

---

## 🧪 Testing / Usage Tips

### Development Testing
```bash
# Test template creation
curl -X POST http://localhost/api/form-templates/add.php 
  -H "Content-Type: application/json" 
  -d '{"title":"Test Form","structure":{"groups":[...]}}'

# Test session submission with sync
curl -X POST http://localhost/api/form-sessions/save-with-sync.php 
  -H "Content-Type: application/json" 
  -d '{"form_template_id":1,"values":{...}}'

# Verify answer flattening
curl "http://localhost/api/form-answers/list.php?session_id=1"
```

### Sync Management
- **Manual sync**: `POST /api/form-answers/resync.php`
- **Template resync**: `FormAnswerSync::resyncTemplate($templateId)`
- **Session cleanup**: `FormSession::deleteFormSessionWithAnswers($sessionId)`
- **Validation**: Compare session values count with flattened answers count

### Debugging Common Issues
1. **Missing answers**: Check if sync was triggered after session save
2. **Duplicate answers**: Ensure delete-before-insert pattern in sync
3. **Table flattening**: Verify row_index and column_key for table fields
4. **Performance**: Monitor bulk insert batch sizes for large forms

---

## 🔄 Migration & Deployment

### Database Setup
```sql
-- Core tables (see enhanced-stages-schema.sql)
CREATE TABLE form_templates (...);
CREATE TABLE form_sessions (...);
CREATE TABLE form_answers (...);

-- Indexes for performance
CREATE INDEX idx_form_answers_session ON form_answers(form_session_id);
CREATE INDEX idx_form_answers_template ON form_answers(form_template_id);
CREATE INDEX idx_form_answers_field ON form_answers(group_key, field_key);
```

### Environment Configuration
- PHP 8.2+ with PDO MySQL extension
- MySQL 8.0+ for JSON column support
- Sufficient memory for bulk operations (512MB+ recommended)
- Error logging enabled for production monitoring

---

## 📈 Roadmap & Future Enhancements

### Planned Features
- **Export capabilities**: PDF reports, Excel exports
- **Real-time sync**: WebSocket notifications for live updates
- **Form versioning**: Track template changes over time
- **Conditional logic**: Show/hide fields based on previous answers
- **File uploads**: Support for document attachments

### Integration Opportunities
- **Angular Dashboard**: Real-time form completion widgets
- **Chart.js Integration**: Visual analytics and progress tracking
- **Email Reports**: Automated mentor assessment delivery
- **External APIs**: Connect with CRM systems and databases

---

## 📁 Project Structure

```
rbtac-server/
├── models/
│   ├── FormTemplate.php          # Template CRUD & analytics
│   ├── FormSession.php           # Session management & auto-sync
│   ├── FormAnswer.php            # Normalized answer storage
│   └── FormSystemDocumentation.md # This documentation
├── services/
│   └── FormAnswerSync.php        # Sync orchestration service
└── api/
    ├── form-templates/
    │   ├── add.php              # Create template
    │   ├── get.php              # Get single template
    │   ├── list.php             # List templates
    │   ├── update.php           # Update template
    │   ├── delete.php           # Delete template
    │   └── analytics.php        # Template analytics
    ├── form-sessions/
    │   ├── add.php              # Create session
    │   ├── save-with-sync.php   # Create/update with auto-sync
    │   ├── get.php              # Get session
    │   ├── list.php             # List sessions
    │   ├── update.php           # Update session
    │   ├── update-values.php    # Update values with sync
    │   └── delete.php           # Delete session
    └── form-answers/
        ├── list.php             # Get session answers
        ├── resync.php           # Manual resync
        ├── analytics.php        # Field analytics
        └── sync-status.php      # Check sync status
```

---

## ✅ Production Checklist

### Pre-Deployment
- [ ] Database tables created with proper indexes
- [ ] Foreign key constraints enabled
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] Performance testing completed

### Security Verification
- [ ] Input validation on all endpoints
- [ ] SQL injection protection verified
- [ ] User authentication implemented
- [ ] CORS headers configured
- [ ] Rate limiting enabled

### Monitoring Setup
- [ ] Sync failure alerts configured
- [ ] Query performance monitoring
- [ ] Disk space monitoring for JSON storage
- [ ] Memory usage tracking for bulk operations
- [ ] API response time logging

---

## ✅ Final Notes

### System Benefits
- **Flexibility**: JSON storage allows dynamic form structures without schema changes
- **Performance**: Normalized answers enable fast SQL queries and aggregations  
- **Scalability**: Bulk operations and proper indexing support large datasets
- **Analytics**: Rich reporting capabilities with field-level statistics
- **Reliability**: Transactional operations with rollback protection

### Best Practices
- Always use `save-with-sync.php` for session creation/updates to ensure data consistency
- Monitor sync statistics to detect potential issues early
- Use analytics endpoints for real-time dashboard widgets
- Implement proper error handling for bulk operations
- Regular backups due to hybrid JSON + normalized storage approach

### Troubleshooting
- **Sync failures**: Check database logs and ensure proper foreign key relationships
- **Performance issues**: Verify proper indexing on `form_answers` table
- **Data inconsistency**: Use resync endpoints to rebuild answer normalization
- **Memory issues**: Optimize bulk insert batch sizes for large forms

---

**🎯 Ready for Production!** This system provides enterprise-grade form management with powerful analytics capabilities and robust data integrity.
