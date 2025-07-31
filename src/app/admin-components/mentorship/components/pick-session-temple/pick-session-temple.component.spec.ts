import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickSessionTemplateComponent } from './pick-session-temple.component';

describe('PickSessionTemplateComponent', () => {
  let component: PickSessionTemplateComponent;
  let fixture: ComponentFixture<PickSessionTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickSessionTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickSessionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
