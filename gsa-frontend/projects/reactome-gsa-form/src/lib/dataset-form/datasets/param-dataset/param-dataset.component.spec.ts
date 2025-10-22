import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamDatasetComponent } from './param-dataset.component';

describe('ParamDatasetComponent', () => {
  let component: ParamDatasetComponent;
  let fixture: ComponentFixture<ParamDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamDatasetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
