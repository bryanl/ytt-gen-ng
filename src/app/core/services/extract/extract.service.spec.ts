import { TestBed } from '@angular/core/testing';
import { SchemaService } from '@app/core/services/schema/schema.service';

import { ExtractService } from './extract.service';

describe('ExtractService', () => {
  let service: ExtractService;
  let schemaService: jasmine.SpyObj<SchemaService>;

  beforeEach(() => {
    schemaService = jasmine.createSpyObj('SchemaService', ['current']);

    TestBed.configureTestingModule({
      providers: [{ provide: SchemaService, useValue: schemaService }],
    });
    service = TestBed.inject(ExtractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
