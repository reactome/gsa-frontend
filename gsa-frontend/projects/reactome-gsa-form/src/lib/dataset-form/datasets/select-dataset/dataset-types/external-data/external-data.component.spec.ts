import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExternalDataComponent} from './external-data.component';

describe('ImportDataComponent', () => {
  let component: ExternalDataComponent;
  let fixture: ComponentFixture<ExternalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
