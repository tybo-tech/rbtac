import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICompanyStageView } from '../../../../../models/schema';

@Component({
  selector: 'app-company-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Company Details Modal -->
    <div *ngIf="visible && company" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white">{{ company.company_name }}</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-gray-400 text-sm font-medium mb-1">Sector</label>
                <p class="text-white">{{ company.sector }}</p>
              </div>

              <div>
                <label class="block text-gray-400 text-sm font-medium mb-1">Current Stage</label>
                <p class="text-white">{{ company.current_stage_title }}</p>
              </div>

              <div>
                <label class="block text-gray-400 text-sm font-medium mb-1">Stage Entry Date</label>
                <p class="text-white">{{ company.stage_entered_at | date:'full' }}</p>
              </div>

              <div>
                <label class="block text-gray-400 text-sm font-medium mb-1">Days in Current Stage</label>
                <p class="text-white font-semibold">{{ calculateDaysInStage(company.stage_entered_at) }} days</p>
              </div>
            </div>

            <div class="space-y-4">
              <div *ngIf="company.stage_progress_percentage">
                <label class="block text-gray-400 text-sm font-medium mb-1">Progress</label>
                <div class="flex items-center space-x-3">
                  <div class="flex-1 bg-gray-600 rounded-full h-3">
                    <div class="bg-green-500 h-3 rounded-full transition-all duration-300"
                         [style.width.%]="company.stage_progress_percentage"></div>
                  </div>
                  <span class="text-white font-semibold">{{ company.stage_progress_percentage }}%</span>
                </div>
              </div>

              <div *ngIf="company.priority_level">
                <label class="block text-gray-400 text-sm font-medium mb-1">Priority Level</label>
                <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                      [ngClass]="{
                        'bg-red-600 text-white': company.priority_level === 'urgent',
                        'bg-orange-600 text-white': company.priority_level === 'high',
                        'bg-yellow-600 text-white': company.priority_level === 'medium',
                        'bg-gray-600 text-white': company.priority_level === 'low'
                      }">
                  {{ company.priority_level | titlecase }}
                </span>
              </div>

              <div *ngIf="company.notes">
                <label class="block text-gray-400 text-sm font-medium mb-1">Notes</label>
                <p class="text-white bg-gray-700 rounded-lg p-3">{{ company.notes }}</p>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6 pt-6 border-t border-gray-700">
            <button *ngIf="canAdvance"
                    (click)="advanceCompany.emit(company.company_id)"
                    class="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              <i class="fas fa-arrow-right mr-2"></i>Advance to Next Stage
            </button>

            <button (click)="editCompany.emit(company)"
                    class="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              <i class="fas fa-edit mr-2"></i>Edit Info
            </button>

            <button (click)="viewHistory.emit(company.company_id)"
                    class="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              <i class="fas fa-history mr-2"></i>View History
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyDetailsModalComponent {
  @Input() visible: boolean = false;
  @Input() company: ICompanyStageView | null = null;
  @Input() canAdvance: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() advanceCompany = new EventEmitter<number>();
  @Output() editCompany = new EventEmitter<ICompanyStageView>();
  @Output() viewHistory = new EventEmitter<number>();

  calculateDaysInStage(entryDate: string): number {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
