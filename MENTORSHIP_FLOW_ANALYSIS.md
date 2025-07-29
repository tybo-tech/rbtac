# RBTAC Mentorship System - Complete Flow Analysis

## 📊 **System Architecture Overview**

The mentorship system follows a clean layered architecture pattern:
**Database Tables → PHP Models → API Endpoints → TypeScript Services → Angular Components**

---

## 🗄️ **1. DATABASE LAYER**

### **Core Tables Structure:**

| Table | Purpose | Key Relationships |
|-------|---------|------------------|
| `mentorship_templates` | Stores template definitions (e.g., "Baseline Entrepreneur Info") | → `mentorship_categories` |
| `mentorship_categories` | Groups questions into sections (e.g., "Business Info", "SWOT Analysis") | → `mentorship_questions` |
| `mentorship_questions` | Individual form questions with validation rules | → `mentorship_responses` |
| `mentorship_sessions` | Session instances linking companies to templates | → `mentorship_responses` |
| `mentorship_responses` | User answers stored as JSON | Links sessions + questions |
| `mentorship_tasks` | Generated action items | → `mentorship_sessions` |
| `mentorship_task_triggers` | Rules for automatic task creation | → `mentorship_questions` |
| `mentorship_triggered_tasks` | Log of triggered tasks | → `mentorship_sessions` |

### **Key Database Relationships:**
```sql
mentorship_templates (1) → (many) mentorship_categories
mentorship_categories (1) → (many) mentorship_questions  
companies (1) → (many) mentorship_sessions
mentorship_templates (1) → (many) mentorship_sessions
mentorship_sessions (1) → (many) mentorship_responses
mentorship_questions (1) → (many) mentorship_responses
```

---

## 🐘 **2. PHP MODEL LAYER**

### **Core PHP Classes:**

| PHP Class | Database Table | Purpose |
|-----------|----------------|---------|
| `MentorshipTemplate.php` | `mentorship_templates` | CRUD operations for templates |
| `MentorshipCategory.php` | `mentorship_categories` | Category management |
| `MentorshipQuestion.php` | `mentorship_questions` | Question management with validation |
| `MentorshipSession.php` | `mentorship_sessions` | Session lifecycle management |
| `MentorshipResponse.php` | `mentorship_responses` | Response data handling (JSON) |
| `MentorshipTask.php` | `mentorship_tasks` | Task creation and tracking |

### **Key PHP Model Methods:**

**MentorshipTemplate.php:**
```php
- getAll() → Get all templates
- getById($id) → Get specific template
- getWithDetails($id) → Template + categories + questions
- getByProgramType($type) → Filter by program type
- create($data) → Create new template
- update($id, $data) → Update template
- delete($id) → Remove template
```

**MentorshipSession.php:**
```php
- getAll() → All sessions with JOIN data
- getByCompanyId($companyId) → Company's sessions
- getById($id) → Session details
- getByIdWithResponses($id) → Session + all responses
- create($data) → Create new session
- update($id, $data) → Update session
- updateCompletionPercentage($id) → Calculate progress
```

---

## 🔗 **3. API ENDPOINT LAYER**

### **Core API Endpoints:**

| Endpoint | PHP Class Used | HTTP Methods | Purpose |
|----------|----------------|--------------|---------|
| `/api/mentorship/templates.php` | `MentorshipTemplate` | GET, POST, PUT, DELETE | Template CRUD |
| `/api/mentorship/sessions.php` | `MentorshipSession` | GET, POST, PUT | Session management |
| `/api/mentorship/categories.php` | `MentorshipCategory` | GET, POST, PUT, DELETE | Category management |
| `/api/mentorship/questions.php` | `MentorshipQuestion` | GET, POST, PUT, DELETE | Question management |
| `/api/mentorship/responses.php` | `MentorshipResponse` | GET, POST, PUT | Response handling |
| `/api/mentorship/tasks.php` | `MentorshipTask` | GET, POST, PUT | Task management |
| `/api/mentorship/analytics.php` | Multiple models | GET | Reporting & statistics |

### **API Request/Response Flow:**

**Example: Getting Template with Questions**
```
GET /api/mentorship/templates.php?id=1
→ templates.php calls MentorshipTemplate::getWithDetails(1)
→ MentorshipTemplate joins categories and questions tables
→ Returns JSON: { success: true, data: { template + categories + questions } }
```

**Example: Creating Session**
```
POST /api/mentorship/sessions.php
Body: { company_id: 1, template_id: 1, session_date: "2025-01-15" }
→ sessions.php calls MentorshipSession::create($data)
→ Creates record in mentorship_sessions table
→ Returns JSON: { success: true, data: session, id: 123 }
```

---

## 📱 **4. TYPESCRIPT SERVICE LAYER**

### **Core Angular Services:**

| Service | Purpose | API Endpoints Used |
|---------|---------|-------------------|
| `MentorshipService` | Primary service - templates, sessions, analytics | `/mentorship/templates.php`, `/mentorship/sessions.php` |
| `MentorshipTemplateService` | Template-focused operations | `/mentorship/templates.php` |

### **Service Method Mapping:**

**MentorshipService Methods → API Endpoints:**
```typescript
// TEMPLATE OPERATIONS
getTemplates() → GET /api/mentorship/templates.php
getTemplate(id) → GET /api/mentorship/templates.php?id={id}
createTemplate(template) → POST /api/mentorship/templates.php
updateTemplate(id, template) → PUT /api/mentorship/templates.php?id={id}
deleteTemplate(id) → DELETE /api/mentorship/templates.php?id={id}

// SESSION OPERATIONS  
getSessions() → GET /api/mentorship/sessions.php
getSessionsByCompany(companyId) → GET /api/mentorship/sessions.php?company_id={id}
createSession(session) → POST /api/mentorship/sessions.php
saveSessionResponses(sessionId, responses) → POST /api/mentorship/sessions.php?action=save_responses

// COMPANY OPERATIONS
searchCompanies(term) → GET /api/companies/list.php?search={term}
getCompany(id) → GET /api/companies/read.php?id={id}

// TASK OPERATIONS
getTasksBySession(sessionId) → GET /api/mentorship/tasks.php?session_id={id}
updateTaskStatus(taskId, status) → PUT /api/mentorship/tasks.php?id={id}

// ANALYTICS
getStatistics() → GET /api/mentorship/analytics.php
getCompanyProgress(companyId) → GET /api/mentorship/analytics.php?company_id={id}
```

---

## 🧩 **5. TYPESCRIPT INTERFACE LAYER**

### **Core TypeScript Interfaces:**

**From `src/models/mentorship.ts`:**
```typescript
interface IMentorshipTemplate {
  id?: number;
  name: string;
  description: string;
  program_type: string;  // 'baseline', 'financial_turnaround'
  version: string;
  is_active: boolean;
  categories: IMentorshipCategory[];
}

interface IMentorshipCategory {
  id?: number;
  template_id: number;
  name: string;           // "Entrepreneur Info", "SWOT Analysis"
  description?: string;
  order: number;
  questions: IMentorshipQuestion[];
}

interface IMentorshipQuestion {
  id?: number;
  category_id: number;
  key: string;           // "business_name", "sales_ability"
  label: string;         // "Business Name", "Sales Ability (1-10)"
  type: 'text' | 'number' | 'dropdown' | 'textarea' | 'date' | 'boolean' | 'list' | 'task';
  required: boolean;
  placeholder?: string;
  validation?: any;
  options?: string[];    // For dropdown/multi-select
  items?: string[];      // For list type
}

interface IMentorshipSession {
  id?: number;
  company_id: number;
  template_id: number;
  session_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'reviewed';
  completion_percentage?: number;
  notes?: string;
  responses?: IMentorshipResponse[];
}

interface IMentorshipResponse {
  id?: number;
  session_id: number;
  question_id: number;
  question_key: string;
  response_value: any;    // JSON storage for any response type
  response_text?: string;
}
```

---

## 🎯 **6. ANGULAR COMPONENT LAYER**

### **Core Components:**

| Component | Service Used | Purpose |
|-----------|--------------|---------|
| `mentorship-session-manager.component.ts` | `MentorshipService` | Complete workflow: Company search → Template selection → Form execution |
| `template-manager.component.ts` | `MentorshipService` | Template creation and editing |
| `mentorship.component.ts` | Router service | Navigation shell with child routes |

### **Component → Service → API Flow:**

**Example: Session Manager Complete Workflow**
```typescript
// 1. COMPANY SEARCH
searchCompanies() 
→ mentorshipService.searchCompanies(term)
→ GET /api/companies/list.php?search={term}
→ Company[] results displayed

// 2. TEMPLATE LOADING  
loadTemplates()
→ mentorshipService.getTemplates()
→ GET /api/mentorship/templates.php
→ IMentorshipTemplate[] displayed as cards

// 3. SESSION CREATION
startSession()
→ mentorshipService.createSession(sessionData)  
→ POST /api/mentorship/sessions.php
→ Session created, form built dynamically

// 4. FORM BUILDING
buildSessionForm()
→ Uses selectedTemplate.categories[].questions[]
→ Creates FormControl for each question.key
→ Applies validation rules from question.validation

// 5. RESPONSE SAVING
saveSession()
→ mentorshipService.saveSessionResponses(sessionId, formData)
→ POST /api/mentorship/sessions.php?action=save_responses
→ Saves responses as JSON in mentorship_responses table
```

---

## 🔄 **7. COMPLETE DATA FLOW EXAMPLE**

### **Excel to Digital Form Execution:**

**Step 1: Template Creation (Admin)**
```
Admin creates "Baseline – Entrepreneur Information" template:
1. Component: template-manager.component.ts
2. Service: mentorshipService.createTemplate()
3. API: POST /api/mentorship/templates.php
4. PHP: MentorshipTemplate::create()
5. Database: INSERT into mentorship_templates, mentorship_categories, mentorship_questions
```

**Step 2: Session Execution (Mentorship)**
```
Mentor executes session with company:
1. Component: mentorship-session-manager.component.ts
2. Service: mentorshipService.searchCompanies() → mentorshipService.createSession()
3. API: GET /api/companies/list.php → POST /api/mentorship/sessions.php  
4. PHP: Company::search() → MentorshipSession::create()
5. Database: SELECT from companies → INSERT into mentorship_sessions
```

**Step 3: Response Collection**
```
User fills form and saves responses:
1. Component: Dynamic form built from template structure
2. Service: mentorshipService.saveSessionResponses()
3. API: POST /api/mentorship/sessions.php?action=save_responses
4. PHP: MentorshipResponse::saveMultiple()
5. Database: INSERT/UPDATE mentorship_responses with JSON values
```

**Step 4: Task Generation (Automatic)**
```
System triggers tasks based on responses:
1. PHP: MentorshipResponse triggers check mentorship_task_triggers
2. Database: INSERT into mentorship_triggered_tasks based on trigger conditions
3. Example: If "VAT Compliance" = "Non-Compliant" → Create "VAT Assistance" task
```

---

## 🔧 **8. KEY INTEGRATION POINTS**

### **Critical Configurations:**

**API Base URL Configuration:**
```typescript
// src/services/service.ts
export const Constants = {
    ApiBase: 'http://localhost:8080/api'  // Docker PHP container
}

// Service usage
private apiUrl = `${Constants.ApiBase}/mentorship`;
```

**Database Connection:**
```php
// rbtac-server/config/Database.php
class Database {
    private $host = "mysql";        // Docker MySQL container
    private $db_name = "docker";
    private $username = "docker"; 
    private $password = "docker";
}
```

**Router Integration:**
```typescript
// app.routes.ts - Child routes for mentorship
{
  path: 'mentorship',
  component: MentorshipComponent,
  children: [
    { path: 'templates', component: TemplateManagerComponent },
    { path: 'sessions', component: MentorshipSessionManagerComponent },
    { path: 'analytics', component: AnalyticsComponent }
  ]
}
```

---

## ✅ **9. VALIDATION & ERROR HANDLING**

### **Multi-Layer Validation:**

**Frontend (TypeScript):**
```typescript
// FormBuilder validation
const validators = question.required ? [Validators.required] : [];
if (question.validation?.min) validators.push(Validators.min(question.validation.min));
formControls[question.key] = ['', validators];
```

**Backend (PHP):**
```php
// API endpoint validation
if (!isset($data['company_id']) || !isset($data['template_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}
```

**Database (MySQL):**
```sql
-- Constraints and foreign keys
FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
FOREIGN KEY (template_id) REFERENCES mentorship_templates(id) ON DELETE CASCADE
```

---

## 🎯 **CONCLUSION**

The mentorship system implements a **complete full-stack architecture** with:

✅ **8 Database Tables** with proper relationships and JSON storage
✅ **6 PHP Model Classes** handling all CRUD operations  
✅ **7 API Endpoints** providing RESTful interfaces
✅ **2 TypeScript Services** with comprehensive method coverage
✅ **10+ TypeScript Interfaces** ensuring type safety
✅ **3+ Angular Components** providing complete user workflows

**Key Strengths:**
- **Separation of Concerns**: Each layer has clear responsibilities
- **Type Safety**: TypeScript interfaces match database structure  
- **Scalability**: New templates can be added without code changes
- **Flexibility**: JSON response storage supports any question type
- **Automation**: Task triggers create follow-up actions automatically
- **Analytics**: Built-in progress tracking and reporting

The system successfully converts Excel-based mentorship forms into a **dynamic, digital workflow** while maintaining the original structure and adding automation capabilities.
