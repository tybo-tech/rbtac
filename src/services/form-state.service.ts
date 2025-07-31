// src/services/form-state.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import {
  IFormState,
  IFormTemplate,
  FormSession,
  IFormNavigation,
  IValidationResult,
  ISyncStatus,
  IFormNotification
} from '../models/mentorship-form.interfaces';
import { FormSessionService } from './form-session.service';
import { FormValidationService } from './form-validation.service';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  private formStateSubject = new BehaviorSubject<IFormState>({
    template: null,
    session: null,
    currentGroup: 0,
    isSubmitting: false,
    isDirty: false,
    validationErrors: {},
    syncStatus: null
  });

  private navigationSubject = new BehaviorSubject<IFormNavigation>({
    currentGroupIndex: 0,
    totalGroups: 0,
    canNavigateNext: false,
    canNavigatePrevious: false,
    completedGroups: [],
    progress: 0
  });

  private notificationSubject = new BehaviorSubject<IFormNotification | null>(null);
  private autoSaveEnabled = true;
  private autoSaveInterval = 30000; // 30 seconds

  public formState$ = this.formStateSubject.asObservable();
  public navigation$ = this.navigationSubject.asObservable();
  public notification$ = this.notificationSubject.asObservable();

  constructor(
    private formSessionService: FormSessionService,
    private validationService: FormValidationService
  ) {
    this.initializeAutoSave();
  }

  // Initialize form with template and optional session
  initializeForm(template: IFormTemplate, session?: FormSession): void {
    const newState: IFormState = {
      template,
      session: session || null,
      currentGroup: 0,
      isSubmitting: false,
      isDirty: false,
      validationErrors: {},
      syncStatus: null
    };

    this.formStateSubject.next(newState);
    this.updateNavigation();

    if (session?.id) {
      this.checkSyncStatus(session.id);
    }
  }

  // Update form values
  updateFormValues(groupKey: string, fieldKey: string, value: any): void {
    const currentState = this.formStateSubject.value;
    if (!currentState.session) return;

    if (!currentState.session.values[groupKey]) {
      currentState.session.values[groupKey] = {};
    }

    currentState.session.values[groupKey][fieldKey] = value;

    const updatedState: IFormState = {
      ...currentState,
      isDirty: true,
      session: { ...currentState.session }
    };

    this.formStateSubject.next(updatedState);
    this.validateCurrentGroup();
  }

  // Navigate to specific group
  navigateToGroup(groupIndex: number): boolean {
    const currentState = this.formStateSubject.value;
    if (!currentState.template || !currentState.template.structure) return false;

    const maxIndex = currentState.template.structure.length - 1;
    if (groupIndex < 0 || groupIndex > maxIndex) return false;

    const updatedState: IFormState = {
      ...currentState,
      currentGroup: groupIndex
    };

    this.formStateSubject.next(updatedState);
    this.updateNavigation();
    return true;
  }

  // Navigate to next group
  navigateNext(): boolean {
    const currentState = this.formStateSubject.value;
    return this.navigateToGroup(currentState.currentGroup + 1);
  }

  // Navigate to previous group
  navigatePrevious(): boolean {
    const currentState = this.formStateSubject.value;
    return this.navigateToGroup(currentState.currentGroup - 1);
  }

  // Validate current group
  private validateCurrentGroup(): void {
    const currentState = this.formStateSubject.value;
    if (!currentState.template || !currentState.template.structure || !currentState.session) return;

    const currentGroup = currentState.template.structure[currentState.currentGroup];
    const groupValues = currentState.session.values[currentGroup.key] || {};

    const validationResult = this.validationService.validateGroup(currentGroup, groupValues);

    const updatedState: IFormState = {
      ...currentState,
      validationErrors: validationResult.errors
    };

    this.formStateSubject.next(updatedState);
    this.updateNavigation();
  }

  // Update navigation state
  private updateNavigation(): void {
    const currentState = this.formStateSubject.value;
    if (!currentState.template || !currentState.template.structure) return;

    const totalGroups = currentState.template.structure.length;
    const currentIndex = currentState.currentGroup;

    // Check which groups are completed
    const completedGroups = currentState.template.structure.map((group, index) => {
      const groupValues = currentState.session?.values[group.key] || {};
      const validation = this.validationService.validateGroup(group, groupValues);
      return validation.isValid;
    });

    const navigation: IFormNavigation = {
      currentGroupIndex: currentIndex,
      totalGroups,
      canNavigateNext: currentIndex < totalGroups - 1,
      canNavigatePrevious: currentIndex > 0,
      completedGroups,
      progress: (completedGroups.filter(Boolean).length / totalGroups) * 100
    };

    this.navigationSubject.next(navigation);
  }

  // Save form session
  saveForm(): Observable<boolean> {
    const currentState = this.formStateSubject.value;
    if (!currentState.session) return of(false);

    this.setSubmitting(true);

    return this.formSessionService.saveSessionWithSync(currentState.session).pipe(
      switchMap(response => {
        if (response.success && response.data) {
          const updatedState: IFormState = {
            ...currentState,
            session: response.data,
            isDirty: false,
            isSubmitting: false
          };
          this.formStateSubject.next(updatedState);
          this.showNotification('success', 'Form saved successfully!', '');
          return of(true);
        }
        return of(false);
      }),
      catchError(error => {
        this.setSubmitting(false);
        this.showNotification('error', 'Save failed', error.message || 'An error occurred while saving');
        return of(false);
      })
    );
  }

  // Auto-save functionality
  private initializeAutoSave(): void {
    if (this.autoSaveEnabled) {
      interval(this.autoSaveInterval).pipe(
        switchMap(() => {
          const currentState = this.formStateSubject.value;
          if (currentState.isDirty && currentState.session && !currentState.isSubmitting) {
            return this.formSessionService.autoSaveSession(currentState.session);
          }
          return of(null);
        })
      ).subscribe();
    }
  }

  // Check sync status
  private checkSyncStatus(sessionId: number): void {
    this.formSessionService.getSyncStatus(sessionId).subscribe(
      response => {
        if (response.success && response.data) {
          const currentState = this.formStateSubject.value;
          const updatedState: IFormState = {
            ...currentState,
            syncStatus: response.data
          };
          this.formStateSubject.next(updatedState);
        }
      }
    );
  }

  // Set submitting state
  private setSubmitting(isSubmitting: boolean): void {
    const currentState = this.formStateSubject.value;
    const updatedState: IFormState = {
      ...currentState,
      isSubmitting
    };
    this.formStateSubject.next(updatedState);
  }

  // Show notification
  showNotification(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string): void {
    const notification: IFormNotification = {
      type,
      title,
      message,
      duration: type === 'error' ? 5000 : 3000
    };
    this.notificationSubject.next(notification);
  }

  // Clear notification
  clearNotification(): void {
    this.notificationSubject.next(null);
  }

  // Reset form state
  resetForm(): void {
    this.formStateSubject.next({
      template: null,
      session: null,
      currentGroup: 0,
      isSubmitting: false,
      isDirty: false,
      validationErrors: {},
      syncStatus: null
    });

    this.navigationSubject.next({
      currentGroupIndex: 0,
      totalGroups: 0,
      canNavigateNext: false,
      canNavigatePrevious: false,
      completedGroups: [],
      progress: 0
    });
  }

  // Get current state
  getCurrentState(): IFormState {
    return this.formStateSubject.value;
  }

  // Get current navigation
  getCurrentNavigation(): IFormNavigation {
    return this.navigationSubject.value;
  }
}
