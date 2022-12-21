import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnotateDatasetComponent} from './annotate-dataset.component';

describe('AnnotateDatasetComponent', () => {
  let component: AnnotateDatasetComponent;
  let fixture: ComponentFixture<AnnotateDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotateDatasetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotateDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
