# RBTAC Standalone - Development Workflow & Architecture

## 🎯 Project Overview
**RBTAC Standalone** is a comprehensive business incubation and acceleration management platform built with Angular 19 and PHP backend, featuring beautiful Tailwind CSS dark theme UI.

## 🛠️ Technology Stack

### Frontend
- **Angular 19.2.0** - Standalone components architecture
- **Tailwind CSS** - Dark theme with gradient designs
- **FontAwesome Icons** - Complete icon library
- **TypeScript** - Type-safe development

### Backend  
- **PHP 8.2** - RESTful API services
- **MySQL 8.0** - Database with enhanced schema
- **Podman/Docker** - Containerized development environment

### Development Environment
- **Podman** - Container orchestration (instead of Docker)
- **VS Code** - Primary IDE with extensions
- **PowerShell** - Windows terminal environment

## 🐳 Container Setup & Testing Workflow

### Container Services
```yaml
# docker-compose.yml services:
- php:8080        # Main PHP API container
- mysql:3306      # MySQL database container  
- phpmyadmin:8081 # Database management interface
```

### Starting Containers
```powershell
# Check container status
podman ps

# Start all services (if needed)
cd "c:\dev\projects\angular\rbtac-standalone\rbtac-server"
podman-compose up -d
```

### API Testing Workflow
**Always use Podman containers for API testing - DO NOT use local PHP**

```powershell
# 1. Check API endpoint status
Invoke-RestMethod -Uri "http://localhost:8080/api/endpoint/" -Method GET

# 2. POST requests with JSON data
Invoke-RestMethod -Uri "http://localhost:8080/api/endpoint/" -Method POST -Body '{"key":"value"}' -ContentType "application/json"

# 3. Database enhancement example
Invoke-RestMethod -Uri "http://localhost:8080/api/database-enhancement/?action=status" -Method GET
Invoke-RestMethod -Uri "http://localhost:8080/api/database-enhancement/" -Method POST -Body '{"action":"enhance"}' -ContentType "application/json"
```

### API Path Structure
**Critical**: All API files must use correct relative paths:
```php
// ✅ Correct path structure
require_once '../../config/Database.php';
require_once '../../config/headers.php';

// ❌ Wrong path
require_once '../config/Database.php';
```

### Database Connection Pattern
```php
// Standard database connection in APIs
public function __construct() {
    $database = new Database();
    $this->conn = $database->connect(); // Use connect(), not getConnection()
}
```

## 🎨 UI Design System

### Color Palette
```css
/* Primary gradients */
background: from-purple-900 via-blue-900 to-indigo-900
background: from-blue-800 to-blue-900
background: from-green-800 to-green-900

/* Stage colors from database */
#EF4444 - Red (Application Review)
#F97316 - Orange (Due Diligence)  
#EAB308 - Yellow (Program Entry)
#3B82F6 - Blue (Development)
#10B981 - Green (Graduation)
```

### Component Structure
```html
<!-- Standard dark theme container -->
<div class="min-h-screen bg-gray-900 text-white">
  
  <!-- Gradient header -->
  <div class="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-8 shadow-2xl">
    <!-- Header content -->
  </div>
  
  <!-- Main content -->
  <div class="container mx-auto px-6 py-8">
    <!-- Content cards with hover effects -->
    <div class="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <!-- Card content -->
    </div>
  </div>
</div>
```

### Button Styles
```html
<!-- Primary action buttons -->
<button class="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
  <i class="fas fa-icon mr-2"></i>Button Text
</button>

<!-- Status badges -->
<span class="bg-red-600 text-white px-2 py-1 rounded-full text-xs">Status</span>
```

## 📊 Database Architecture

### Enhanced Schema Features
- **JSON fields** for flexible data (requirements, criteria, stage_data)
- **ENUM fields** for controlled values (priority_level, status, transition_type)
- **Performance indexes** for complex queries
- **Audit trails** via stage_transitions table

### Key Tables
```sql
program_stages          # Enhanced with UX fields (colors, durations, milestones)
company_program_stages  # Enhanced tracking (progress, priorities, notes)
stage_templates        # Reusable stage configurations
stage_transitions      # Complete audit trail
stage_analytics       # Performance metrics
```

### Testing Database Changes
1. Create SQL in `enhanced-stages-schema.sql`
2. Use database enhancement API to apply changes
3. Verify via API status endpoint
4. Test new fields in program stages API

## 🚀 Angular Development

### Component Architecture
- **Standalone components** (no modules)
- **TypeScript interfaces** in `src/models/schema.ts`
- **Service layer** for API communication
- **Reactive forms** for data entry

### Service Pattern
```typescript
// Standard service structure
@Injectable({
  providedIn: 'root'
})
export class ServiceName {
  private apiUrl = 'http://localhost:8080/api/endpoint';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.apiUrl}/list.php`);
  }
}
```

### Interface Updates
When adding database fields, update TypeScript interfaces:
```typescript
export interface IProgramStage {
  // Core fields
  id?: number;
  program_id: number;
  title: string;
  
  // Enhanced UX fields
  expected_duration_days?: number;
  stage_color?: string;
  is_milestone?: boolean;
  approval_required?: boolean;
}
```

## 🔧 Development Workflow

### 1. Frontend Development
```powershell
# Start Angular dev server
cd "c:\dev\projects\angular\rbtac-standalone"
npm start
# Usually runs on http://localhost:4200 or auto-assigned port
```

### 2. API Development
- Create/modify API files in `rbtac-server/api/`
- Test immediately via Podman containers
- Use PowerShell Invoke-RestMethod for testing

### 3. Database Changes
- Write SQL in enhancement files
- Apply via database enhancement API
- Update TypeScript interfaces
- Test API responses

### 4. UI Enhancement
- Use Tailwind classes for consistent styling
- FontAwesome icons: `<i class="fas fa-icon-name"></i>`
- Maintain dark theme consistency
- Add hover animations and transitions

## 📁 Project Structure
```
rbtac-standalone/
├── src/app/                    # Angular application
│   ├── admin-components/       # Admin interface components
│   ├── models/                 # TypeScript interfaces
│   └── services/              # API service layer
├── rbtac-server/              # PHP backend
│   ├── api/                   # REST API endpoints
│   ├── config/                # Database configuration
│   ├── models/                # PHP data models
│   └── enhanced-stages-schema.sql # Database enhancements
└── docker-compose.yml         # Container configuration
```

## 🎯 Best Practices

### API Development
- Always test via containers, not local PHP
- Use correct relative paths in require statements
- Follow consistent JSON response structure
- Include error handling and validation

### Frontend Development  
- Use trackBy functions for ngFor performance
- Implement loading and error states
- Maintain type safety with interfaces
- Use reactive patterns for data flow

### Database Design
- Use JSON for flexible data structures
- Add performance indexes for complex queries
- Include audit trails for important operations
- Use ENUM for controlled vocabularies

### UI/UX Design
- Maintain dark theme consistency
- Use gradients and shadows for depth
- Include hover animations for interactivity  
- Ensure responsive design across screen sizes

## 🔍 Debugging & Testing

### Common Issues
1. **Path errors in APIs**: Check relative paths in require statements
2. **Database connection issues**: Verify container status and connection method
3. **CORS issues**: Ensure headers.php is included
4. **TypeScript errors**: Update interfaces when adding database fields

### Testing Checklist
- [ ] Containers running and accessible
- [ ] API endpoints responding correctly
- [ ] Database changes applied successfully
- [ ] Frontend loading without errors
- [ ] UI responsive and interactive
- [ ] Data flow working end-to-end

---

**Remember**: This project uses **Podman containers** for all backend testing. Always verify container status before debugging issues!
