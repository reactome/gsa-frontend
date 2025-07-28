import { TestBed } from '@angular/core/testing';

import { DownloadDatasetService } from './download-dataset.service';

describe('DownloadDatasetService', () => {
  let service: DownloadDatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadDatasetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
