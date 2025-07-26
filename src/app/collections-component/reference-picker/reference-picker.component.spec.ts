import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePickerComponent } from './reference-picker.component';

describe('ReferencePickerComponent', () => {
  let component: ReferencePickerComponent;
  let fixture: ComponentFixture<ReferencePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferencePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferencePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
