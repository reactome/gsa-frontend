import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAnalysisParamsComponent } from './change-analysis-params.component';

describe('ChangeAnalysisParamsComponent', () => {
  let component: ChangeAnalysisParamsComponent;
  let fixture: ComponentFixture<ChangeAnalysisParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAnalysisParamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeAnalysisParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
