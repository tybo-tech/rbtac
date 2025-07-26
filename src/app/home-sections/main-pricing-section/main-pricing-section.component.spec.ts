import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPricingSectionComponent } from './main-pricing-section.component';

describe('MainPricingSectionComponent', () => {
  let component: MainPricingSectionComponent;
  let fixture: ComponentFixture<MainPricingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPricingSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPricingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
