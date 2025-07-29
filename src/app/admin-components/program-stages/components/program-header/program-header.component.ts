import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProgram } from '../../../../../models/schema';

@Component({
  selector: 'app-program-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header Section with Gradient -->
    <div class="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 shadow-2xl">
      <div class="container mx-auto px-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Stage Management
            </h1>
            <div *ngIf="program" class="mt-2">
              <h2 class="text-2xl font-semibold text-blue-200">{{ program.name }}</h2>
              <p class="text-blue-300 text-lg">{{ program.description }}</p>
            </div>
          </div>
          <div class="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button (click)="createStage.emit()"
                    class="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <i class="fas fa-plus mr-2"></i>Add Stage
            </button>
            <button (click)="openTemplates.emit()"
                    class="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <i class="fas fa-template mr-2"></i>Templates
            </button>
            <button (click)="openBulkActions.emit()"
                    class="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <i class="fas fa-layer-group mr-2"></i>Bulk Actions
            </button>
            <button (click)="openAnalytics.emit()"
                    class="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <i class="fas fa-chart-line mr-2"></i>Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProgramHeaderComponent {
  @Input() program: IProgram | null = null;

  @Output() createStage = new EventEmitter<void>();
  @Output() openTemplates = new EventEmitter<void>();
  @Output() openBulkActions = new EventEmitter<void>();
  @Output() openAnalytics = new EventEmitter<void>();
}
