import { TestBed } from '@angular/core/testing';

import { MonacoService } from './monaco.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MonacoService', () => {
  let service: MonacoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MonacoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
