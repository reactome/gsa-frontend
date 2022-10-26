import { TestBed } from '@angular/core/testing';

import { TableHelperService } from './table-helper.service';

describe('TableHelperService', () => {
  let service: TableHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
