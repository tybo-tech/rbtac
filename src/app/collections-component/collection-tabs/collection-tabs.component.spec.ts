import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTabsComponent } from './collection-tabs.component';

describe('CollectionTabsComponent', () => {
  let component: CollectionTabsComponent;
  let fixture: ComponentFixture<CollectionTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
