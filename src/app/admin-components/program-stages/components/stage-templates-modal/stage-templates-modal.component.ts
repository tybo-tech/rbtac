import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProgram, IProgramStage } from '../../../../../models/schema';

interface StageTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  stages: Partial<IProgramStage>[];
  icon: string;
  color: string;
}

@Component({
  selector: 'app-stage-templates-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Stage Templates Modal -->
    <div *ngIf="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <i class="fas fa-layer-group mr-3 text-green-400"></i>
            Stage Templates
          </h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div class="p-6">
          <!-- Filter Categories -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button *ngFor="let category of categories"
                    (click)="selectedCategory = category"
                    [class]="selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                    class="px-4 py-2 rounded-lg font-medium transition-colors">
              {{ category }}
            </button>
          </div>

          <!-- Templates Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let template of getFilteredTemplates()"
                 class="bg-gray-700 rounded-xl p-6 hover:bg-gray-650 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500"
                 (click)="selectTemplate(template)">

              <!-- Template Header -->
              <div class="flex items-center mb-4">
                <div class="rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg mr-4"
                     [style.background-color]="template.color">
                  <i class="fas fa-{{ template.icon }}"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-white text-lg">{{ template.name }}</h4>
                  <p class="text-gray-400 text-sm">{{ template.category }}</p>
                </div>
              </div>

              <!-- Template Description -->
              <p class="text-gray-300 text-sm mb-4 line-clamp-3">{{ template.description }}</p>

              <!-- Stage Count -->
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-sm">{{ template.stages.length }} stages</span>
                <button class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Use Template
                </button>
              </div>

              <!-- Stage Preview -->
              <div class="mt-4 flex flex-wrap gap-1">
                <span *ngFor="let stage of template.stages.slice(0, 3)"
                      class="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                  {{ stage.title }}
                </span>
                <span *ngIf="template.stages.length > 3"
                      class="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                  +{{ template.stages.length - 3 }} more
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="getFilteredTemplates().length === 0" class="text-center py-12">
            <i class="fas fa-layer-group text-gray-500 text-4xl mb-4"></i>
            <p class="text-gray-400 text-lg">No templates found for "{{ selectedCategory }}"</p>
            <p class="text-gray-500 text-sm">Try selecting a different category</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <div *ngIf="selectedTemplate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60" (click)="selectedTemplate = null">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <div class="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-3"
                 [style.background-color]="selectedTemplate.color">
              <i class="fas fa-{{ selectedTemplate.icon }} text-sm"></i>
            </div>
            {{ selectedTemplate.name }}
          </h3>
          <button (click)="selectedTemplate = null" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div class="p-6">
          <p class="text-gray-300 mb-6">{{ selectedTemplate.description }}</p>

          <!-- Stages Preview -->
          <h4 class="text-lg font-semibold text-white mb-4">Stages ({{ selectedTemplate.stages.length }})</h4>
          <div class="space-y-3 mb-6">
            <div *ngFor="let stage of selectedTemplate.stages; let i = index"
                 class="flex items-center p-4 bg-gray-700 rounded-lg">
              <div class="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4"
                   [style.background-color]="stage.stage_color">
                <i class="fas fa-{{ stage.stage_icon }} text-xs"></i>
              </div>
              <div class="flex-1">
                <h5 class="font-medium text-white">{{ i + 1 }}. {{ stage.title }}</h5>
                <p class="text-gray-400 text-sm">{{ stage.description }}</p>
              </div>
              <div class="text-gray-400 text-sm">
                <span *ngIf="stage.expected_duration_days">{{ stage.expected_duration_days }}d</span>
                <span *ngIf="stage.is_milestone" class="ml-2 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">Milestone</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <button (click)="applyTemplate(selectedTemplate)"
                    class="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <i class="fas fa-check mr-2"></i>Apply Template
            </button>
            <button (click)="selectedTemplate = null"
                    class="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StageTemplatesModalComponent {
  @Input() visible: boolean = false;
  @Input() program: IProgram | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() templateApplied = new EventEmitter<IProgramStage[]>();

  selectedCategory = 'All';
  selectedTemplate: StageTemplate | null = null;

  categories = ['All', 'Business Development', 'Technology', 'Startup Accelerator', 'Education', 'Manufacturing'];

  templates: StageTemplate[] = [
    {
      id: 'startup-accelerator',
      name: 'Startup Accelerator Program',
      description: 'Complete startup acceleration program with key milestones for early-stage companies.',
      category: 'Startup Accelerator',
      icon: 'rocket',
      color: '#EC4899',
      stages: [
        { title: 'Application Review', description: 'Initial application screening and evaluation', stage_color: '#3B82F6', stage_icon: 'search', expected_duration_days: 14, stage_order: 1 },
        { title: 'Due Diligence', description: 'Comprehensive business and financial review', stage_color: '#10B981', stage_icon: 'clipboard-check', expected_duration_days: 21, stage_order: 2 },
        { title: 'Mentor Matching', description: 'Pairing with industry mentors and advisors', stage_color: '#F59E0B', stage_icon: 'handshake', expected_duration_days: 7, stage_order: 3 },
        { title: 'Program Kickoff', description: 'Official program start and orientation', stage_color: '#8B5CF6', stage_icon: 'play-circle', expected_duration_days: 3, is_milestone: true, stage_order: 4 },
        { title: 'MVP Development', description: 'Building minimum viable product', stage_color: '#06B6D4', stage_icon: 'code', expected_duration_days: 60, stage_order: 5 },
        { title: 'Market Validation', description: 'Testing product-market fit', stage_color: '#84CC16', stage_icon: 'chart-line', expected_duration_days: 30, stage_order: 6 },
        { title: 'Demo Day Prep', description: 'Preparing for investor presentation', stage_color: '#EF4444', stage_icon: 'presentation', expected_duration_days: 14, stage_order: 7 },
        { title: 'Demo Day', description: 'Final investor pitch presentation', stage_color: '#F97316', stage_icon: 'trophy', expected_duration_days: 1, is_milestone: true, stage_order: 8 },
        { title: 'Graduation', description: 'Program completion and continued support', stage_color: '#22C55E', stage_icon: 'graduation-cap', expected_duration_days: 7, is_milestone: true, stage_order: 9 }
      ]
    },
    {
      id: 'business-development',
      name: 'Business Development Pipeline',
      description: 'Standard business development process for lead qualification and conversion.',
      category: 'Business Development',
      icon: 'building',
      color: '#10B981',
      stages: [
        { title: 'Lead Generation', description: 'Identifying and capturing potential leads', stage_color: '#3B82F6', stage_icon: 'search', expected_duration_days: 7, stage_order: 1 },
        { title: 'Initial Contact', description: 'First outreach and qualification', stage_color: '#8B5CF6', stage_icon: 'phone', expected_duration_days: 3, stage_order: 2 },
        { title: 'Needs Assessment', description: 'Understanding client requirements', stage_color: '#F59E0B', stage_icon: 'clipboard-list', expected_duration_days: 14, stage_order: 3 },
        { title: 'Proposal Development', description: 'Creating tailored business proposal', stage_color: '#06B6D4', stage_icon: 'edit', expected_duration_days: 10, stage_order: 4 },
        { title: 'Negotiation', description: 'Terms and pricing discussions', stage_color: '#EF4444', stage_icon: 'handshake', expected_duration_days: 21, stage_order: 5 },
        { title: 'Contract Signing', description: 'Finalizing legal agreements', stage_color: '#22C55E', stage_icon: 'file-signature', expected_duration_days: 7, is_milestone: true, approval_required: true, stage_order: 6 },
        { title: 'Onboarding', description: 'Client integration and setup', stage_color: '#84CC16', stage_icon: 'user-plus', expected_duration_days: 14, stage_order: 7 }
      ]
    },
    {
      id: 'product-development',
      name: 'Product Development Lifecycle',
      description: 'Complete product development process from concept to launch.',
      category: 'Technology',
      icon: 'cog',
      color: '#8B5CF6',
      stages: [
        { title: 'Concept Development', description: 'Initial product ideation and planning', stage_color: '#3B82F6', stage_icon: 'lightbulb', expected_duration_days: 14, stage_order: 1 },
        { title: 'Requirements Analysis', description: 'Detailed technical and business requirements', stage_color: '#10B981', stage_icon: 'clipboard-list', expected_duration_days: 21, stage_order: 2 },
        { title: 'Design Phase', description: 'UI/UX design and technical architecture', stage_color: '#F59E0B', stage_icon: 'palette', expected_duration_days: 30, stage_order: 3 },
        { title: 'Prototype Development', description: 'Building initial working prototype', stage_color: '#06B6D4', stage_icon: 'wrench', expected_duration_days: 45, stage_order: 4 },
        { title: 'Testing & QA', description: 'Quality assurance and bug fixing', stage_color: '#EF4444', stage_icon: 'bug', expected_duration_days: 21, stage_order: 5 },
        { title: 'Beta Release', description: 'Limited release for feedback', stage_color: '#8B5CF6', stage_icon: 'flask', expected_duration_days: 30, is_milestone: true, stage_order: 6 },
        { title: 'Production Release', description: 'Full product launch', stage_color: '#22C55E', stage_icon: 'rocket', expected_duration_days: 7, is_milestone: true, stage_order: 7 }
      ]
    },
    {
      id: 'manufacturing-setup',
      name: 'Manufacturing Setup Process',
      description: 'Setting up manufacturing operations for new production lines.',
      category: 'Manufacturing',
      icon: 'industry',
      color: '#F59E0B',
      stages: [
        { title: 'Feasibility Study', description: 'Assessing manufacturing feasibility', stage_color: '#3B82F6', stage_icon: 'search', expected_duration_days: 30, stage_order: 1 },
        { title: 'Site Selection', description: 'Choosing optimal manufacturing location', stage_color: '#10B981', stage_icon: 'map-marker-alt', expected_duration_days: 21, stage_order: 2 },
        { title: 'Equipment Procurement', description: 'Purchasing necessary machinery', stage_color: '#F59E0B', stage_icon: 'shopping-cart', expected_duration_days: 60, stage_order: 3 },
        { title: 'Facility Setup', description: 'Setting up physical infrastructure', stage_color: '#06B6D4', stage_icon: 'hammer', expected_duration_days: 90, stage_order: 4 },
        { title: 'Staff Training', description: 'Training production workforce', stage_color: '#8B5CF6', stage_icon: 'graduation-cap', expected_duration_days: 30, stage_order: 5 },
        { title: 'Quality Certification', description: 'Obtaining required certifications', stage_color: '#EF4444', stage_icon: 'certificate', expected_duration_days: 45, approval_required: true, stage_order: 6 },
        { title: 'Production Start', description: 'Beginning full-scale production', stage_color: '#22C55E', stage_icon: 'play', expected_duration_days: 7, is_milestone: true, stage_order: 7 }
      ]
    },
    {
      id: 'education-program',
      name: 'Educational Program Delivery',
      description: 'Complete educational program from enrollment to certification.',
      category: 'Education',
      icon: 'graduation-cap',
      color: '#06B6D4',
      stages: [
        { title: 'Student Enrollment', description: 'Registration and application process', stage_color: '#3B82F6', stage_icon: 'user-plus', expected_duration_days: 14, stage_order: 1 },
        { title: 'Prerequisites Check', description: 'Verifying student qualifications', stage_color: '#10B981', stage_icon: 'clipboard-check', expected_duration_days: 7, stage_order: 2 },
        { title: 'Course Delivery', description: 'Active learning and instruction phase', stage_color: '#F59E0B', stage_icon: 'book', expected_duration_days: 90, stage_order: 3 },
        { title: 'Mid-term Assessment', description: 'Progress evaluation checkpoint', stage_color: '#8B5CF6', stage_icon: 'tasks', expected_duration_days: 3, is_milestone: true, stage_order: 4 },
        { title: 'Final Project', description: 'Capstone project completion', stage_color: '#06B6D4', stage_icon: 'project-diagram', expected_duration_days: 30, stage_order: 5 },
        { title: 'Final Examination', description: 'Comprehensive final assessment', stage_color: '#EF4444', stage_icon: 'file-alt', expected_duration_days: 1, stage_order: 6 },
        { title: 'Certification', description: 'Award of completion certificate', stage_color: '#22C55E', stage_icon: 'award', expected_duration_days: 7, is_milestone: true, stage_order: 7 }
      ]
    }
  ];

  getFilteredTemplates(): StageTemplate[] {
    if (this.selectedCategory === 'All') {
      return this.templates;
    }
    return this.templates.filter(template => template.category === this.selectedCategory);
  }

  selectTemplate(template: StageTemplate) {
    this.selectedTemplate = template;
  }

  applyTemplate(template: StageTemplate) {
    if (!this.program) return;

    // Add program_id to each stage
    const stages: IProgramStage[] = template.stages.map(stage => ({
      ...stage,
      program_id: this.program!.id!,
      title: stage.title!,
      status: 'active'
    } as IProgramStage));

    this.templateApplied.emit(stages);
    this.selectedTemplate = null;
    this.close.emit();
  }
}
