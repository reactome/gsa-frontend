import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisLoadingProgressComponent } from './analysis-loading-progress.component';

describe('AnalysisLoadingProgressComponent', () => {
  let component: AnalysisLoadingProgressComponent;
  let fixture: ComponentFixture<AnalysisLoadingProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisLoadingProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisLoadingProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
