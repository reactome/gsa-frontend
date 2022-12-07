import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDatasetButtonComponent } from './add-dataset-button.component';

describe('AddDatasetButtonComponent', () => {
  let component: AddDatasetButtonComponent;
  let fixture: ComponentFixture<AddDatasetButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDatasetButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDatasetButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
