// src/services/form-validation.service.ts

import { Injectable } from '@angular/core';
import {
  IFormField,
  IFormGroup,
  IValidationResult,
  IValidationRule,
  FormFieldType
} from '../models/mentorship-form.interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {

  constructor() {}

  // Validate a complete group
  validateGroup(group: IFormGroup, values: { [fieldKey: string]: any }): IValidationResult {
    const errors: { [fieldKey: string]: string[] } = {};
    let isValid = true;

    group.fields.forEach(field => {
      const fieldErrors = this.validateField(field, values[field.key]);
      if (fieldErrors.length > 0) {
        errors[field.key] = fieldErrors;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  // Validate a single field
  validateField(field: IFormField, value: any): string[] {
    const errors: string[] = [];

    // Required field validation
    if (field.required && this.isEmpty(value)) {
      errors.push(`${field.label} is required`);
      return errors; // Stop further validation if required field is empty
    }

    // Skip validation if field is empty and not required
    if (this.isEmpty(value)) {
      return errors;
    }

    // Type-specific validation
    switch (field.type) {
      case 'number':
        errors.push(...this.validateNumber(field, value));
        break;
      case 'text':
      case 'textarea':
        errors.push(...this.validateText(field, value));
        break;
      case 'date':
        errors.push(...this.validateDate(field, value));
        break;
      case 'select':
        errors.push(...this.validateSelect(field, value));
        break;
      case 'rating':
        errors.push(...this.validateRating(field, value));
        break;
      case 'boolean':
        errors.push(...this.validateBoolean(field, value));
        break;
      case 'table':
        errors.push(...this.validateTable(field, value));
        break;
    }

    return errors;
  }

  // Check if value is empty
  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  // Validate number fields
  private validateNumber(field: IFormField, value: any): string[] {
    const errors: string[] = [];
    const numValue = Number(value);

    if (isNaN(numValue)) {
      errors.push(`${field.label} must be a valid number`);
      return errors;
    }

    // Add custom min/max validation if needed
    // This could be extended with field.min, field.max properties

    return errors;
  }

  // Validate text fields
  private validateText(field: IFormField, value: any): string[] {
    const errors: string[] = [];
    const strValue = String(value);

    if (field.type === 'text' && strValue.length > 255) {
      errors.push(`${field.label} must be less than 255 characters`);
    }

    if (field.type === 'textarea' && strValue.length > 5000) {
      errors.push(`${field.label} must be less than 5000 characters`);
    }

    return errors;
  }

  // Validate email fields
  private validateEmail(field: IFormField, value: any): string[] {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(String(value))) {
      errors.push(`${field.label} must be a valid email address`);
    }

    return errors;
  }

  // Validate date fields
  private validateDate(field: IFormField, value: any): string[] {
    const errors: string[] = [];
    const dateValue = new Date(value);

    if (isNaN(dateValue.getTime())) {
      errors.push(`${field.label} must be a valid date`);
    }

    return errors;
  }

  // Validate select fields
  private validateSelect(field: IFormField, value: any): string[] {
    const errors: string[] = [];

    if (field.options && !field.options.includes(String(value))) {
      errors.push(`${field.label} must be one of the available options`);
    }

    return errors;
  }

  // Validate rating fields
  private validateRating(field: IFormField, value: any): string[] {
    const errors: string[] = [];
    const numValue = Number(value);

    if (isNaN(numValue) || numValue < 1 || numValue > 10) {
      errors.push(`${field.label} must be a rating between 1 and 10`);
    }

    return errors;
  }

  // Validate boolean fields
  private validateBoolean(field: IFormField, value: any): string[] {
    const errors: string[] = [];

    if (typeof value !== 'boolean') {
      errors.push(`${field.label} must be true or false`);
    }

    return errors;
  }

  // Validate table fields
  private validateTable(field: IFormField, value: any): string[] {
    const errors: string[] = [];

    if (!Array.isArray(value)) {
      errors.push(`${field.label} must be a table with rows`);
      return errors;
    }

    if (value.length === 0) {
      errors.push(`${field.label} must have at least one row`);
      return errors;
    }

    // Validate each row
    value.forEach((row, rowIndex) => {
      if (!field.columns) return;

      field.columns.forEach(column => {
        if (column.required && this.isEmpty(row[column.key])) {
          errors.push(`${field.label} row ${rowIndex + 1}: ${column.label} is required`);
        }

        // Validate column value based on its type
        if (!this.isEmpty(row[column.key])) {
          const columnField: IFormField = {
            key: column.key,
            label: `${field.label} - ${column.label}`,
            type: column.type,
            required: column.required
          };

          const columnErrors = this.validateField(columnField, row[column.key]);
          errors.push(...columnErrors);
        }
      });
    });

    return errors;
  }

  // Create validation rules for a field
  createValidationRules(field: IFormField): IValidationRule[] {
    const rules: IValidationRule[] = [];

    if (field.required) {
      rules.push({
        type: 'required',
        message: `${field.label} is required`,
        validator: (value: any) => !this.isEmpty(value)
      });
    }

    switch (field.type) {
      case 'number':
        rules.push({
          type: 'custom',
          message: `${field.label} must be a valid number`,
          validator: (value: any) => !value || !isNaN(Number(value))
        });
        break;

      case 'rating':
        rules.push({
          type: 'custom',
          message: `${field.label} must be between 1 and 10`,
          validator: (value: any) => {
            if (!value) return true;
            const num = Number(value);
            return !isNaN(num) && num >= 1 && num <= 10;
          }
        });
        break;
    }

    return rules;
  }

  // Validate entire form values
  validateFormValues(groups: IFormGroup[], values: { [groupKey: string]: { [fieldKey: string]: any } }): IValidationResult {
    const errors: { [fieldKey: string]: string[] } = {};
    let isValid = true;

    groups.forEach(group => {
      const groupValues = values[group.key] || {};
      const groupValidation = this.validateGroup(group, groupValues);

      if (!groupValidation.isValid) {
        Object.assign(errors, groupValidation.errors);
        isValid = false;
      }
    });

    return { isValid, errors };
  }
}
