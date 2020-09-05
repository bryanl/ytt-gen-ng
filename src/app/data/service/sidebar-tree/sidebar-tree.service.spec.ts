import { TestBed } from '@angular/core/testing';

import { SidebarTreeService } from './sidebar-tree.service';

describe('SidebarTreeService', () => {
  let service: SidebarTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
