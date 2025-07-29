import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Statistics Modal -->
    <div *ngIf="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white">Stage Analytics & Statistics</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div class="p-6">
          <div *ngIf="statistics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-white">{{ statistics.totalCompanies }}</div>
              <div class="text-blue-200 text-sm">Total Companies</div>
            </div>

            <div class="bg-gradient-to-br from-green-800 to-green-900 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-white">{{ statistics.averageDaysInStage }}</div>
              <div class="text-green-200 text-sm">Avg Days in Stage</div>
            </div>

            <div class="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-white">{{ statistics.completionRate }}%</div>
              <div class="text-purple-200 text-sm">Completion Rate</div>
            </div>

            <div class="bg-gradient-to-br from-orange-800 to-orange-900 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-white">{{ statistics.activeCompanies }}</div>
              <div class="text-orange-200 text-sm">Active Companies</div>
            </div>
          </div>

          <!-- Additional analytics charts would go here -->
          <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Placeholder for charts -->
            <div class="bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
              <p class="text-gray-400">Stage Progression Chart</p>
            </div>
            <div class="bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
              <p class="text-gray-400">Time Distribution Chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StatisticsModalComponent {
  @Input() visible: boolean = false;
  @Input() statistics: any = null;

  @Output() close = new EventEmitter<void>();
}
