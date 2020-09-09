import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SourceLinkService } from '../source-link/source-link.service';
import { StorageService } from '../storage/storage.service';
import { DefaultValueService } from '../value/default-value.service';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  private source$: BehaviorSubject<string> = new BehaviorSubject<string>(
    undefined
  );

  constructor(
    private storageService: StorageService,
    private valueService: DefaultValueService,
    private sourceLinkService: SourceLinkService
  ) {
    this.source$.next(this.storageService.getSource());
  }

  current(): Observable<string> {
    return this.source$;
  }

  set(source: string) {
    this.storageService.setSource(source);
    this.valueService.clear();
    this.sourceLinkService.clear();
  }
}
