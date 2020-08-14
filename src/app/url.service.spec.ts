import { TestBed } from '@angular/core/testing';

import { UrlService } from './url.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
