import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDistributionComponent } from './date-distribution.component';

describe('DateDistributionComponent', () => {
  let component: DateDistributionComponent;
  let fixture: ComponentFixture<DateDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
