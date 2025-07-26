import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionColumnMenuComponent } from './collection-column-menu.component';

describe('CollectionColumnMenuComponent', () => {
  let component: CollectionColumnMenuComponent;
  let fixture: ComponentFixture<CollectionColumnMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionColumnMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionColumnMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
