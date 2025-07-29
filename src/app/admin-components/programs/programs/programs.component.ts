import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { IProgram, IProgramStage, ICompanyProgramStage } from '../../../../models/schema';
import { ProgramService } from '../../../../services/betta/programs.service';
import { ProgramStageService } from '../../../../services/betta/program-stage.service';
import { CompanyProgramStageService } from '../../../../services/betta/company-program-stage.service';

interface IProgramWithStats extends IProgram {
  stageCount?: number;
  companyCount?: number;
  activeCompanies?: number;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  programs: IProgramWithStats[] = [];
  loading = false;
  error: string | null = null;

  // UI State
  showCreateModal = false;
  showEditModal = false;
  selectedProgram: IProgramWithStats | null = null;

  // Form Data
  newProgram: Partial<IProgram> = {
    name: '',
    description: ''
  };

  editProgram: Partial<IProgram> = {
    name: '',
    description: ''
  };

  constructor(
    private programService: ProgramService,
    private programStageService: ProgramStageService,
    private companyStageService: CompanyProgramStageService
  ) {
    console.log('ProgramsComponent initialized');
  }

  ngOnInit() {
    this.loadPrograms();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPrograms() {
    this.loading = true;
    this.error = null;

    console.log('Loading programs...');

    this.programService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (programs) => {
          console.log('Programs loaded:', programs);
          this.programs = programs;
          this.loadProgramStatistics();
        },
        error: (error) => {
          console.error('Error loading programs:', error);
          this.error = 'Failed to load programs. Please try again.';
          this.loading = false;
        }
      });
  }

  loadProgramStatistics() {
    if (this.programs.length === 0) {
      this.loading = false;
      return;
    }

    console.log('Loading program statistics...');

    // Create requests for each program's statistics
    const requests = this.programs.map(program =>
      forkJoin({
        stages: this.programStageService.getByProgramId(program.id!),
        companies: this.companyStageService.getCompaniesByProgram(program.id!)
      })
    );

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          console.log('Program statistics loaded:', results);

          results.forEach((result, index) => {
            this.programs[index].stageCount = result.stages.length;
            this.programs[index].companyCount = result.companies.length;
            this.programs[index].activeCompanies = result.companies.filter(c => c.current_stage_id).length;
          });

          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading program statistics:', error);
          // Still show programs even if statistics fail
          this.loading = false;
        }
      });
  }

  // Modal Methods
  openCreateModal() {
    this.newProgram = { name: '', description: '' };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.newProgram = { name: '', description: '' };
  }

  openEditModal(program: IProgramWithStats) {
    this.selectedProgram = program;
    this.editProgram = {
      id: program.id,
      name: program.name,
      description: program.description
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedProgram = null;
    this.editProgram = { name: '', description: '' };
  }

  // CRUD Operations
  createProgram() {
    if (!this.newProgram.name?.trim()) {
      alert('Program name is required');
      return;
    }

    console.log('Creating program:', this.newProgram);

    this.programService.add(this.newProgram as IProgram)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (program) => {
          console.log('Program created:', program);
          this.closeCreateModal();
          this.loadPrograms();
          alert('Program created successfully!');
        },
        error: (error) => {
          console.error('Error creating program:', error);
          alert('Error creating program. Please try again.');
        }
      });
  }

  updateProgram() {
    if (!this.editProgram.name?.trim()) {
      alert('Program name is required');
      return;
    }

    console.log('Updating program:', this.editProgram);

    this.programService.update(this.editProgram as IProgram)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (program) => {
          console.log('Program updated:', program);
          this.closeEditModal();
          this.loadPrograms();
          alert('Program updated successfully!');
        },
        error: (error) => {
          console.error('Error updating program:', error);
          alert('Error updating program. Please try again.');
        }
      });
  }

  deleteProgram(program: IProgramWithStats) {
    if (!confirm(`Are you sure you want to delete "${program.name}"? This action cannot be undone.`)) {
      return;
    }

    console.log('Deleting program:', program);

    this.programService.delete(program.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Program deleted');
          this.loadPrograms();
          alert('Program deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting program:', error);
          alert('Error deleting program. Please try again.');
        }
      });
  }

  // Navigation
  navigateToStages(programId: number) {
    console.log('Navigating to stages for program:', programId);
    // This will be handled by routerLink in template
  }

  retryLoad() {
    this.loadPrograms();
  }
}
