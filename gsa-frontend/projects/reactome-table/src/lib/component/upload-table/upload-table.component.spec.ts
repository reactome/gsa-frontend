import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTableComponent } from './upload-table.component';

describe('AddDatasetButtonComponent', () => {
  let component: UploadTableComponent;
  let fixture: ComponentFixture<UploadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
