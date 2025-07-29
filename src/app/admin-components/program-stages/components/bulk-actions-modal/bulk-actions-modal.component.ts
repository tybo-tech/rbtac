import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProgramStage, ICompanyStageView } from '../../../../../models/schema';

interface BulkAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiresStageSelection?: boolean;
  requiresConfirmation?: boolean;
}

interface SelectableStage extends IProgramStage {
  selected?: boolean;
}

@Component({
  selector: 'app-bulk-actions-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Bulk Actions Modal -->
    <div *ngIf="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <i class="fas fa-layer-group mr-3 text-purple-400"></i>
            Bulk Actions
          </h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div class="p-6" *ngIf="!selectedAction">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div *ngFor="let action of bulkActions"
                 (click)="selectAction(action)"
                 class="p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-purple-500">

              <div class="flex items-center mb-3">
                <div class="rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg mr-4"
                     [style.background-color]="action.color">
                  <i class="fas fa-{{ action.icon }}"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-white">{{ action.name }}</h4>
                </div>
              </div>

              <p class="text-gray-300 text-sm">{{ action.description }}</p>
            </div>
          </div>
        </div>

        <!-- Action Configuration -->
        <div class="p-6" *ngIf="selectedAction">
          <div class="flex items-center mb-6">
            <button (click)="selectedAction = null" class="text-gray-400 hover:text-white mr-4">
              <i class="fas fa-arrow-left text-xl"></i>
            </button>
            <div class="rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-4"
                 [style.background-color]="selectedAction.color">
              <i class="fas fa-{{ selectedAction.icon }}"></i>
            </div>
            <h4 class="text-xl font-semibold text-white">{{ selectedAction.name }}</h4>
          </div>

          <!-- Stage-specific Actions -->
          <div *ngIf="selectedAction.id === 'advance-all-companies'" class="space-y-6">
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-3">Select Source Stage</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div *ngFor="let stage of stages"
                     (click)="selectedSourceStage = stage"
                     [class]="selectedSourceStage?.id === stage.id ? 'border-blue-500 bg-gray-650' : 'border-gray-600 hover:border-gray-500'"
                     class="p-3 border-2 rounded-lg cursor-pointer transition-all">
                  <div class="flex items-center">
                    <div class="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-3"
                         [style.background-color]="stage.stage_color">
                      <i class="fas fa-{{ stage.stage_icon }} text-xs"></i>
                    </div>
                    <div>
                      <div class="font-medium text-white">{{ stage.title }}</div>
                      <div class="text-gray-400 text-sm">{{ getCompaniesInStage(stage.id!).length }} companies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="selectedSourceStage">
              <label class="block text-gray-300 text-sm font-medium mb-3">Select Target Stage</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div *ngFor="let stage of getAdvancementTargets(selectedSourceStage)"
                     (click)="selectedTargetStage = stage"
                     [class]="selectedTargetStage?.id === stage.id ? 'border-green-500 bg-gray-650' : 'border-gray-600 hover:border-gray-500'"
                     class="p-3 border-2 rounded-lg cursor-pointer transition-all">
                  <div class="flex items-center">
                    <div class="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-3"
                         [style.background-color]="stage.stage_color">
                      <i class="fas fa-{{ stage.stage_icon }} text-xs"></i>
                    </div>
                    <div>
                      <div class="font-medium text-white">{{ stage.title }}</div>
                      <div class="text-gray-400 text-sm">{{ getCompaniesInStage(stage.id!).length }} companies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="selectedSourceStage && selectedTargetStage" class="bg-gray-700 rounded-lg p-4">
              <h5 class="font-medium text-white mb-2">Preview</h5>
              <p class="text-gray-300 text-sm">
                This will advance <strong>{{ getCompaniesInStage(selectedSourceStage.id!).length }} companies</strong>
                from <strong>{{ selectedSourceStage.title }}</strong> to <strong>{{ selectedTargetStage.title }}</strong>.
              </p>
            </div>
          </div>

          <!-- Reorder Stages -->
          <div *ngIf="selectedAction.id === 'reorder-stages'" class="space-y-4">
            <p class="text-gray-300 mb-4">Drag and drop stages to reorder them:</p>
            <div class="space-y-2">
              <div *ngFor="let stage of stageOrder; let i = index"
                   class="flex items-center p-3 bg-gray-700 rounded-lg">
                <div class="cursor-move mr-3 text-gray-400">
                  <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-3"
                     [style.background-color]="stage.stage_color">
                  <i class="fas fa-{{ stage.stage_icon }} text-xs"></i>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-white">{{ i + 1 }}. {{ stage.title }}</div>
                </div>
                <div class="flex space-x-2">
                  <button (click)="moveStageUp(i)" [disabled]="i === 0"
                          class="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fas fa-chevron-up"></i>
                  </button>
                  <button (click)="moveStageDown(i)" [disabled]="i === stageOrder.length - 1"
                          class="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bulk Update -->
          <div *ngIf="selectedAction.id === 'bulk-update-properties'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Update Color</label>
                <input type="color" [(ngModel)]="bulkUpdateData.stage_color" name="bulk_color"
                       class="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer">
              </div>
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Update Status</label>
                <select [(ngModel)]="bulkUpdateData.status" name="bulk_status"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                  <option value="">Don't change</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

              <div>
                <label class="block text-gray-300 text-sm font-medium mb-3">Select Stages to Update</label>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <label *ngFor="let stage of stages" class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
                    <input type="checkbox"
                           [checked]="selectedStageIds.has(stage.id!)"
                           (change)="toggleStageSelection(stage.id!, $event)"
                           name="stage_{{ stage.id }}"
                           class="mr-3 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-700">
                    <div class="rounded-full w-6 h-6 flex items-center justify-center text-white font-bold text-xs mr-3"
                         [style.background-color]="stage.stage_color">
                      <i class="fas fa-{{ stage.stage_icon }} text-xs"></i>
                    </div>
                    <span class="text-white">{{ stage.title }}</span>
                  </label>
                </div>
              </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 mt-8 pt-6 border-t border-gray-700">
            <button (click)="executeAction()"
                    [disabled]="!canExecuteAction()"
                    class="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <i class="fas fa-{{ selectedAction.icon }} mr-2"></i>
              Execute {{ selectedAction.name }}
            </button>

            <button (click)="selectedAction = null"
                    class="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BulkActionsModalComponent {
  @Input() visible: boolean = false;
  @Input() stages: IProgramStage[] = [];
  @Input() companies: ICompanyStageView[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() bulkAdvanceCompanies = new EventEmitter<{sourceStageId: number, targetStageId: number}>();
  @Output() reorderStages = new EventEmitter<IProgramStage[]>();
  @Output() bulkUpdateStages = new EventEmitter<{stages: IProgramStage[], updates: any}>();

  selectedAction: BulkAction | null = null;
  selectedSourceStage: IProgramStage | null = null;
  selectedTargetStage: IProgramStage | null = null;
  stageOrder: IProgramStage[] = [];
  selectedStageIds: Set<number> = new Set();

  bulkUpdateData = {
    stage_color: '',
    status: ''
  };

  bulkActions: BulkAction[] = [
    {
      id: 'advance-all-companies',
      name: 'Advance All Companies',
      description: 'Move all companies from one stage to another stage',
      icon: 'arrow-right',
      color: '#10B981',
      requiresStageSelection: true,
      requiresConfirmation: true
    },
    {
      id: 'reorder-stages',
      name: 'Reorder Stages',
      description: 'Change the order of stages in the pipeline',
      icon: 'sort',
      color: '#8B5CF6',
      requiresConfirmation: true
    },
    {
      id: 'bulk-update-properties',
      name: 'Bulk Update Properties',
      description: 'Update multiple stage properties at once',
      icon: 'edit',
      color: '#F59E0B',
      requiresConfirmation: true
    },
    {
      id: 'export-stage-data',
      name: 'Export All Stage Data',
      description: 'Export comprehensive data for all stages',
      icon: 'download',
      color: '#06B6D4',
      requiresConfirmation: false
    },
    {
      id: 'archive-completed-stages',
      name: 'Archive Empty Stages',
      description: 'Archive stages that have no companies',
      icon: 'archive',
      color: '#EF4444',
      requiresConfirmation: true
    },
    {
      id: 'duplicate-pipeline',
      name: 'Duplicate Pipeline',
      description: 'Create a copy of the current stage pipeline',
      icon: 'copy',
      color: '#EC4899',
      requiresConfirmation: true
    }
  ];

  selectAction(action: BulkAction) {
    this.selectedAction = action;
    if (action.id === 'reorder-stages') {
      this.stageOrder = [...this.stages.sort((a, b) => (a.stage_order || 0) - (b.stage_order || 0))];
    }
  }

  toggleStageSelection(stageId: number, event: any) {
    if (event.target.checked) {
      this.selectedStageIds.add(stageId);
    } else {
      this.selectedStageIds.delete(stageId);
    }
  }

  getCompaniesInStage(stageId: number): ICompanyStageView[] {
    return this.companies.filter(company => company.current_stage_id === stageId);
  }

  getAdvancementTargets(sourceStage: IProgramStage): IProgramStage[] {
    return this.stages.filter(stage =>
      stage.id !== sourceStage.id &&
      (stage.stage_order || 0) > (sourceStage.stage_order || 0)
    );
  }

  moveStageUp(index: number) {
    if (index > 0) {
      const temp = this.stageOrder[index];
      this.stageOrder[index] = this.stageOrder[index - 1];
      this.stageOrder[index - 1] = temp;
    }
  }

  moveStageDown(index: number) {
    if (index < this.stageOrder.length - 1) {
      const temp = this.stageOrder[index];
      this.stageOrder[index] = this.stageOrder[index + 1];
      this.stageOrder[index + 1] = temp;
    }
  }

  canExecuteAction(): boolean {
    if (!this.selectedAction) return false;

    switch (this.selectedAction.id) {
      case 'advance-all-companies':
        return !!(this.selectedSourceStage && this.selectedTargetStage);
      case 'reorder-stages':
        return this.stageOrder.length > 0;
      case 'bulk-update-properties':
        return this.selectedStageIds.size > 0;
      default:
        return true;
    }
  }

  executeAction() {
    if (!this.selectedAction || !this.canExecuteAction()) return;

    const requiresConfirmation = this.selectedAction.requiresConfirmation;

    if (requiresConfirmation && !confirm(`Are you sure you want to execute "${this.selectedAction.name}"?`)) {
      return;
    }

    switch (this.selectedAction.id) {
      case 'advance-all-companies':
        if (this.selectedSourceStage && this.selectedTargetStage) {
          this.bulkAdvanceCompanies.emit({
            sourceStageId: this.selectedSourceStage.id!,
            targetStageId: this.selectedTargetStage.id!
          });
        }
        break;

      case 'reorder-stages':
        // Update stage_order for each stage
        this.stageOrder.forEach((stage, index) => {
          stage.stage_order = index + 1;
        });
        this.reorderStages.emit(this.stageOrder);
        break;

      case 'bulk-update-properties':
        const selectedStages = this.stages.filter(stage => this.selectedStageIds.has(stage.id!));
        this.bulkUpdateStages.emit({
          stages: selectedStages,
          updates: this.bulkUpdateData
        });
        break;

      case 'export-stage-data':
        this.exportAllData();
        break;

      case 'archive-completed-stages':
        this.archiveEmptyStages();
        break;

      case 'duplicate-pipeline':
        this.duplicatePipeline();
        break;
    }

    this.close.emit();
  }

  private exportAllData() {
    const exportData = {
      export_date: new Date().toISOString(),
      total_stages: this.stages.length,
      total_companies: this.companies.length,
      stages: this.stages.map(stage => ({
        ...stage,
        company_count: this.getCompaniesInStage(stage.id!).length,
        companies: this.getCompaniesInStage(stage.id!)
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stage-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private archiveEmptyStages() {
    const emptyStages = this.stages.filter(stage => this.getCompaniesInStage(stage.id!).length === 0);

    this.bulkUpdateStages.emit({
      stages: emptyStages,
      updates: { status: 'archived' }
    });
  }

  private duplicatePipeline() {
    // This would typically create a new program with the same stages
    console.log('Duplicate pipeline functionality would be implemented here');
    alert('Pipeline duplication functionality will be implemented in the backend.');
  }
}
