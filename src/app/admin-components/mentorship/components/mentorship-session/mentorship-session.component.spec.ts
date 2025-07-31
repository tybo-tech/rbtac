import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipSessionComponent } from './mentorship-session.component';

describe('MentorshipSessionComponent', () => {
  let component: MentorshipSessionComponent;
  let fixture: ComponentFixture<MentorshipSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorshipSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorshipSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
