import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GsaFormComponent} from './gsa-form.component';

describe('StepperComponent', () => {
  let component: GsaFormComponent;
  let fixture: ComponentFixture<GsaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GsaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
