import { TestBed } from '@angular/core/testing';

import { StatisticalDesignService } from './statistical-design.service';

describe('StatisticalDesignService', () => {
  let service: StatisticalDesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticalDesignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
