import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProgramStage, ICompanyStageView } from '../../../../../models/schema';

@Component({
  selector: 'app-stage-companies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Stage Management Section -->
    <div *ngIf="selectedStage" class="bg-gray-800 rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white flex items-center">
          <i class="fas fa-users mr-3 text-green-400"></i>
          Companies in {{ selectedStage.title }}
        </h3>

        <!-- Stage Actions -->
        <div class="flex space-x-3">
          <button (click)="advanceSelected.emit()"
                  [disabled]="selectedCompanies.length === 0"
                  class="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors">
            <i class="fas fa-arrow-right mr-2"></i>
            Advance Selected ({{ selectedCompanies.length }})
          </button>

          <button (click)="showStatistics.emit()"
                  class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
            <i class="fas fa-chart-bar mr-2"></i>
            Statistics
          </button>

          <button (click)="exportData.emit()"
                  class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
            <i class="fas fa-download mr-2"></i>
            Export
          </button>
        </div>
      </div>

      <!-- Companies Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let company of companies; trackBy: trackByCompanyId"
             class="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-all duration-200 cursor-pointer border-2"
             [class.border-blue-500]="selectedCompanies.includes(company.company_id)"
             [class.border-gray-600]="!selectedCompanies.includes(company.company_id)"
             (click)="companySelected.emit(company)">

          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h4 class="font-semibold text-white mb-1">{{ company.company_name }}</h4>
              <p class="text-gray-400 text-sm">{{ company.sector }}</p>
            </div>
            <div class="flex items-center">
              <input type="checkbox"
                     [checked]="selectedCompanies.includes(company.company_id)"
                     (click)="$event.stopPropagation()"
                     (change)="toggleSelection.emit(company.company_id)"
                     class="mr-2">
              <div class="dropdown relative">
                <button (click)="$event.stopPropagation()"
                        class="text-gray-400 hover:text-white p-1">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Company Progress Info -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Entered:</span>
              <span class="text-gray-300">{{ company.stage_entered_at | date:'short' }}</span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Days in Stage:</span>
              <span class="text-gray-300 font-semibold">
                {{ calculateDaysInStage(company.stage_entered_at) }}
              </span>
            </div>

            <div *ngIf="company.stage_progress_percentage" class="space-y-1">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Progress:</span>
                <span class="text-gray-300">{{ company.stage_progress_percentage }}%</span>
              </div>
              <div class="w-full bg-gray-600 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-300"
                     [style.width.%]="company.stage_progress_percentage"></div>
              </div>
            </div>

            <!-- Priority Badge -->
            <div *ngIf="company.priority_level" class="flex justify-end">
              <span class="px-2 py-1 rounded-full text-xs font-semibold"
                    [ngClass]="{
                      'bg-red-600 text-white': company.priority_level === 'urgent',
                      'bg-orange-600 text-white': company.priority_level === 'high',
                      'bg-yellow-600 text-white': company.priority_level === 'medium',
                      'bg-gray-600 text-white': company.priority_level === 'low'
                    }">
                {{ company.priority_level | titlecase }}
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex space-x-2 mt-3 pt-3 border-t border-gray-600">
            <button (click)="viewDetails.emit(company); $event.stopPropagation()"
                    class="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded text-xs transition-colors">
              Details
            </button>
            <button (click)="advanceSingle.emit(company.company_id); $event.stopPropagation()"
                    class="bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded text-xs transition-colors"
                    *ngIf="canAdvance">
              Advance
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="companies.length === 0"
             class="col-span-full text-center py-12">
          <i class="fas fa-building text-gray-500 text-4xl mb-4"></i>
          <p class="text-gray-400 text-lg">No companies in this stage</p>
          <p class="text-gray-500 text-sm">Companies will appear here as they progress through the program</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StageCompaniesComponent {
  @Input() selectedStage: IProgramStage | null = null;
  @Input() companies: ICompanyStageView[] = [];
  @Input() selectedCompanies: number[] = [];
  @Input() canAdvance: boolean = false;

  @Output() companySelected = new EventEmitter<ICompanyStageView>();
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() advanceSelected = new EventEmitter<void>();
  @Output() advanceSingle = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<ICompanyStageView>();
  @Output() showStatistics = new EventEmitter<void>();
  @Output() exportData = new EventEmitter<void>();

  trackByCompanyId(index: number, company: ICompanyStageView): number {
    return company.company_id;
  }

  calculateDaysInStage(entryDate: string): number {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
