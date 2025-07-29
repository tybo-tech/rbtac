import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { IProgramStage, ICompanyStageView, IStageStatistics, IProgram } from '../../../models/schema';
import { ProgramStageService } from '../../../services/betta/program-stage.service';
import { CompanyProgramStageService } from '../../../services/betta/company-program-stage.service';

@Component({
  selector: 'app-stage-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stage-manager.component.html',
  styleUrl: './stage-manager.component.scss'
})
export class StageManagerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) program!: IProgram;

  private destroy$ = new Subject<void>();

  // Data
  stages: IProgramStage[] = [];
  companies: ICompanyStageView[] = [];
  statistics: IStageStatistics[] = [];

  // UI State
  loading = false;
  selectedCompany: ICompanyStageView | null = null;
  showAdvanceModal = false;
  showMoveModal = false;
  targetStageId: number | null = null;

  // Filters
  stageFilter: number | null = null;
  searchTerm = '';

  constructor(
    private programStageService: ProgramStageService,
    private companyStageService: CompanyProgramStageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    if (!this.program?.id) return;

    this.loading = true;

    forkJoin({
      stages: this.programStageService.getByProgramId(this.program.id),
      companies: this.companyStageService.getCompaniesByProgram(this.program.id),
      statistics: this.companyStageService.getStageStatistics(this.program.id)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ stages, companies, statistics }) => {
        this.stages = stages;
        this.companies = companies;
        this.statistics = statistics;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stage data:', error);
        this.loading = false;
      }
    });
  }

  get filteredCompanies(): ICompanyStageView[] {
    let filtered = this.companies;

    // Filter by stage
    if (this.stageFilter) {
      filtered = filtered.filter(c => c.current_stage_id === this.stageFilter);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.company_name?.toLowerCase().includes(term) ||
        c.sector?.toLowerCase().includes(term) ||
        c.current_stage_title?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  get companiesWithoutStage(): ICompanyStageView[] {
    return this.companies.filter(c => !c.current_stage_id);
  }

  getStageTitle(stageId: number): string {
    const stage = this.stages.find(s => s.id === stageId);
    return stage?.title || 'Unknown Stage';
  }

  getNextStage(currentStageOrder: number): IProgramStage | null {
    return this.stages.find(s => s.stage_order === (currentStageOrder + 1)) || null;
  }

  canAdvance(company: ICompanyStageView): boolean {
    if (!company.current_stage_order) return false;
    return this.getNextStage(company.current_stage_order) !== null;
  }

  openAdvanceModal(company: ICompanyStageView) {
    this.selectedCompany = company;
    this.showAdvanceModal = true;
  }

  openMoveModal(company: ICompanyStageView) {
    this.selectedCompany = company;
    this.showMoveModal = true;
    this.targetStageId = null;
  }

  closeModals() {
    this.showAdvanceModal = false;
    this.showMoveModal = false;
    this.selectedCompany = null;
    this.targetStageId = null;
  }

  advanceCompany() {
    if (!this.selectedCompany || !this.program.id) return;

    this.loading = true;
    this.companyStageService.advanceToNextStage(
      this.selectedCompany.company_id,
      this.program.id,
      1 // TODO: Get actual user ID from auth service
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.closeModals();
        this.loadData(); // Refresh data
      },
      error: (error) => {
        console.error('Error advancing company:', error);
        this.loading = false;
      }
    });
  }

  moveCompany() {
    if (!this.selectedCompany || !this.program.id || !this.targetStageId) return;

    this.loading = true;
    this.companyStageService.moveToStage(
      this.selectedCompany.company_id,
      this.program.id,
      this.targetStageId,
      1 // TODO: Get actual user ID from auth service
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.closeModals();
        this.loadData(); // Refresh data
      },
      error: (error) => {
        console.error('Error moving company:', error);
        this.loading = false;
      }
    });
  }

  assignToFirstStage(company: ICompanyStageView) {
    if (!this.program.id || this.stages.length === 0) return;

    const firstStage = this.stages.find(s => s.stage_order === 1);
    if (!firstStage?.id) return;

    this.loading = true;
    this.companyStageService.createStageRecord(
      company.company_id,
      this.program.id,
      firstStage.id,
      1 // TODO: Get actual user ID from auth service
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.loadData(); // Refresh data
      },
      error: (error) => {
        console.error('Error assigning company to first stage:', error);
        this.loading = false;
      }
    });
  }

  getStageStatistics(stageId: number): IStageStatistics | undefined {
    return this.statistics.find(s => s.stage_id === stageId);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  }

  getBadgeClass(stageOrder: number | undefined): string {
    if (!stageOrder) return 'bg-gray-100 text-gray-800';

    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];

    return colors[(stageOrder - 1) % colors.length];
  }
}
