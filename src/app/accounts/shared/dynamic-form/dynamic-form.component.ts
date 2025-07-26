import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { UploadInputComponent } from '../upload-input/upload-input.component';
import { RouterModule } from '@angular/router';
import { FormInputGroup } from '../../../../models/FormInput';


@Component({
  selector: 'app-dynamic-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UploadInputComponent,
    RouterModule,
  ],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnChanges {
  @Input() itemCollectionId!: string;
  @Input() formTitle = 'Form';
  @Input() subtitle = '';
  @Input() submitLabel = 'Save';
  @Input() cancelLabel = '';
  @Input() submitClass = '';
  @Input() loading = false;
  @Input() showBack = false;
  @Input() formGroups: FormInputGroup[] = [];
  @Input() initialData: any = {};
  @Input() redirect = {
    label: '',
    url: '',
  };
  @Output() submitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Only regenerate form if inputs or initialData change
    if (changes['formGroups'] || changes['initialData']) {
      this.buildForm();
    }
  }
  goBack() {
    this.location.back();
  }
 private buildForm(): void {
  const group: any = {};
  this.formGroups.forEach((fg) => {
    fg.inputs.forEach((input) => {
      group[input.key] = [
        this.initialData[input.key] || '',
        input.required ? Validators.required : [],
      ];
    });
  });
  this.form = this.fb.group(group);
}

  submit(): void {
    if (this.form.invalid) return;
    this.submitted.emit(this.form.value);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
