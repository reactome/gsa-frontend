import { TestBed } from '@angular/core/testing';

import { LoadDatasetService } from './load-dataset.service';

describe('LoadDatasetService', () => {
  let service: LoadDatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadDatasetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
