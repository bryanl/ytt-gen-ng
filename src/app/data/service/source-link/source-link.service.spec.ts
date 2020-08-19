import { TestBed } from '@angular/core/testing';

import { SourceLinkService } from './source-link.service';

describe('SourceLinkService', () => {
  let service: SourceLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
