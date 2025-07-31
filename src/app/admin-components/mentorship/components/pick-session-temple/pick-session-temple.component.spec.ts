import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickSessionTempleComponent } from './pick-session-temple.component';

describe('PickSessionTempleComponent', () => {
  let component: PickSessionTempleComponent;
  let fixture: ComponentFixture<PickSessionTempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickSessionTempleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickSessionTempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
