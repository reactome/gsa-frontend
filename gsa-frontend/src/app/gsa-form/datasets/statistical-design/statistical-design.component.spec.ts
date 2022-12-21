import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatisticalDesignComponent} from './statistical-design.component';

describe('StatisticalDesignComponent', () => {
  let component: StatisticalDesignComponent;
  let fixture: ComponentFixture<StatisticalDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticalDesignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
