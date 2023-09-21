import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSnackbarComponent } from './warning-snackbar.component';

describe('WarningSnackbarComponent', () => {
  let component: WarningSnackbarComponent;
  let fixture: ComponentFixture<WarningSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
