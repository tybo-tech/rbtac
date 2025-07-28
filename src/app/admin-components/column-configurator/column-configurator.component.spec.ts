import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnConfiguratorComponent } from './column-configurator.component';

describe('ColumnConfiguratorComponent', () => {
  let component: ColumnConfiguratorComponent;
  let fixture: ComponentFixture<ColumnConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
