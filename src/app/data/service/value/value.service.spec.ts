import { TestBed } from '@angular/core/testing';

import { DefaultValueService } from './default-value.service';

describe('ValueService', () => {
  let service: DefaultValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
