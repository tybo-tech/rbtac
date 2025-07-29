import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProgramStage, ICompanyStageView } from '../../../../../models/schema';

@Component({
  selector: 'app-stage-pipeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Enhanced Stages Pipeline -->
    <div class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h3 class="text-xl font-semibold mb-6 text-white flex items-center">
        <i class="fas fa-stream mr-3 text-blue-400"></i>
        Program Pipeline
      </h3>

      <div class="flex overflow-x-auto pb-4 space-x-4">
        <div *ngFor="let stage of stages; let i = index; trackBy: trackByStageId"
             class="flex-shrink-0 w-80 bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-all duration-300 cursor-pointer border-2"
             [class.border-blue-500]="selectedStage?.id === stage.id"
             [class.border-gray-600]="selectedStage?.id !== stage.id"
             (click)="stageSelected.emit(stage)">

          <!-- Stage Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg"
                   [style.background-color]="stage.stage_color || '#3B82F6'">
                <i class="fas fa-{{ stage.stage_icon || 'clipboard-list' }} text-sm"></i>
              </div>
              <div>
                <h4 class="font-semibold text-white">{{ stage.title }}</h4>
                <p class="text-xs text-gray-400">Stage {{ i + 1 }}</p>
              </div>
            </div>
            <div class="flex space-x-1">
              <button (click)="editStage.emit(stage); $event.stopPropagation()"
                      class="text-gray-400 hover:text-blue-400 p-1 rounded hover:bg-gray-600 transition-all"
                      title="Edit Stage">
                <i class="fas fa-edit text-sm"></i>
              </button>
              <button (click)="deleteStage.emit(stage); $event.stopPropagation()"
                      class="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-gray-600 transition-all"
                      title="Delete Stage">
                <i class="fas fa-trash text-sm"></i>
              </button>
              <button (click)="duplicateStage.emit(stage); $event.stopPropagation()"
                      class="text-gray-400 hover:text-green-400 p-1 rounded hover:bg-gray-600 transition-all"
                      title="Duplicate Stage">
                <i class="fas fa-copy text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Stage Description -->
          <p class="text-gray-300 text-sm mb-3 line-clamp-2">{{ stage.description }}</p>

          <!-- Stage Metrics -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Companies:</span>
              <span class="text-white px-2 py-1 rounded-full text-xs font-semibold"
                    [style.background-color]="stage.stage_color || '#3B82F6'">
                {{ getCompanyCount(stage.id!) }}
              </span>
            </div>

            <div class="flex justify-between items-center" *ngIf="stage.expected_duration_days">
              <span class="text-gray-400 text-sm">Expected Duration:</span>
              <span class="text-gray-300 text-xs">
                <i class="fas fa-clock mr-1"></i>{{ stage.expected_duration_days }}d
              </span>
            </div>

            <!-- Average Time in Stage -->
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Avg Time:</span>
              <span class="text-gray-300 text-xs">
                <i class="fas fa-hourglass-half mr-1"></i>{{ getAverageTime(stage.id!) }}d
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-600 rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-300"
                   [style.background-color]="stage.stage_color || '#3B82F6'"
                   [style.width.%]="getCompletionRate(stage.id!)"></div>
            </div>

            <!-- Stage Status Indicators -->
            <div class="flex flex-wrap gap-1 mt-2">
              <span *ngIf="stage.is_milestone"
                    class="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <i class="fas fa-star mr-1"></i>Milestone
              </span>
              <span *ngIf="stage.approval_required"
                    class="bg-red-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <i class="fas fa-check-circle mr-1"></i>Approval Req.
              </span>
              <span *ngIf="stage.status === 'inactive'"
                    class="bg-gray-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <i class="fas fa-pause mr-1"></i>Inactive
              </span>
              <span *ngIf="isOverdue(stage)"
                    class="bg-orange-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <i class="fas fa-exclamation-triangle mr-1"></i>Overdue
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex space-x-2 mt-3">
            <button (click)="viewDetails.emit(stage); $event.stopPropagation()"
                    class="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded text-xs transition-colors">
              View Details
            </button>
            <button (click)="bulkAdvance.emit(stage); $event.stopPropagation()"
                    class="bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded text-xs transition-colors"
                    *ngIf="getCompanyCount(stage.id!) > 0">
              Advance All
            </button>
          </div>
        </div>

        <!-- Add New Stage Card -->
        <div class="flex-shrink-0 w-80 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg p-4 hover:border-blue-500 transition-all duration-300 cursor-pointer"
             (click)="createStage.emit()">
          <div class="flex flex-col items-center justify-center h-full text-gray-400 hover:text-blue-400 transition-colors">
            <i class="fas fa-plus text-3xl mb-2"></i>
            <p class="text-sm font-semibold">Add New Stage</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StagePipelineComponent {
  @Input() stages: IProgramStage[] = [];
  @Input() companies: ICompanyStageView[] = [];
  @Input() selectedStage: IProgramStage | null = null;

  @Output() stageSelected = new EventEmitter<IProgramStage>();
  @Output() editStage = new EventEmitter<IProgramStage>();
  @Output() deleteStage = new EventEmitter<IProgramStage>();
  @Output() duplicateStage = new EventEmitter<IProgramStage>();
  @Output() viewDetails = new EventEmitter<IProgramStage>();
  @Output() bulkAdvance = new EventEmitter<IProgramStage>();
  @Output() createStage = new EventEmitter<void>();

  trackByStageId(index: number, stage: IProgramStage): number | undefined {
    return stage.id;
  }

  getCompanyCount(stageId: number): number {
    return this.companies.filter(company => company.current_stage_id === stageId).length;
  }

  getAverageTime(stageId: number): number {
    const companiesInStage = this.companies.filter(company => company.current_stage_id === stageId);
    if (companiesInStage.length === 0) return 0;

    const totalDays = companiesInStage.reduce((sum, company) => {
      const entryDate = company.stage_entered_at;
      return sum + (entryDate ? this.calculateDaysInStage(entryDate) : 0);
    }, 0);

    return Math.round(totalDays / companiesInStage.length);
  }

  getCompletionRate(stageId: number): number {
    const companiesInStage = this.companies.filter(company => company.current_stage_id === stageId);
    if (companiesInStage.length === 0) return 0;

    const completedCount = companiesInStage.filter(c =>
      c.stage_progress_percentage && c.stage_progress_percentage >= 100
    ).length;

    return Math.round((completedCount / companiesInStage.length) * 100);
  }

  isOverdue(stage: IProgramStage): boolean {
    if (!stage.max_duration_days) return false;

    const companiesInStage = this.companies.filter(company => company.current_stage_id === stage.id);
    return companiesInStage.some(company => {
      const daysInStage = this.calculateDaysInStage(company.stage_entered_at);
      return daysInStage > stage.max_duration_days!;
    });
  }

  private calculateDaysInStage(entryDate: string): number {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
