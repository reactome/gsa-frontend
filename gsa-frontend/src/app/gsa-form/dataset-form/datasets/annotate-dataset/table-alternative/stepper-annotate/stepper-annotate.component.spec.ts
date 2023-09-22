import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperAnnotateComponent } from './stepper-annotate.component';

describe('StepperAnnotateComponent', () => {
  let component: StepperAnnotateComponent;
  let fixture: ComponentFixture<StepperAnnotateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperAnnotateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperAnnotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
