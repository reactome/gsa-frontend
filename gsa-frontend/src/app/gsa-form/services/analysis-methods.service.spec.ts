import { TestBed } from '@angular/core/testing';

import { AnalysisMethodsService } from './analysis-methods.service';

describe('AnalysisMethodsService', () => {
  let service: AnalysisMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
