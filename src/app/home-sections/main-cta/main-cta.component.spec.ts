import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCtaComponent } from './main-cta.component';

describe('MainCtaComponent', () => {
  let component: MainCtaComponent;
  let fixture: ComponentFixture<MainCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
