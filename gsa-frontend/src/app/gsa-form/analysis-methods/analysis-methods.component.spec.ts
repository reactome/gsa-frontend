import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisMethodsComponent } from './analysis-methods.component';

describe('AnalysisToolsComponent', () => {
  let component: AnalysisMethodsComponent;
  let fixture: ComponentFixture<AnalysisMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
