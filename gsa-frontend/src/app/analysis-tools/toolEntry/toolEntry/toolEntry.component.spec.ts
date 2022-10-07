import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolEntryComponent } from './toolEntry.component';

describe('ToolEntryComponent', () => {
  let component: ToolEntryComponent;
  let fixture: ComponentFixture<ToolEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
