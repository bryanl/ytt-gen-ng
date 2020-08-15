import { TestBed } from '@angular/core/testing';

import { SchemaService } from './schema.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SchemaService', () => {
  let service: SchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
