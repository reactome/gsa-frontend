import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCellsComponent } from './edit-cells.component';

describe('EditCellsComponent', () => {
  let component: EditCellsComponent;
  let fixture: ComponentFixture<EditCellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCellsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
