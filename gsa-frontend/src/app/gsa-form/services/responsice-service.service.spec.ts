import { TestBed } from '@angular/core/testing';

import { ResponsiceServiceService } from './responsice-service.service';

describe('ResponsiceServiceService', () => {
  let service: ResponsiceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
