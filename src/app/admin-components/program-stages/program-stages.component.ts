import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { IProgram, ICompany, IProgramStage, ICompanyStageView } from '../../../models/schema';
import { ProgramService } from '../../../services/betta/programs.service';
import { CompanyService } from '../../../services/betta/companies.service';
import { ProgramStageService } from '../../../services/betta/program-stage.service';
import { CompanyProgramStageService } from '../../../services/betta/company-program-stage.service';

@Component({
  selector: 'app-program-stages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-stages.component.html',
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
  selectedCompany: ICompany | null = null;
  selectedStage: IProgramStage | null = null;
  selectedCompanies: number[] = [];
  selectedCompanyForDetails: ICompanyStageView | null = null;

  // Statistics
  showingStatistics = false;
  stageStatistics: any = null;

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

  selectStage(stage: IProgramStage) {
    this.selectedStage = stage;
    this.selectedCompany = null;
  }

  getCompaniesInStage(stageId: number): ICompanyStageView[] {
    return this.companies.filter(company => company.current_stage_id === stageId);
  }

  onStageChanged(event: { companyId: number, newStageId: number }) {
    this.loadProgramData();
  }

  onCompanyMoved(event: { companyId: number, fromStageId: number, toStageId: number }) {
    this.loadProgramData();
  }

  onStageDataUpdated(event: { companyId: number, stageId: number, data: any }) {
    console.log('Stage data updated:', event);
  }

  closeDataCapture() {
    this.selectedCompany = null;
  }

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

  getNextStage(currentStage: IProgramStage): IProgramStage | null {
    const currentIndex = this.stages.findIndex(s => s.id === currentStage.id);
    return currentIndex >= 0 && currentIndex < this.stages.length - 1
      ? this.stages[currentIndex + 1]
      : null;
  }

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
  // Company Selection Methods
  toggleCompanySelection(companyId: number) {
    const index = this.selectedCompanies.indexOf(companyId);
    if (index > -1) {
      this.selectedCompanies.splice(index, 1);
    } else {
      this.selectedCompanies.push(companyId);
    }
  }

  // Company Details Methods
  viewCompanyDetails(company: ICompanyStageView) {
    this.selectedCompanyForDetails = company;
  }

  closeCompanyDetails() {
    this.selectedCompanyForDetails = null;
  }

  calculateDaysInStage(entryDate: string): number {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Stage Navigation Methods
  canAdvanceToNextStage(currentStageId: number): boolean {
    const currentIndex = this.stages.findIndex(s => s.id === currentStageId);
    return currentIndex >= 0 && currentIndex < this.stages.length - 1;
  }

  advanceSingleCompany(companyId: number) {
    if (!this.selectedCompanyForDetails || !this.selectedStage?.id) return;

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
}
