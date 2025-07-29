# Mentorship Module Documentation

## Overview
The Mentorship Module provides a comprehensive Excel-like interface for managing mentorship workflows in the business incubation platform. It allows incubation staff and mentors to create templates, manage sessions, track tasks, and analyze progress.

## Architecture

### Backend (PHP)
- **Database Schema**: 6 normalized tables with foreign key relationships
- **API Endpoints**: 20+ RESTful endpoints across 5 modules
- **Models**: Complete CRUD operations with validation and business logic

### Frontend (Angular)
- **Component Architecture**: Standalone components with signals for reactivity
- **Service Layer**: Comprehensive HTTP service with typed responses
- **UI/UX**: Excel-inspired tabbed interface with real-time data

## Features

### 1. Template Management
- Create and manage mentorship templates
- Hierarchical category organization
- Question configuration with multiple types (text, number, boolean, date, dropdown)
- Search and filtering capabilities
- Bulk operations support

### 2. Session Management  
- Schedule and track mentorship sessions
- Link sessions to companies and templates
- Progress tracking with percentage completion
- Status management (scheduled, in_progress, completed)
- Session analytics and reporting

### 3. Task Management
- Automatic task creation from question triggers
- Manual task creation and assignment
- Priority levels (low, medium, high)
- Status tracking (pending, in_progress, done)
- Overdue task identification
- Bulk status updates

### 4. Analytics Dashboard
- Real-time statistics and metrics
- Session completion tracking
- Task progress monitoring
- Performance analytics
- Time-based filtering

## Technical Stack

### Backend Technologies
```
- PHP 8+ with PDO
- MySQL 8+
- RESTful API architecture
- JSON response format
- Comprehensive error handling
```

### Frontend Technologies
```
- Angular 19.2.0
- TypeScript 5.6+
- RxJS for reactive programming
- Angular Signals for state management
- SCSS for styling
```

## API Endpoints

### Templates
```
GET    /mentorship/templates/read.php
POST   /mentorship/templates/create.php
PUT    /mentorship/templates/update.php
```

### Categories
```
GET    /mentorship/categories/read.php
POST   /mentorship/categories/create.php
PUT    /mentorship/categories/update.php
POST   /mentorship/categories/reorder.php
```

### Questions
```
GET    /mentorship/questions/read.php
POST   /mentorship/questions/create.php
PUT    /mentorship/questions/update.php
POST   /mentorship/questions/reorder.php
```

### Sessions
```
GET    /mentorship/sessions/read.php
POST   /mentorship/sessions/create.php
PUT    /mentorship/sessions/update.php
```

### Responses
```
GET    /mentorship/responses/read.php
POST   /mentorship/responses/upsert.php
POST   /mentorship/responses/save-multiple.php
```

### Tasks
```
GET    /mentorship/tasks/read.php
POST   /mentorship/tasks/create.php
PUT    /mentorship/tasks/update.php
PUT    /mentorship/tasks/update-status.php
POST   /mentorship/tasks/create-from-trigger.php
```

## Component Structure

```
src/app/admin-components/mentorship/
├── mentorship.component.ts          # Main component with tabs
├── mentorship.component.scss        # Excel-inspired styles
├── mentorship.component.spec.ts     # Unit tests
└── components/                      # Sub-components (future)
    ├── template-manager/
    ├── session-manager/
    ├── task-manager/
    └── analytics-dashboard/
```

## Data Models

### TypeScript Interfaces
```typescript
interface IMentorshipTemplate {
  id?: number;
  title: string;
  description?: string;
  category?: string;
  is_active?: boolean;
  // ... additional properties
}

interface IMentorshipSession {
  id?: number;
  company_id: number;
  template_id: number;
  status?: 'scheduled' | 'in_progress' | 'completed';
  // ... additional properties
}

interface IMentorshipTask {
  id?: number;
  title: string;
  status: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  // ... additional properties
}
```

## Usage Examples

### Creating a Template
```typescript
const template: Partial<IMentorshipTemplate> = {
  title: 'Business Model Validation',
  description: 'Template for validating business models',
  category: 'validation'
};

this.mentorshipService.createTemplate(template).subscribe(response => {
  if (response.success) {
    console.log('Template created:', response.data);
  }
});
```

### Starting a Session
```typescript
const session: Partial<IMentorshipSession> = {
  company_id: 1,
  template_id: 1,
  session_date: new Date().toISOString(),
  status: 'scheduled'
};

this.mentorshipService.createSession(session).subscribe(response => {
  if (response.success) {
    console.log('Session scheduled:', response.data);
  }
});
```

### Updating Task Status
```typescript
this.mentorshipService.updateTaskStatus(taskId, 'in_progress').subscribe(response => {
  if (response.success) {
    console.log('Task status updated');
  }
});
```

## Installation & Setup

### Prerequisites
- Angular 19+ workspace
- PHP 8+ server with MySQL
- Node.js 18+ for Angular development

### Backend Setup
1. Copy PHP files to server directory
2. Import database schema from `enhanced-stages-schema.sql`
3. Configure database connection in `config/Database.php`
4. Set proper CORS headers for Angular integration

### Frontend Integration
1. Import MentorshipComponent in your routing module
2. Add navigation link to admin menu
3. Ensure HttpClientModule is imported
4. Configure API base URL in MentorshipService

### Route Configuration
```typescript
{
  path: 'mentorship',
  component: MentorshipComponent,
}
```

## Performance Considerations

### Database Optimization
- Indexed foreign keys for fast joins
- Pagination support for large datasets
- Query optimization for statistics

### Frontend Optimization
- Angular Signals for efficient reactivity
- OnPush change detection strategy
- Lazy loading for sub-components
- Virtual scrolling for large lists

## Future Enhancements

### Planned Features
- Drag-and-drop question reordering
- Advanced filtering and search
- Export to Excel/PDF functionality
- Email notification system
- Mobile-responsive design improvements

### Technical Improvements
- GraphQL API option
- Real-time updates with WebSockets
- Offline capability with service workers
- Advanced caching strategies

## Testing

### Unit Tests
- Component tests with Angular Testing Library
- Service tests with HttpClientTestingModule
- Model validation tests

### Integration Tests
- API endpoint testing
- Database operation testing
- End-to-end workflow testing

## Security Considerations

### Authentication & Authorization
- User role validation
- Session-based security
- API endpoint protection
- Input sanitization

### Data Protection
- SQL injection prevention
- XSS protection
- CSRF token validation
- Secure data transmission

## Support & Maintenance

### Monitoring
- Error logging and tracking
- Performance monitoring
- User activity analytics
- System health checks

### Deployment
- Environment configuration
- Database migration scripts
- Build optimization
- Production deployment guide

---

For additional support or feature requests, please refer to the project documentation or contact the development team.
