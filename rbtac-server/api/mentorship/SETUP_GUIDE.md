# RBTAC Mentorship System Setup & Testing Guide

## Overview
The mentorship system converts Excel-based forms into digital templates that can be used for tracking entrepreneur progress through various mentorship programs.

## Database Migration

### 1. Run the Migration Scripts

Execute the migration files in order:

```sql
-- 1. First run the main structure migration
SOURCE 'c:\dev\projects\angular\rbtac-standalone\rbtac-server\migrations\mentorship_system_migrations.sql';

-- 2. Then seed with sample data
SOURCE 'c:\dev\projects\angular\rbtac-standalone\rbtac-server\migrations\mentorship_sample_data.sql';
```

### 2. Verify Database Structure

After running migrations, you should have these new tables:
- `mentorship_templates`
- `mentorship_categories` 
- `mentorship_questions`
- `mentorship_sessions`
- `mentorship_responses`
- `mentorship_tasks`
- `mentorship_task_triggers`
- `mentorship_triggered_tasks`

## Backend Server Setup

### 1. Start the Docker Environment

```bash
cd c:\dev\projects\angular\rbtac-standalone\rbtac-server
docker-compose up -d
```

This will start:
- PHP API server on `http://localhost:8080`
- MySQL database on port `3306`
- PHPMyAdmin on `http://localhost:8081`

### 2. Verify API Endpoints

The mentorship API endpoints are available at:
- Templates: `http://localhost:8080/api/mentorship/templates.php`
- Sessions: `http://localhost:8080/api/mentorship/sessions.php`  
- Tasks: `http://localhost:8080/api/mentorship/tasks.php`
- Responses: `http://localhost:8080/api/mentorship/responses.php`
- Analytics: `http://localhost:8080/api/mentorship/analytics.php`

## Postman Testing

### 1. Import Collection

Import the Postman collection file:
```
c:\dev\projects\angular\rbtac-standalone\rbtac-server\api\mentorship\RBTAC_Mentorship_API.postman_collection.json
```

### 2. Set Base URL Variable

In Postman, set the collection variable:
- `base_url`: `http://localhost:8080/api`

### 3. Test Key Endpoints

**Test Sequence:**

1. **Seed Baseline Template**
   - POST `{{base_url}}/mentorship/templates.php?action=seed_baseline`
   - This creates the baseline template with sample structure

2. **Get All Templates**
   - GET `{{base_url}}/mentorship/templates.php`
   - Verify the template was created

3. **Get Template Details**
   - GET `{{base_url}}/mentorship/templates.php?id=1`
   - Should return template with categories and questions

4. **Search Companies**
   - GET `{{base_url}}/companies/list.php?search=test`
   - Test company search functionality

5. **Create Session**
   - POST `{{base_url}}/mentorship/sessions.php`
   - Create a new mentorship session

6. **Save Responses**
   - POST `{{base_url}}/mentorship/sessions.php?action=save_responses`
   - Save session responses

## Frontend Integration

### 1. Service Configuration

The `MentorshipTemplateService` is configured to use:
- Base URL: `http://localhost:8080/api/mentorship`
- Endpoint pattern: `{service}.php`

### 2. Router Configuration

The mentorship routes are configured as child routes:
- `/mentorship/overview` - Dashboard
- `/mentorship/templates` - Template manager
- `/mentorship/sessions` - Session manager  
- `/mentorship/tasks` - Task management
- `/mentorship/analytics` - Progress analytics

### 3. Component Integration

**Template Manager:**
- `template-manager.component.ts` - Dynamic template builder
- Supports categories, questions, validation rules
- Real-time form preview

**Session Manager:**  
- `mentorship-session-manager.component.ts` - Complete workflow
- Company search → Template selection → Form execution
- Progress tracking and response saving

## Mentorship Workflow

### 1. Admin Creates Templates

1. Navigate to `/mentorship/templates`
2. Use Template Manager to:
   - Create categories
   - Add questions with validation
   - Set question types (text, number, dropdown, etc.)
   - Configure task triggers

### 2. Mentorship Session Execution

1. Navigate to `/mentorship/sessions`
2. Use Session Manager to:
   - Search for company
   - Select mentorship template
   - Execute questionnaire
   - Save responses
   - Generate automatic tasks

### 3. Progress Tracking

1. Navigate to `/mentorship/analytics`
2. View:
   - Company progress reports
   - Template completion statistics
   - Task completion rates
   - Response analytics

## Excel Template Conversion

### Sample Excel Forms Supported:

1. **TAKE ON BASELINE – ENTREPRENEUR INFORMATION**
   - Business info, self-assessment, financial overview
   - Strategic objectives, SWOT analysis
   - GPS targets and task generation

2. **Financial Turnaround Assessment**
   - Financial health check, cash flow analysis
   - Cost structure review, recovery planning

3. **Growth Strategy Planning**
   - Market analysis, competitive positioning
   - Scaling strategies, investment readiness

### Conversion Process:

1. **Analyze Excel Structure**
   - Identify sections → Categories
   - Identify questions → Questions with types
   - Identify validation rules → Question validation

2. **Create Digital Template**
   - Use Template Manager
   - Map Excel sections to categories
   - Convert questions with proper types
   - Set up task triggers for follow-ups

3. **Test & Validate**
   - Create test session
   - Execute questionnaire
   - Verify response saving
   - Check task generation

## Troubleshooting

### Common Issues:

1. **API Connection Errors**
   - Verify Docker containers are running
   - Check port 8080 is available
   - Ensure database is properly migrated

2. **Database Issues**
   - Run migrations in correct order
   - Check MySQL container logs
   - Verify database permissions

3. **Frontend Routing**
   - Ensure child routes are properly configured
   - Check RouterOutlet in mentorship.component.html
   - Verify service injection in components

### Debug Commands:

```bash
# Check Docker containers
docker ps

# Check API logs
docker logs rbtac-api-container

# Check database connection
docker exec -it rbtac-api-mysql-container mysql -u docker -p

# Test API endpoint
curl http://localhost:8080/api/mentorship/templates.php
```

## Next Steps

1. **Database Migration**: Execute migration scripts
2. **API Testing**: Use Postman collection to test endpoints
3. **Frontend Testing**: Navigate to mentorship routes and test components
4. **Excel Conversion**: Begin converting actual Excel forms to digital templates

The mentorship system is now ready for development and testing!
