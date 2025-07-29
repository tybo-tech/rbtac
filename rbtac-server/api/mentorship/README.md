# Mentorship Module API Documentation

## Overview

This mentorship module provides a comprehensive API for managing mentorship templates, categories, questions, sessions, responses, and tasks within a business incubation platform. The system is designed to be familiar to users accustomed to Excel workflows while introducing structured, reportable processes.

## Database Schema

The module uses 6 main tables:

1. **mentorship_templates** - Template definitions
2. **mentorship_categories** - Nested categories for organizing questions
3. **mentorship_questions** - Questions with various types and options
4. **mentorship_sessions** - Mentorship sessions tied to companies
5. **mentorship_responses** - Responses to questions in sessions
6. **mentorship_tasks** - Tasks created from sessions or question triggers

## API Endpoints

### Templates

#### Create Template
```http
POST /api/mentorship/templates/create.php
```
**Body:**
```json
{
  "title": "Business Development Assessment",
  "description": "Comprehensive business development evaluation",
  "category": "business-development"
}
```

#### Get Templates
```http
GET /api/mentorship/templates/read.php
GET /api/mentorship/templates/read.php?id=1
GET /api/mentorship/templates/read.php?id=1&details=true
GET /api/mentorship/templates/read.php?search=business
GET /api/mentorship/templates/read.php?category=finance
```

#### Update Template
```http
PUT /api/mentorship/templates/update.php?id=1
```
**Body:**
```json
{
  "title": "Updated Business Assessment",
  "description": "Updated description",
  "category": "business-development"
}
```

### Categories

#### Create Category
```http
POST /api/mentorship/categories/create.php
```
**Body:**
```json
{
  "template_id": 1,
  "parent_id": null,
  "name": "Financial Management",
  "sort_order": 1
}
```

#### Get Categories
```http
GET /api/mentorship/categories/read.php?template_id=1
GET /api/mentorship/categories/read.php?template_id=1&hierarchical=true
GET /api/mentorship/categories/read.php?parent_id=1
GET /api/mentorship/categories/read.php?id=1
```

#### Update Category
```http
PUT /api/mentorship/categories/update.php?id=1
```

#### Reorder Categories
```http
POST /api/mentorship/categories/reorder.php?template_id=1
```
**Body:**
```json
[
  {"id": 1, "sort_order": 1},
  {"id": 2, "sort_order": 2}
]
```

### Questions

#### Create Question
```http
POST /api/mentorship/questions/create.php
```
**Body:**
```json
{
  "template_id": 1,
  "category_id": 1,
  "question_text": "What is your current monthly revenue?",
  "question_type": "number",
  "is_required": true,
  "options": null,
  "calculation": null,
  "trigger_task": false,
  "sort_order": 1
}
```

#### Question Types
- `text` - Single line text
- `textarea` - Multi-line text
- `number` - Numeric input
- `boolean` - Yes/No or true/false
- `dropdown` - Select from options
- `date` - Date picker

#### Get Questions
```http
GET /api/mentorship/questions/read.php?template_id=1
GET /api/mentorship/questions/read.php?category_id=1
GET /api/mentorship/questions/read.php?template_id=1&task_triggers=true
GET /api/mentorship/questions/read.php?id=1
```

#### Update Question
```http
PUT /api/mentorship/questions/update.php?id=1
```

#### Reorder Questions
```http
POST /api/mentorship/questions/reorder.php?template_id=1
```

### Sessions

#### Create Session
```http
POST /api/mentorship/sessions/create.php
```
**Body:**
```json
{
  "company_id": 1,
  "template_id": 1,
  "session_date": "2025-07-29 14:30:00",
  "notes": "Initial assessment session",
  "created_by": 1
}
```

#### Get Sessions
```http
GET /api/mentorship/sessions/read.php
GET /api/mentorship/sessions/read.php?id=1
GET /api/mentorship/sessions/read.php?id=1&details=true
GET /api/mentorship/sessions/read.php?company_id=1
GET /api/mentorship/sessions/read.php?template_id=1
GET /api/mentorship/sessions/read.php?recent&limit=10
GET /api/mentorship/sessions/read.php?statistics
```

#### Update Session
```http
PUT /api/mentorship/sessions/update.php?id=1
```

### Responses

#### Create/Update Response
```http
POST /api/mentorship/responses/upsert.php
```
**Body:**
```json
{
  "session_id": 1,
  "question_id": 1,
  "response_text": "50000",
  "numeric_value": 50000,
  "date_value": null,
  "boolean_value": null
}
```

#### Save Multiple Responses
```http
POST /api/mentorship/responses/save-multiple.php?session_id=1
```
**Body:**
```json
[
  {
    "question_id": 1,
    "numeric_value": 50000
  },
  {
    "question_id": 2,
    "response_text": "Manufacturing"
  }
]
```

#### Get Responses
```http
GET /api/mentorship/responses/read.php?session_id=1
GET /api/mentorship/responses/read.php?id=1
GET /api/mentorship/responses/read.php?statistics&session_id=1
```

### Tasks

#### Create Task
```http
POST /api/mentorship/tasks/create.php
```
**Body:**
```json
{
  "session_id": 1,
  "question_id": 1,
  "company_id": 1,
  "task_title": "Set up accounting system",
  "task_description": "Company needs to implement proper accounting software",
  "assigned_to": 2,
  "status": "pending",
  "due_date": "2025-08-05"
}
```

#### Task Statuses
- `pending` - Not started
- `in_progress` - Currently being worked on
- `done` - Completed

#### Get Tasks
```http
GET /api/mentorship/tasks/read.php
GET /api/mentorship/tasks/read.php?id=1
GET /api/mentorship/tasks/read.php?session_id=1
GET /api/mentorship/tasks/read.php?company_id=1
GET /api/mentorship/tasks/read.php?status=pending
GET /api/mentorship/tasks/read.php?assigned_to=1
GET /api/mentorship/tasks/read.php?overdue
GET /api/mentorship/tasks/read.php?statistics
```

#### Update Task
```http
PUT /api/mentorship/tasks/update.php?id=1
```

#### Update Task Status
```http
PUT /api/mentorship/tasks/update-status.php?id=1
```
**Body:**
```json
{
  "status": "in_progress"
}
```

#### Create Task from Trigger
```http
POST /api/mentorship/tasks/create-from-trigger.php
```
**Body:**
```json
{
  "session_id": 1,
  "question_id": 1,
  "company_id": 1,
  "response_data": "No accounting system in place"
}
```

## Example Workflow

1. **Create Template**: Define a mentorship template for business assessment
2. **Add Categories**: Create nested categories (Finance, Marketing, Operations)
3. **Add Questions**: Add questions to categories with various types
4. **Create Session**: Start a mentorship session with a company
5. **Record Responses**: Save answers to questions during the session
6. **Generate Tasks**: Create follow-up tasks based on responses
7. **Track Progress**: Monitor task completion and session outcomes

## Response Format

All endpoints return JSON responses in this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* result data */ },
  "id": 123 // for create operations
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Integration with Angular

The API is designed to work seamlessly with Angular applications using the following patterns:

- RESTful endpoints
- JSON request/response format
- Proper HTTP status codes
- CORS headers for cross-origin requests
- Consistent error handling

## File Structure

```
api/mentorship/
├── index.php (API overview)
├── templates/
│   ├── create.php
│   ├── read.php
│   └── update.php
├── categories/
│   ├── create.php
│   ├── read.php
│   ├── update.php
│   └── reorder.php
├── questions/
│   ├── create.php
│   ├── read.php
│   ├── update.php
│   └── reorder.php
├── sessions/
│   ├── create.php
│   ├── read.php
│   └── update.php
├── responses/
│   ├── upsert.php
│   ├── read.php
│   └── save-multiple.php
└── tasks/
    ├── create.php
    ├── read.php
    ├── update.php
    ├── update-status.php
    └── create-from-trigger.php
```

## Models

```
models/
├── MentorshipTemplate.php
├── MentorshipCategory.php
├── MentorshipQuestion.php
├── MentorshipSession.php
├── MentorshipResponse.php
└── MentorshipTask.php
```

Each model includes comprehensive CRUD operations, validation, and business logic specific to the mentorship workflow.
