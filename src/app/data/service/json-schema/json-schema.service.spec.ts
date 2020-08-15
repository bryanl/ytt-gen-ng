import { TestBed } from '@angular/core/testing';

import { JsonSchemaService } from './json-schema.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JsonSchemaService', () => {
  let service: JsonSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(JsonSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
