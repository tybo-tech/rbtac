import { Injectable } from '@angular/core';
import {
  FormInput,
  FormInputGroup,
  FormInputOption,
  FormInputType,
} from '../../../../models/FormInput';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
  constructor() {}
  private create(
    key: string,
    label: string,
    type: FormInputType = 'text',
    required = false,
    placeholder = '',
    options: FormInputOption[] = []
  ): FormInput {
    return {
      key,
      label,
      type,
      required,
      placeholder,
      options,
    };
  }

  getCollectionFormInputs(): FormInputGroup[] {
    return [
      this.group([
        this.create(
          'name',
          'Collection Name',
          'text',
          true,
          'Enter collection name'
        ),
      ]),
    ];
  }
  getColumnFormInputs(): FormInputGroup[] {
    return [
      this.group([
        this.create(
          'name',
          'Column Name',
          'text',
          true,
          'Enter column name'
        ),
        this.create(
          'type',
          'Column Type',
          'select',
          true,
          '',
          [
            { value: 'text', label: 'Text' },
            { value: 'number', label: 'Number' },
            { value: 'date', label: 'Date' },
            { value: 'boolean', label: 'Boolean' },
            { value: 'array', label: 'Array' },
          ]
        ),
        this.create('isArray', 'Is Array', 'checkbox'),
        this.create('isPrimary', 'Is Primary Key', 'checkbox'),
        this.create('required', 'Required', 'checkbox'),
      ]),
    ];
  }
  group(inputs: FormInput[]): FormInputGroup {
    return {
      inputs,
    };
  }
}
