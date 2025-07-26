import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCanvasComponent } from './collection-canvas.component';

describe('CollectionCanvasComponent', () => {
  let component: CollectionCanvasComponent;
  let fixture: ComponentFixture<CollectionCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
