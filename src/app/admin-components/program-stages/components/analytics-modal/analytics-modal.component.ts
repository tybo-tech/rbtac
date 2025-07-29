import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProgramStage, ICompanyStageView, IProgram } from '../../../../../models/schema';

interface StageAnalytics {
  stageId: number;
  stageName: string;
  companyCount: number;
  avgDaysInStage: number;
  completionRate: number;
  bottleneckScore: number;
  overdueDays: number;
}

interface ProgramAnalytics {
  totalCompanies: number;
  totalStages: number;
  avgPipelineDuration: number;
  overallCompletionRate: number;
  bottleneckStage: string;
  stageAnalytics: StageAnalytics[];
  conversionRates: number[];
  timelineData: any[];
}

@Component({
  selector: 'app-analytics-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Analytics Modal -->
    <div *ngIf="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <i class="fas fa-chart-line mr-3 text-orange-400"></i>
            Program Analytics & Insights
          </h3>
          <div class="flex space-x-3">
            <button (click)="exportAnalytics()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
              <i class="fas fa-download mr-2"></i>Export
            </button>
            <button (click)="close.emit()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
        </div>

        <div class="p-6" *ngIf="analytics">
          <!-- Key Metrics Overview -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 text-center">
              <div class="text-3xl font-bold text-white mb-2">{{ analytics.totalCompanies }}</div>
              <div class="text-blue-200 text-sm">Total Companies</div>
            </div>

            <div class="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 text-center">
              <div class="text-3xl font-bold text-white mb-2">{{ analytics.avgPipelineDuration }}d</div>
              <div class="text-green-200 text-sm">Avg Pipeline Duration</div>
            </div>

            <div class="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 text-center">
              <div class="text-3xl font-bold text-white mb-2">{{ analytics.overallCompletionRate }}%</div>
              <div class="text-purple-200 text-sm">Overall Completion Rate</div>
            </div>

            <div class="bg-gradient-to-br from-orange-800 to-orange-900 rounded-xl p-6 text-center">
              <div class="text-3xl font-bold text-white mb-2">{{ analytics.bottleneckStage }}</div>
              <div class="text-orange-200 text-sm">Bottleneck Stage</div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Stage Performance Table -->
            <div class="bg-gray-700 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <i class="fas fa-table mr-2 text-blue-400"></i>
                Stage Performance
              </h4>

              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-600">
                      <th class="text-left text-gray-300 pb-2">Stage</th>
                      <th class="text-center text-gray-300 pb-2">Companies</th>
                      <th class="text-center text-gray-300 pb-2">Avg Days</th>
                      <th class="text-center text-gray-300 pb-2">Completion</th>
                      <th class="text-center text-gray-300 pb-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let stage of analytics.stageAnalytics" class="border-b border-gray-600">
                      <td class="py-3">
                        <div class="flex items-center">
                          <div class="w-4 h-4 rounded-full mr-2" [style.background-color]="getStageColor(stage.stageId)"></div>
                          <span class="text-white font-medium">{{ stage.stageName }}</span>
                        </div>
                      </td>
                      <td class="text-center text-gray-300">{{ stage.companyCount }}</td>
                      <td class="text-center text-gray-300">{{ stage.avgDaysInStage }}</td>
                      <td class="text-center">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold"
                              [ngClass]="getCompletionRateClass(stage.completionRate)">
                          {{ stage.completionRate }}%
                        </span>
                      </td>
                      <td class="text-center">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold"
                              [ngClass]="getBottleneckClass(stage.bottleneckScore)">
                          {{ getBottleneckLabel(stage.bottleneckScore) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Conversion Funnel -->
            <div class="bg-gray-700 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <i class="fas fa-filter mr-2 text-green-400"></i>
                Conversion Funnel
              </h4>

              <div class="space-y-3">
                <div *ngFor="let stage of analytics.stageAnalytics; let i = index" class="relative">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-white text-sm font-medium">{{ stage.stageName }}</span>
                    <span class="text-gray-300 text-sm">{{ stage.companyCount }} companies</span>
                  </div>

                  <div class="relative">
                    <div class="w-full bg-gray-600 rounded-full h-6">
                      <div class="h-6 rounded-full transition-all duration-300 flex items-center justify-center text-white text-xs font-semibold"
                           [style.background-color]="getStageColor(stage.stageId)"
                           [style.width.%]="getFunnelWidth(i)">
                        {{ getFunnelWidth(i) }}%
                      </div>
                    </div>

                    <!-- Conversion Rate Arrow -->
                    <div *ngIf="i < analytics.stageAnalytics.length - 1"
                         class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs">
                      <i class="fas fa-arrow-down"></i>
                      <span class="ml-1">{{ analytics.conversionRates[i] }}%</span>
                    </div>
                  </div>

                  <div class="h-8"></div> <!-- Spacer for arrow -->
                </div>
              </div>
            </div>
          </div>

          <!-- Insights and Recommendations -->
          <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Insights -->
            <div class="bg-gray-700 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <i class="fas fa-lightbulb mr-2 text-yellow-400"></i>
                Key Insights
              </h4>

              <div class="space-y-4">
                <div *ngFor="let insight of getInsights()" class="flex items-start p-3 bg-gray-600 rounded-lg">
                  <div class="rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm"
                       [style.background-color]="insight.color">
                    <i class="fas fa-{{ insight.icon }} text-white"></i>
                  </div>
                  <div>
                    <h5 class="font-medium text-white">{{ insight.title }}</h5>
                    <p class="text-gray-300 text-sm">{{ insight.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div class="bg-gray-700 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <i class="fas fa-tasks mr-2 text-purple-400"></i>
                Recommendations
              </h4>

              <div class="space-y-4">
                <div *ngFor="let recommendation of getRecommendations()" class="flex items-start p-3 bg-gray-600 rounded-lg">
                  <div class="rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm"
                       [style.background-color]="recommendation.priority === 'high' ? '#EF4444' : recommendation.priority === 'medium' ? '#F59E0B' : '#10B981'">
                    <i class="fas fa-{{ recommendation.icon }} text-white"></i>
                  </div>
                  <div>
                    <h5 class="font-medium text-white">{{ recommendation.title }}</h5>
                    <p class="text-gray-300 text-sm">{{ recommendation.description }}</p>
                    <span class="inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold"
                          [ngClass]="recommendation.priority === 'high' ? 'bg-red-600 text-white' : recommendation.priority === 'medium' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'">
                      {{ recommendation.priority | titlecase }} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Historical Trends (Placeholder for Charts) -->
          <div class="mt-8 bg-gray-700 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
              <i class="fas fa-chart-area mr-2 text-indigo-400"></i>
              Historical Trends
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-600 rounded-lg p-4 h-64 flex items-center justify-center">
                <div class="text-center">
                  <i class="fas fa-chart-line text-gray-400 text-4xl mb-2"></i>
                  <p class="text-gray-400">Pipeline Velocity Chart</p>
                  <p class="text-gray-500 text-sm">Chart visualization would be implemented here</p>
                </div>
              </div>

              <div class="bg-gray-600 rounded-lg p-4 h-64 flex items-center justify-center">
                <div class="text-center">
                  <i class="fas fa-chart-bar text-gray-400 text-4xl mb-2"></i>
                  <p class="text-gray-400">Stage Distribution Over Time</p>
                  <p class="text-gray-500 text-sm">Chart visualization would be implemented here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="!analytics" class="p-12 text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p class="text-gray-300 text-lg">Generating analytics...</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AnalyticsModalComponent {
  @Input() visible: boolean = false;
  @Input() program: IProgram | null = null;
  @Input() stages: IProgramStage[] = [];
  @Input() companies: ICompanyStageView[] = [];

  @Output() close = new EventEmitter<void>();

  analytics: ProgramAnalytics | null = null;

  ngOnChanges() {
    if (this.visible && this.stages.length > 0) {
      this.generateAnalytics();
    }
  }

  generateAnalytics() {
    // Simulate analytics generation
    setTimeout(() => {
      this.analytics = this.calculateAnalytics();
    }, 1000);
  }

  private calculateAnalytics(): ProgramAnalytics {
    const stageAnalytics: StageAnalytics[] = this.stages.map(stage => {
      const companiesInStage = this.getCompaniesInStage(stage.id!);
      const avgDays = this.calculateAvgDaysInStage(stage.id!);
      const completionRate = this.calculateStageCompletionRate(stage.id!);

      return {
        stageId: stage.id!,
        stageName: stage.title,
        companyCount: companiesInStage.length,
        avgDaysInStage: avgDays,
        completionRate: completionRate,
        bottleneckScore: this.calculateBottleneckScore(stage, avgDays),
        overdueDays: stage.max_duration_days ? Math.max(0, avgDays - stage.max_duration_days) : 0
      };
    });

    const conversionRates = this.calculateConversionRates();
    const bottleneckStage = stageAnalytics.reduce((prev, current) =>
      prev.bottleneckScore > current.bottleneckScore ? prev : current
    );

    return {
      totalCompanies: this.companies.length,
      totalStages: this.stages.length,
      avgPipelineDuration: this.calculateAvgPipelineDuration(),
      overallCompletionRate: this.calculateOverallCompletionRate(),
      bottleneckStage: bottleneckStage.stageName,
      stageAnalytics,
      conversionRates,
      timelineData: [] // Would be populated with historical data
    };
  }

  private getCompaniesInStage(stageId: number) {
    return this.companies.filter(company => company.current_stage_id === stageId);
  }

  private calculateAvgDaysInStage(stageId: number): number {
    const companiesInStage = this.getCompaniesInStage(stageId);
    if (companiesInStage.length === 0) return 0;

    const totalDays = companiesInStage.reduce((sum, company) => {
      const entryDate = new Date(company.stage_entered_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - entryDate.getTime());
      return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / companiesInStage.length);
  }

  private calculateStageCompletionRate(stageId: number): number {
    const companiesInStage = this.getCompaniesInStage(stageId);
    if (companiesInStage.length === 0) return 0;

    const completedCount = companiesInStage.filter(c =>
      c.stage_progress_percentage && c.stage_progress_percentage >= 100
    ).length;

    return Math.round((completedCount / companiesInStage.length) * 100);
  }

  private calculateBottleneckScore(stage: IProgramStage, avgDays: number): number {
    const companiesInStage = this.getCompaniesInStage(stage.id!).length;
    const expectedDays = stage.expected_duration_days || 30;
    const delayFactor = avgDays / expectedDays;
    const volumeFactor = companiesInStage / this.companies.length;

    return Math.round((delayFactor + volumeFactor) * 50);
  }

  private calculateConversionRates(): number[] {
    const rates: number[] = [];

    for (let i = 0; i < this.stages.length - 1; i++) {
      const currentStageCompanies = this.getCompaniesInStage(this.stages[i].id!).length;
      const nextStageCompanies = this.getCompaniesInStage(this.stages[i + 1].id!).length;

      if (currentStageCompanies > 0) {
        rates.push(Math.round((nextStageCompanies / currentStageCompanies) * 100));
      } else {
        rates.push(0);
      }
    }

    return rates;
  }

  private calculateAvgPipelineDuration(): number {
    // Calculate average time from first to last stage
    if (this.companies.length === 0) return 0;

    const totalDays = this.companies.reduce((sum, company) => {
      const entryDate = new Date(company.stage_entered_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - entryDate.getTime());
      return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / this.companies.length);
  }

  private calculateOverallCompletionRate(): number {
    if (this.companies.length === 0) return 0;

    const lastStageId = this.stages[this.stages.length - 1]?.id;
    if (!lastStageId) return 0;

    const completedCompanies = this.getCompaniesInStage(lastStageId).length;
    return Math.round((completedCompanies / this.companies.length) * 100);
  }

  getStageColor(stageId: number): string {
    const stage = this.stages.find(s => s.id === stageId);
    return stage?.stage_color || '#3B82F6';
  }

  getFunnelWidth(index: number): number {
    if (!this.analytics) return 0;
    const maxCompanies = Math.max(...this.analytics.stageAnalytics.map(s => s.companyCount));
    if (maxCompanies === 0) return 0;
    return Math.round((this.analytics.stageAnalytics[index].companyCount / maxCompanies) * 100);
  }

  getCompletionRateClass(rate: number): string {
    if (rate >= 80) return 'bg-green-600 text-white';
    if (rate >= 60) return 'bg-yellow-600 text-white';
    return 'bg-red-600 text-white';
  }

  getBottleneckClass(score: number): string {
    if (score >= 80) return 'bg-red-600 text-white';
    if (score >= 60) return 'bg-yellow-600 text-white';
    return 'bg-green-600 text-white';
  }

  getBottleneckLabel(score: number): string {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  }

  getInsights() {
    if (!this.analytics) return [];

    const insights = [];

    // Find bottleneck
    const bottleneck = this.analytics.stageAnalytics.reduce((prev, current) =>
      prev.bottleneckScore > current.bottleneckScore ? prev : current
    );

    insights.push({
      title: 'Bottleneck Identified',
      description: `${bottleneck.stageName} is causing delays with ${bottleneck.avgDaysInStage} average days`,
      icon: 'exclamation-triangle',
      color: '#EF4444'
    });

    // Find best performing stage
    const bestStage = this.analytics.stageAnalytics.reduce((prev, current) =>
      prev.completionRate > current.completionRate ? prev : current
    );

    insights.push({
      title: 'Best Performing Stage',
      description: `${bestStage.stageName} has the highest completion rate at ${bestStage.completionRate}%`,
      icon: 'trophy',
      color: '#10B981'
    });

    // Pipeline health
    if (this.analytics.overallCompletionRate > 75) {
      insights.push({
        title: 'Healthy Pipeline',
        description: `Strong overall completion rate of ${this.analytics.overallCompletionRate}%`,
        icon: 'heart',
        color: '#10B981'
      });
    } else {
      insights.push({
        title: 'Pipeline Needs Attention',
        description: `Low completion rate of ${this.analytics.overallCompletionRate}% indicates issues`,
        icon: 'heartbeat',
        color: '#F59E0B'
      });
    }

    return insights;
  }

  getRecommendations() {
    if (!this.analytics) return [];

    const recommendations = [];

    // Bottleneck recommendations
    const bottleneck = this.analytics.stageAnalytics.reduce((prev, current) =>
      prev.bottleneckScore > current.bottleneckScore ? prev : current
    );

    if (bottleneck.bottleneckScore > 70) {
      recommendations.push({
        title: 'Address Bottleneck',
        description: `Focus resources on ${bottleneck.stageName} to reduce delays`,
        icon: 'tools',
        priority: 'high'
      });
    }

    // Low conversion rates
    this.analytics.conversionRates.forEach((rate, index) => {
      if (rate < 50 && index < this.stages.length - 1) {
        recommendations.push({
          title: 'Improve Stage Transition',
          description: `Low ${rate}% conversion from ${this.stages[index].title} to ${this.stages[index + 1].title}`,
          icon: 'arrow-right',
          priority: 'medium'
        });
      }
    });

    // General optimization
    if (this.analytics.avgPipelineDuration > 90) {
      recommendations.push({
        title: 'Optimize Pipeline Duration',
        description: 'Consider streamlining processes to reduce overall pipeline time',
        icon: 'clock',
        priority: 'medium'
      });
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }

  exportAnalytics() {
    if (!this.analytics) return;

    const exportData = {
      program: this.program?.name,
      export_date: new Date().toISOString(),
      analytics: this.analytics,
      insights: this.getInsights(),
      recommendations: this.getRecommendations()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `program-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
