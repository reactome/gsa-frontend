import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExternalParameterComponent} from './external-parameter.component';

describe('ParameterComponent', () => {
  let component: ExternalParameterComponent;
  let fixture: ComponentFixture<ExternalParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
