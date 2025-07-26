import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    OnDestroy,
    Output,
    Renderer2
  } from '@angular/core';
  
  @Directive({
    selector: '[appClickOutside]'
  })
  export class ClickOutsideDirective implements OnDestroy {
    @Output() clickOutside = new EventEmitter<void>();
  
    private unlisten: () => void;
  
    constructor(private elRef: ElementRef, private renderer: Renderer2) {
      this.unlisten = this.renderer.listen('document', 'click', (event: Event) => {
        const clickedInside = this.elRef.nativeElement.contains(event.target);
        if (!clickedInside) {
          this.clickOutside.emit();
        }
      });
    }
  
    ngOnDestroy() {
      this.unlisten(); // Clean up the listener when directive is destroyed
    }
  }

  /*
  Usage:
    <div appClickOutside (clickOutside)="showDropdown = false">
        <!-- Your content here -->
    </div>
  */
  