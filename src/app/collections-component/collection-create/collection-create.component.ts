import { Component, EventEmitter, Output } from '@angular/core';
import { DynamicFormComponent } from '../../accounts/shared/dynamic-form/dynamic-form.component';
import { DynamicFormService } from '../../accounts/shared/dynamic-form/dynamic-form.service';
import { FormInputGroup } from '../../../models/FormInput';
import { ClickOutsideDirective } from '../../../directives/click.outside.directive';

@Component({
  selector: 'app-collection-create',
  imports: [DynamicFormComponent, ClickOutsideDirective],
  templateUrl: './collection-create.component.html',
  styleUrl: './collection-create.component.scss',
})
export class CollectionCreateComponent {
  @Output() onCloseModal = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();
  formGroups: FormInputGroup[];
  constructor(private formService: DynamicFormService) {
    this.formGroups = this.formService.getCollectionFormInputs();
  }
 
}
