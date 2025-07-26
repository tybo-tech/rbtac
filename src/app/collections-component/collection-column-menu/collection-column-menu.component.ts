import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IColumn } from '../../../models/ICollection';
import { ClickOutsideDirective } from '../../../directives/click.outside.directive';

@Component({
  selector: 'app-collection-column-menu',
  imports: [ClickOutsideDirective],
  templateUrl: './collection-column-menu.component.html',
  styleUrl: './collection-column-menu.component.scss',
})
export class CollectionColumnMenuComponent {
  @Input() column!: IColumn;
  @Output() onEditColumn = new EventEmitter<IColumn>();
  @Output() onDeleteColumn = new EventEmitter<IColumn>();
  @Output() onMoveLeft = new EventEmitter<IColumn>();
  @Output() onMoveRight = new EventEmitter<IColumn>();
  @Output() onCloseModal = new EventEmitter<void>();
  delete() {
    if (
      !confirm(
        `Are you sure you want to delete the column "${this.column.name}"?`
      )
    ) {
      return;
    }
    this.onDeleteColumn.emit(this.column);
    this.onCloseModal.emit();
  }
}
