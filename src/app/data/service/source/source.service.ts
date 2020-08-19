import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { ValueService } from '../value/value.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  private source$: BehaviorSubject<string> = new BehaviorSubject<string>(
    undefined
  );

  constructor(
    private storageService: StorageService,
    private valueService: ValueService
  ) {
    this.source$.next(this.storageService.getSource());
  }

  current(): Observable<string> {
    return this.source$;
  }

  set(source: string) {
    this.storageService.setSource(source);
    this.valueService.clearValues();
  }
}
