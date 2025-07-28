import { TestBed } from '@angular/core/testing';

import { TourUtilsService } from './tour-utils.service';

describe('TourUtilsService', () => {
  let service: TourUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
