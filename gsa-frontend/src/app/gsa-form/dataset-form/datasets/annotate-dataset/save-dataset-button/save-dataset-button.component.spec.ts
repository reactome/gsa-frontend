import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDatasetButtonComponent } from './save-dataset-button.component';

describe('SaveDatasetButtonComponent', () => {
  let component: SaveDatasetButtonComponent;
  let fixture: ComponentFixture<SaveDatasetButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveDatasetButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveDatasetButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
