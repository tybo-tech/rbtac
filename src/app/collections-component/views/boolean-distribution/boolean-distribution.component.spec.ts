import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanDistributionComponent } from './boolean-distribution.component';

describe('BooleanDistributionComponent', () => {
  let component: BooleanDistributionComponent;
  let fixture: ComponentFixture<BooleanDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooleanDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooleanDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
