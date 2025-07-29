import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProgramStage, ICompany, ICompanyStageView } from '../../../../../models/schema';

@Component({
  selector: 'app-program-overview-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Program Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center">
          <div class="bg-blue-600 rounded-lg p-3 mr-4">
            <i class="fas fa-list text-white text-xl"></i>
          </div>
          <div>
            <p class="text-blue-200 text-sm">Total Stages</p>
            <p class="text-2xl font-bold text-white">{{ stages.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center">
          <div class="bg-green-600 rounded-lg p-3 mr-4">
            <i class="fas fa-building text-white text-xl"></i>
          </div>
          <div>
            <p class="text-green-200 text-sm">Active Companies</p>
            <p class="text-2xl font-bold text-white">{{ companies.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center">
          <div class="bg-purple-600 rounded-lg p-3 mr-4">
            <i class="fas fa-clock text-white text-xl"></i>
          </div>
          <div>
            <p class="text-purple-200 text-sm">Avg Stage Duration</p>
            <p class="text-2xl font-bold text-white">{{ averageStageTime }}d</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-800 to-orange-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center">
          <div class="bg-orange-600 rounded-lg p-3 mr-4">
            <i class="fas fa-chart-line text-white text-xl"></i>
          </div>
          <div>
            <p class="text-orange-200 text-sm">Completion Rate</p>
            <p class="text-2xl font-bold text-white">{{ completionRate }}%</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProgramOverviewCardsComponent {
  @Input() stages: IProgramStage[] = [];
  @Input() companies: ICompanyStageView[] = [];
  @Input() averageStageTime: number = 0;
  @Input() completionRate: number = 0;
}
