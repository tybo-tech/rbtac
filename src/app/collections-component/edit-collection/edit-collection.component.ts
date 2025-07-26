import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICollection } from '../../../models/ICollection';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click.outside.directive';

@Component({
  selector: 'app-edit-collection',
  imports: [NgIf, FormsModule, NgClass, ClickOutsideDirective],
  templateUrl: './edit-collection.component.html',
  styleUrl: './edit-collection.component.scss',
})
export class EditCollectionComponent {
  @Input({required: true}) collection!: ICollection;
  @Output() onSubmit = new EventEmitter<ICollection>();
  @Output() onCloseModal = new EventEmitter<void>();
}
