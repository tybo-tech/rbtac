import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectFrequencyComponent } from './multi-select-frequency.component';

describe('MultiSelectFrequencyComponent', () => {
  let component: MultiSelectFrequencyComponent;
  let fixture: ComponentFixture<MultiSelectFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectFrequencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
