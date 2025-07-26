import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [CommonModule],
})
export class ToastComponent implements OnInit {
  @Input() message: string = 'Hello';
  @Input() className: string = 'info';
  @Output() hideEvent = new EventEmitter();
  classes: string[] = ['bi', 'bi-info-circle-fill'];
  ngOnInit() {
    this.autoHide();
    this.getClass();
  }
  getClass() {
    switch (this.className) {
      case 'info':
        this.classes.push('border-info', 'text-info');
        break;
      case 'success':
        this.classes.push('border-success', 'text-success');
        break;
      case 'warning':
        this.classes.push('border-warning', 'text-warning');
        break;
      case 'error':
        this.classes.push('border-error', 'text-error');
        break;
    }
  }

  closeToast() {
    this.hideEvent.emit();
  }

  private autoHide() {
    setTimeout(() => {
      this.closeToast();
    }, 4000);
  }
}
