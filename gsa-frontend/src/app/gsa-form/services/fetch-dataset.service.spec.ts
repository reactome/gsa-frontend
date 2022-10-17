import { TestBed } from '@angular/core/testing';

import { FetchDatasetService } from './fetch-dataset.service';

describe('DatasetService', () => {
  let service: FetchDatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchDatasetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
