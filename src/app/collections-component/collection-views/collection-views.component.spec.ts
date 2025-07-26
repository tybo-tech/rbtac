import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionViewsComponent } from './collection-views.component';

describe('CollectionViewsComponent', () => {
  let component: CollectionViewsComponent;
  let fixture: ComponentFixture<CollectionViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionViewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
