import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTestimonialsComponent } from './main-testimonials.component';

describe('MainTestimonialsComponent', () => {
  let component: MainTestimonialsComponent;
  let fixture: ComponentFixture<MainTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
