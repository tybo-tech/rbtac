import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import {
  IProgramStage,
  ICompanyProgramStage,
  IDocument,
  ICompanyRevenue,
  ICompany,
  IProgram
} from '../../../models/schema';
import { CompanyProgramStageService } from '../../../services/betta/company-program-stage.service';
import { DocumentService } from '../../../services/betta/documents.service';
import { CompanyRevenueService } from '../../../services/betta/company-revenue.service';

@Component({
  selector: 'app-stage-data-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stage-data-capture.component.html',
  styleUrl: './stage-data-capture.component.scss'
})
export class StageDataCaptureComponent implements OnInit, OnDestroy {
  @Input({ required: true }) company!: ICompany;
  @Input({ required: true }) program!: IProgram;

  private destroy$ = new Subject<void>();

  // Data
  currentStage: ICompanyProgramStage | null = null;
  stageDocuments: IDocument[] = [];
  stageRevenues: ICompanyRevenue[] = [];

  // UI State
  loading = false;
  activeTab: 'documents' | 'revenues' | 'interviews' = 'documents';

  // Form data
  newDocument = {
    name: '',
    url: '',
    date_uploaded: new Date().toISOString().split('T')[0]
  };

  newRevenue = {
    revenue_amount: 0,
    opening_balance: 0,
    closing_balance: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  constructor(
    private companyStageService: CompanyProgramStageService,
    private documentsService: DocumentService,
    private revenueService: CompanyRevenueService
  ) {}

  ngOnInit() {
    this.loadCurrentStage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCurrentStage() {
    if (!this.company.id || !this.program.id) return;

    this.loading = true;
    this.companyStageService.getCurrentStage(this.company.id, this.program.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stage) => {
          this.currentStage = stage;
          if (stage?.program_stage_id) {
            this.loadStageData();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading current stage:', error);
          this.loading = false;
        }
      });
  }

  loadStageData() {
    if (!this.currentStage?.program_stage_id || !this.company.id) return;

    // Load stage-specific data
    forkJoin({
      documents: this.documentsService.getByStage(this.company.id, this.currentStage.program_stage_id),
      revenues: this.revenueService.getByStage(this.company.id, this.currentStage.program_stage_id)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ documents, revenues }) => {
        this.stageDocuments = documents;
        this.stageRevenues = revenues;
      },
      error: (error) => {
        console.error('Error loading stage data:', error);
      }
    });
  }

  setActiveTab(tab: 'documents' | 'revenues' | 'interviews') {
    this.activeTab = tab;
  }

  // Document Management
  uploadDocument() {
    if (!this.newDocument.name || !this.newDocument.url || !this.company.id || !this.currentStage?.program_stage_id) {
      return;
    }

    this.loading = true;
    const documentData = {
      ...this.newDocument,
      company_id: this.company.id,
      program_stage_id: this.currentStage.program_stage_id,
      created_by: 1 // TODO: Get from auth service
    };

    this.documentsService.save(documentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.resetDocumentForm();
          this.loadStageData();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error uploading document:', error);
          this.loading = false;
        }
      });
  }

  deleteDocument(documentId: number) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    this.loading = true;
    this.documentsService.delete(documentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadStageData();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting document:', error);
          this.loading = false;
        }
      });
  }

  resetDocumentForm() {
    this.newDocument = {
      name: '',
      url: '',
      date_uploaded: new Date().toISOString().split('T')[0]
    };
  }

  // Revenue Management
  addRevenue() {
    if (!this.company.id || !this.currentStage?.program_stage_id) return;

    this.loading = true;
    const revenueData = {
      ...this.newRevenue,
      company_id: this.company.id,
      program_stage_id: this.currentStage.program_stage_id,
      created_by: 1 // TODO: Get from auth service
    };

    this.revenueService.save(revenueData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.resetRevenueForm();
          this.loadStageData();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding revenue:', error);
          this.loading = false;
        }
      });
  }

  deleteRevenue(revenueId: number) {
    if (!confirm('Are you sure you want to delete this revenue record?')) return;

    this.loading = true;
    this.revenueService.delete(revenueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadStageData();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting revenue:', error);
          this.loading = false;
        }
      });
  }

  resetRevenueForm() {
    this.newRevenue = {
      revenue_amount: 0,
      opening_balance: 0,
      closing_balance: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    };
  }

  // Utility methods
  getStageTypeRequirements(): string[] {
    if (!this.currentStage?.stage_title) return [];

    const stageTitle = this.currentStage.stage_title.toLowerCase();

    if (stageTitle.includes('screening') || stageTitle.includes('application')) {
      return ['documents', 'company_profile'];
    } else if (stageTitle.includes('interview')) {
      return ['interviews', 'evaluations'];
    } else if (stageTitle.includes('funding') || stageTitle.includes('financial')) {
      return ['documents', 'revenues', 'bank_statements'];
    } else if (stageTitle.includes('monitoring') || stageTitle.includes('tracking')) {
      return ['revenues', 'reports', 'compliance'];
    }

    return ['documents', 'revenues'];
  }

  shouldShowDocuments(): boolean {
    return this.getStageTypeRequirements().includes('documents');
  }

  shouldShowRevenues(): boolean {
    return this.getStageTypeRequirements().includes('revenues');
  }

  shouldShowInterviews(): boolean {
    return this.getStageTypeRequirements().includes('interviews');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      default:
        return '📎';
    }
  }
}
