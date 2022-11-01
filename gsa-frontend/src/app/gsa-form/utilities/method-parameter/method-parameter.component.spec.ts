import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodParameterComponent } from './method-parameter.component';

describe('ShowParameterComponent', () => {
  let component: MethodParameterComponent;
  let fixture: ComponentFixture<MethodParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MethodParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
