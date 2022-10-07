import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisToolsComponent } from './analysis-tools.component';

describe('AnalysisToolsComponent', () => {
  let component: AnalysisToolsComponent;
  let fixture: ComponentFixture<AnalysisToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
