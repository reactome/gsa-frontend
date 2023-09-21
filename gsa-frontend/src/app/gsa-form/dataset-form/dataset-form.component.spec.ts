import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DatasetFormComponent} from './dataset-form.component';

describe('NestedStepperComponent', () => {
  let component: DatasetFormComponent;
  let fixture: ComponentFixture<DatasetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
