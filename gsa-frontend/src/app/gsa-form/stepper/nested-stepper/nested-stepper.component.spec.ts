import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedStepperComponent } from './nested-stepper.component';

describe('NestedStepperComponent', () => {
  let component: NestedStepperComponent;
  let fixture: ComponentFixture<NestedStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NestedStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
