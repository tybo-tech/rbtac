import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProgram, IProgramStage } from '../../../../../models/schema';

@Component({
  selector: 'app-create-stage-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Create Stage Modal -->
    <div *ngIf="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <i class="fas fa-plus-circle mr-3 text-blue-400"></i>
            Create New Stage
          </h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <form (ngSubmit)="onSubmit()" #stageForm="ngForm" class="p-6">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Stage Title *</label>
                <input type="text" 
                       [(ngModel)]="stageData.title" 
                       name="title"
                       required
                       maxlength="100"
                       class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Enter stage title">
              </div>

              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Stage Order</label>
                <input type="number" 
                       [(ngModel)]="stageData.stage_order" 
                       name="stage_order"
                       min="1"
                       class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Auto-assigned if empty">
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea [(ngModel)]="stageData.description" 
                        name="description"
                        rows="3"
                        maxlength="500"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Describe what happens in this stage..."></textarea>
            </div>

            <!-- Visual Customization -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Stage Color</label>
                <div class="flex space-x-2">
                  <input type="color" 
                         [(ngModel)]="stageData.stage_color" 
                         name="stage_color"
                         class="w-12 h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer">
                  <input type="text" 
                         [(ngModel)]="stageData.stage_color" 
                         name="stage_color_text"
                         pattern="^#[0-9A-Fa-f]{6}$"
                         class="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="#3B82F6">
                </div>
              </div>

              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">FontAwesome Icon</label>
                <select [(ngModel)]="stageData.stage_icon" 
                        name="stage_icon"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="clipboard-list">📋 clipboard-list (Default)</option>
                  <option value="play-circle">▶️ play-circle (Start)</option>
                  <option value="search">🔍 search (Review)</option>
                  <option value="edit">✏️ edit (Edit/Modify)</option>
                  <option value="check-circle">✅ check-circle (Approval)</option>
                  <option value="code">💻 code (Development)</option>
                  <option value="rocket">🚀 rocket (Launch)</option>
                  <option value="flag-checkered">🏁 flag-checkered (Finish)</option>
                  <option value="star">⭐ star (Milestone)</option>
                  <option value="cog">⚙️ cog (Configuration)</option>
                  <option value="graduation-cap">🎓 graduation-cap (Training)</option>
                  <option value="handshake">🤝 handshake (Agreement)</option>
                </select>
              </div>
            </div>

            <!-- Duration Settings -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Expected Duration (days)</label>
                <input type="number" 
                       [(ngModel)]="stageData.expected_duration_days" 
                       name="expected_duration_days"
                       min="1"
                       max="365"
                       class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="e.g., 30">
              </div>

              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Maximum Duration (days)</label>
                <input type="number" 
                       [(ngModel)]="stageData.max_duration_days" 
                       name="max_duration_days"
                       min="1"
                       max="365"
                       class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="e.g., 60">
              </div>
            </div>

            <!-- Stage Options -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white border-b border-gray-600 pb-2">Stage Options</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors">
                  <input type="checkbox" 
                         [(ngModel)]="stageData.is_milestone" 
                         name="is_milestone"
                         class="text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-700">
                  <div>
                    <div class="text-white font-medium">Milestone Stage</div>
                    <div class="text-gray-400 text-sm">Mark as a significant milestone</div>
                  </div>
                </label>

                <label class="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors">
                  <input type="checkbox" 
                         [(ngModel)]="stageData.approval_required" 
                         name="approval_required"
                         class="text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-700">
                  <div>
                    <div class="text-white font-medium">Requires Approval</div>
                    <div class="text-gray-400 text-sm">Manual approval needed to advance</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Preview -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-white font-medium mb-3">Stage Preview</h4>
              <div class="flex items-center space-x-3 p-3 bg-gray-600 rounded-lg">
                <div class="rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                     [style.background-color]="stageData.stage_color || '#3B82F6'">
                  <i class="fas fa-{{ stageData.stage_icon || 'clipboard-list' }} text-sm"></i>
                </div>
                <div>
                  <h5 class="font-semibold text-white">{{ stageData.title || 'New Stage' }}</h5>
                  <p class="text-gray-300 text-sm">{{ stageData.description || 'Stage description will appear here' }}</p>
                </div>
                <div class="flex space-x-1 ml-auto">
                  <span *ngIf="stageData.is_milestone" class="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">Milestone</span>
                  <span *ngIf="stageData.approval_required" class="bg-red-600 text-white px-2 py-1 rounded-full text-xs">Approval</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 mt-8 pt-6 border-t border-gray-700">
            <button type="submit" 
                    [disabled]="!stageForm.form.valid || isSubmitting"
                    class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center">
              <i class="fas fa-save mr-2" *ngIf="!isSubmitting"></i>
              <i class="fas fa-spinner fa-spin mr-2" *ngIf="isSubmitting"></i>
              {{ isSubmitting ? 'Creating...' : 'Create Stage' }}
            </button>

            <button type="button" 
                    (click)="close.emit()"
                    class="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Cancel
            </button>

            <button type="button" 
                    (click)="resetForm()"
                    class="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <i class="fas fa-undo mr-2"></i>Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class CreateStageModalComponent {
  @Input() visible: boolean = false;
  @Input() program: IProgram | null = null;
  @Input() existingStages: IProgramStage[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() stageCreated = new EventEmitter<IProgramStage>();

  isSubmitting = false;

  stageData: Partial<IProgramStage> = {
    title: '',
    description: '',
    stage_color: '#3B82F6',
    stage_icon: 'clipboard-list',
    expected_duration_days: 30,
    max_duration_days: 60,
    is_milestone: false,
    approval_required: false,
    status: 'active'
  };

  onSubmit() {
    if (!this.program) return;

    this.isSubmitting = true;

    // Auto-assign stage order if not provided
    if (!this.stageData.stage_order) {
      this.stageData.stage_order = Math.max(...this.existingStages.map(s => s.stage_order || 0), 0) + 1;
    }

    // Set program ID
    this.stageData.program_id = this.program.id;

    // Emit the new stage data
    this.stageCreated.emit(this.stageData as IProgramStage);
  }

  resetForm() {
    this.stageData = {
      title: '',
      description: '',
      stage_color: '#3B82F6',
      stage_icon: 'clipboard-list',
      expected_duration_days: 30,
      max_duration_days: 60,
      is_milestone: false,
      approval_required: false,
      status: 'active'
    };
    this.isSubmitting = false;
  }

  ngOnChanges() {
    if (!this.visible) {
      this.isSubmitting = false;
    }
  }
}
