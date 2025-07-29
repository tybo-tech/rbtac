import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { IProgram, ICompany, IProgramStage, ICompanyStageView } from '../../../models/schema';
import { ProgramService } from '../../../services/betta/programs.service';
import { CompanyService } from '../../../services/betta/companies.service';
import { ProgramStageService } from '../../../services/betta/program-stage.service';
import { CompanyProgramStageService } from '../../../services/betta/company-program-stage.service';

// Import child components
import { ProgramHeaderComponent } from './components/program-header/program-header.component';
import { ProgramOverviewCardsComponent } from './components/program-overview-cards/program-overview-cards.component';
import { StagePipelineComponent } from './components/stage-pipeline/stage-pipeline.component';
import { StageCompaniesComponent } from './components/stage-companies/stage-companies.component';
import { StatisticsModalComponent } from './components/statistics-modal/statistics-modal.component';
import { CompanyDetailsModalComponent } from './components/company-details-modal/company-details-modal.component';

// Import action modal components
import { CreateStageModalComponent } from './components/create-stage-modal/create-stage-modal.component';
import { StageTemplatesModalComponent } from './components/stage-templates-modal/stage-templates-modal.component';
import { BulkActionsModalComponent } from './components/bulk-actions-modal/bulk-actions-modal.component';
import { AnalyticsModalComponent } from './components/analytics-modal/analytics-modal.component';

@Component({
  selector: 'app-program-stages',
  standalone: true,
  imports: [
    CommonModule,
    ProgramHeaderComponent,
    ProgramOverviewCardsComponent,
    StagePipelineComponent,
    StageCompaniesComponent,
    StatisticsModalComponent,
    CompanyDetailsModalComponent,
    CreateStageModalComponent,
    StageTemplatesModalComponent,
    BulkActionsModalComponent,
    AnalyticsModalComponent
  ],
  template: `
    <!-- Enhanced Program Stages Management with Beautiful Dark Theme -->
    <div class="min-h-screen bg-gray-900 text-white">
      
      <!-- Program Header -->
      <app-program-header
        [program]="program"
        (createStage)="openCreateStageModal()"
        (openTemplates)="openStageTemplatesModal()"
        (openBulkActions)="openBulkActionsModal()"
        (openAnalytics)="openAnalyticsModal()">
      </app-program-header>

      <div class="container mx-auto px-6 py-8">
        <!-- Loading State -->
        <div *ngIf="loading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p class="ml-4 text-lg text-gray-300">Loading program data...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-8">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
            <p class="text-red-200">{{ error }}</p>
            <button (click)="loadProgramData()"
                    class="ml-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors">
              Retry
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div *ngIf="!loading && !error">
          
          <!-- Program Overview Cards -->
          <app-program-overview-cards
            [stages]="stages"
            [companies]="companies"
            [averageStageTime]="calculateAverageStageTime()"
            [completionRate]="calculateCompletionRate()">
          </app-program-overview-cards>

          <!-- Stage Pipeline -->
          <app-stage-pipeline
            [stages]="stages"
            [companies]="companies"
            [selectedStage]="selectedStage"
            (stageSelected)="selectStage($event)"
            (editStage)="editStage($event)"
            (deleteStage)="deleteStage($event)"
            (duplicateStage)="duplicateStage($event)"
            (viewDetails)="viewStageDetails($event)"
            (bulkAdvance)="bulkAdvanceFromStage($event)"
            (createStage)="openCreateStageModal()">
          </app-stage-pipeline>

          <!-- Stage Companies -->
          <app-stage-companies
            [selectedStage]="selectedStage"
            [companies]="getCompaniesInStage(selectedStage?.id!)"
            [selectedCompanies]="selectedCompanies"
            [canAdvance]="canAdvanceToNextStage(selectedStage?.id!)"
            (companySelected)="toggleCompanySelection($event.company_id)"
            (toggleSelection)="toggleCompanySelection($event)"
            (advanceSelected)="advanceSelectedCompanies()"
            (advanceSingle)="advanceSingleCompany($event)"
            (viewDetails)="viewCompanyDetails($event)"
            (showStatistics)="showStageStatistics()"
            (exportData)="exportStageData()">
          </app-stage-companies>

        </div>
      </div>

      <!-- Statistics Modal -->
      <app-statistics-modal
        [visible]="showingStatistics"
        [statistics]="stageStatistics"
        (close)="hideStatistics()">
      </app-statistics-modal>

      <!-- Company Details Modal -->
      <app-company-details-modal
        [visible]="!!selectedCompanyForDetails"
        [company]="selectedCompanyForDetails"
        [canAdvance]="getCanAdvanceCompany()"
        (close)="closeCompanyDetails()"
        (advanceCompany)="advanceSingleCompany($event)"
        (editCompany)="editCompanyStageInfo($event)"
        (viewHistory)="viewCompanyHistory($event)">
      </app-company-details-modal>

      <!-- Header Action Modals -->
      <app-create-stage-modal
        [visible]="showCreateStageModal"
        [program]="program"
        [existingStages]="stages"
        (close)="showCreateStageModal = false"
        (stageCreated)="onStageCreated($event)">
      </app-create-stage-modal>

      <app-stage-templates-modal
        [visible]="showTemplatesModal"
        [program]="program"
        (close)="showTemplatesModal = false"
        (templateApplied)="onTemplateApplied($event)">
      </app-stage-templates-modal>

      <app-bulk-actions-modal
        [visible]="showBulkActionsModal"
        [stages]="stages"
        [companies]="companies"
        (close)="showBulkActionsModal = false"
        (actionCompleted)="onBulkActionCompleted($event)">
      </app-bulk-actions-modal>

      <app-analytics-modal
        [visible]="showAnalyticsModal"
        [program]="program"
        [stages]="stages"
        [companies]="companies"
        (close)="showAnalyticsModal = false">
      </app-analytics-modal>

    </div>
  `,
  styleUrl: './program-stages.component.scss'
})
export class ProgramStagesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Route parameters
  programId: number | null = null;

  // Data
  program: IProgram | null = null;
  stages: IProgramStage[] = [];
  companies: ICompanyStageView[] = [];

  // UI State
  loading = false;
  error: string | null = null;
  selectedStage: IProgramStage | null = null;
  selectedCompanies: number[] = [];
  selectedCompanyForDetails: ICompanyStageView | null = null;

  // Statistics
  showingStatistics = false;
  stageStatistics: any = null;

  // Header Action Modals
  showCreateStageModal = false;
  showTemplatesModal = false;
  showBulkActionsModal = false;
  showAnalyticsModal = false;

  constructor(
    private route: ActivatedRoute,
    private programService: ProgramService,
    private companyService: CompanyService,
    private programStageService: ProgramStageService,
    private companyStageService: CompanyProgramStageService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.programId = +params['id'];
      if (this.programId) {
        this.loadProgramData();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProgramData() {
    if (!this.programId) return;

    console.log('Loading program data for programId:', this.programId);
    this.loading = true;
    this.error = null;

    forkJoin({
      program: this.programService.getById(this.programId),
      stages: this.programStageService.getByProgramId(this.programId),
      companies: this.companyStageService.getCompaniesByProgram(this.programId)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ program, stages, companies }) => {
        console.log('Program data loaded:', { program, stages, companies });
        this.program = program;
        this.stages = stages;
        this.companies = companies;
        this.loading = false;

        if (this.stages.length > 0 && !this.selectedStage) {
          this.selectedStage = this.stages[0];
        }
      },
      error: (error) => {
        console.error('Error loading program data:', error);
        this.error = 'Failed to load program data. Please try again.';
        this.loading = false;
      }
    });
  }

  // Stage Management
  selectStage(stage: IProgramStage) {
    this.selectedStage = stage;
    this.selectedCompanies = [];
  }

  getCompaniesInStage(stageId: number): ICompanyStageView[] {
    if (!stageId) return [];
    return this.companies.filter(company => company.current_stage_id === stageId);
  }

  // Company Selection Methods
  toggleCompanySelection(companyId: number) {
    const index = this.selectedCompanies.indexOf(companyId);
    if (index > -1) {
      this.selectedCompanies.splice(index, 1);
    } else {
      this.selectedCompanies.push(companyId);
    }
  }

  // Company Advancement
  advanceSelectedCompanies() {
    if (this.selectedCompanies.length === 0 || !this.selectedStage?.id) return;

    const nextStage = this.getNextStage(this.selectedStage);
    if (!nextStage) {
      alert('No next stage available for advancement.');
      return;
    }

    const advancePromises = this.selectedCompanies.map((companyId: number) =>
      this.companyStageService.advanceToNextStage(companyId, this.selectedStage!.id!)
    );

    Promise.all(advancePromises).then(() => {
      this.selectedCompanies = [];
      this.loadProgramData();
    }).catch(error => {
      console.error('Error advancing companies:', error);
      alert('Error advancing some companies. Please try again.');
    });
  }

  advanceSingleCompany(companyId: number) {
    if (!this.selectedStage?.id) return;

    const nextStage = this.getNextStage(this.selectedStage);
    if (!nextStage) {
      alert('No next stage available for advancement.');
      return;
    }

    this.companyStageService.advanceToNextStage(companyId, this.selectedStage.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeCompanyDetails();
          this.loadProgramData();
          alert('Company successfully advanced to next stage.');
        },
        error: (error) => {
          console.error('Error advancing company:', error);
          alert('Error advancing company. Please try again.');
        }
      });
  }

  getNextStage(currentStage: IProgramStage): IProgramStage | null {
    const currentIndex = this.stages.findIndex(s => s.id === currentStage.id);
    return currentIndex >= 0 && currentIndex < this.stages.length - 1
      ? this.stages[currentIndex + 1]
      : null;
  }

  canAdvanceToNextStage(currentStageId: number): boolean {
    if (!currentStageId) return false;
    const currentIndex = this.stages.findIndex(s => s.id === currentStageId);
    return currentIndex >= 0 && currentIndex < this.stages.length - 1;
  }

  getCanAdvanceCompany(): boolean {
    if (!this.selectedCompanyForDetails?.current_stage_id) return false;
    return this.canAdvanceToNextStage(this.selectedCompanyForDetails.current_stage_id);
  }

  // Statistics Methods
  showStageStatistics() {
    if (!this.selectedStage?.id) return;

    this.companyStageService.getStageStatistics(this.selectedStage.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stageStatistics = stats;
          this.showingStatistics = true;
        },
        error: (error) => {
          console.error('Error loading statistics:', error);
          alert('Error loading stage statistics.');
        }
      });
  }

  hideStatistics() {
    this.showingStatistics = false;
    this.stageStatistics = null;
  }

  // Company Details
  viewCompanyDetails(company: ICompanyStageView) {
    this.selectedCompanyForDetails = company;
  }

  closeCompanyDetails() {
    this.selectedCompanyForDetails = null;
  }

  // Export
  exportStageData() {
    if (!this.selectedStage?.id || !this.program) return;

    const companiesInStage = this.getCompaniesInStage(this.selectedStage.id);
    const exportData = {
      program: this.program.name,
      stage: this.selectedStage.title,
      exportDate: new Date().toISOString(),
      companies: companiesInStage.map(company => ({
        name: company.company_name,
        sector: company.sector,
        entryDate: company.stage_entered_at,
        currentStage: company.current_stage_title
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.program.name}-${this.selectedStage.title}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Helper Methods
  calculateAverageStageTime(): number {
    if (this.companies.length === 0) return 0;

    const totalDays = this.companies.reduce((sum, company) => {
      const entryDate = company.stage_entered_at;
      return sum + (entryDate ? this.calculateDaysInStage(entryDate) : 0);
    }, 0);

    return Math.round(totalDays / this.companies.length);
  }

  calculateCompletionRate(): number {
    if (this.stages.length === 0 || this.companies.length === 0) return 0;

    const lastStageId = this.stages[this.stages.length - 1]?.id;
    if (!lastStageId) return 0;

    const completedCompanies = this.companies.filter(c => c.current_stage_id === lastStageId).length;
    return Math.round((completedCompanies / this.companies.length) * 100);
  }

  private calculateDaysInStage(entryDate: string): number {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Modal Actions (placeholders for future implementation)
  openCreateStageModal(): void {
    this.showCreateStageModal = true;
  }

  openStageTemplatesModal(): void {
    this.showTemplatesModal = true;
  }

  openBulkActionsModal(): void {
    this.showBulkActionsModal = true;
  }

  openAnalyticsModal(): void {
    this.showAnalyticsModal = true;
  }

  // Stage Management Actions (placeholders for future implementation)
  editStage(stage: IProgramStage): void {
    console.log('Editing stage:', stage);
  }

  deleteStage(stage: IProgramStage): void {
    if (confirm(`Are you sure you want to delete the stage "${stage.title}"?`)) {
      console.log('Deleting stage:', stage);
    }
  }

  duplicateStage(stage: IProgramStage): void {
    if (confirm(`Create a duplicate of "${stage.title}"?`)) {
      console.log('Duplicating stage:', stage);
    }
  }

  viewStageDetails(stage: IProgramStage): void {
    console.log('Viewing stage details:', stage);
  }

  bulkAdvanceFromStage(stage: IProgramStage): void {
    if (!stage.id) return;

    const companies = this.getCompaniesInStage(stage.id);
    if (companies.length === 0) {
      alert('No companies in this stage to advance.');
      return;
    }

    if (confirm(`Advance all ${companies.length} companies from "${stage.title}" to the next stage?`)) {
      const nextStage = this.getNextStage(stage);
      if (!nextStage) {
        alert('No next stage available for advancement.');
        return;
      }

      const advancePromises = companies.map(company =>
        this.companyStageService.advanceToNextStage(company.company_id, stage.id!)
      );

      Promise.all(advancePromises).then(() => {
        this.loadProgramData();
        alert(`Successfully advanced ${companies.length} companies to "${nextStage.title}".`);
      }).catch(error => {
        console.error('Error in bulk advance:', error);
        alert('Error advancing some companies. Please try again.');
      });
    }
  }

  // Company Management Actions (placeholders for future implementation)
  editCompanyStageInfo(company: ICompanyStageView): void {
    console.log('Editing company stage info:', company);
  }

  viewCompanyHistory(companyId: number): void {
    console.log('Viewing company history for ID:', companyId);
  }

  // Modal Event Handlers
  onStageCreated(stage: IProgramStage): void {
    console.log('Stage created:', stage);
    this.showCreateStageModal = false;
    this.loadProgramData(); // Refresh data
  }

  onTemplateApplied(stages: IProgramStage[]): void {
    console.log('Template applied:', stages);
    this.showTemplatesModal = false;
    this.loadProgramData(); // Refresh data
  }

  onBulkActionCompleted(result: any): void {
    console.log('Bulk action completed:', result);
    this.showBulkActionsModal = false;
    this.loadProgramData(); // Refresh data
  }
}
