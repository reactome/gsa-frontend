import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportParameterComponent} from './import-parameter.component';

describe('ParameterComponent', () => {
  let component: ImportParameterComponent;
  let fixture: ComponentFixture<ImportParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
