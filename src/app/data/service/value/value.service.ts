import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Value } from '../../schema/value';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ValueService {
  private values$: BehaviorSubject<Value[]> = new BehaviorSubject<Value[]>([]);

  constructor(private storageService: StorageService) {
    this.values$.next(this.storageService.getValues());
  }

  values(): Observable<Value[]> {
    return this.values$;
  }

  addValue(value: Value) {
    const currentValues = this.storageService
      .getValues()
      .filter((v) => v.name !== value.name);
    this.updateValues([...currentValues, value]);
  }

  deleteValue(name: string) {
    const currentValues = this.storageService
      .getValues()
      .filter((v) => v.name !== name);
    this.updateValues(currentValues);
  }

  private updateValues(values: Value[]) {
    this.storageService.setValues(values);
    this.values$.next(this.storageService.getValues());
  }
}
