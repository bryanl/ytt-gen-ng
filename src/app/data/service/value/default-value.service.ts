import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DefaultValue } from '../../schema/default-value';
import { StorageService } from '../storage/storage.service';
import { SourceLinkService } from '../source-link/source-link.service';

@Injectable({
  providedIn: 'root',
})
export class DefaultValueService {
  private values$: BehaviorSubject<DefaultValue[]> = new BehaviorSubject<
    DefaultValue[]
  >([]);

  constructor(
    private storageService: StorageService,
    private sourceLinkService: SourceLinkService
  ) {
    this.values$.next(this.storageService.getDefaultValues());
  }

  /**
   * Returns the current default values as an observable.
   */
  current(): Observable<DefaultValue[]> {
    return this.values$;
  }

  /**
   * Add a default value
   *
   * @param value is the current default value.
   */
  add(value: DefaultValue) {
    const currentValues = this.storageService
      .getDefaultValues()
      .filter((v) => v.name !== value.name);
    this.update([...currentValues, value]);
  }

  /**
   * Deletes a default value by name
   *
   * @param name is the name of the default value
   */
  delete(name: string) {
    const currentValues = this.storageService
      .getDefaultValues()
      .filter((v) => v.name !== name);
    this.update(currentValues);
    this.sourceLinkService.update();
  }

  /**
   * Clear all default values.
   */
  clear() {
    this.update([]);
    this.sourceLinkService.update();
  }

  private update(values: DefaultValue[]) {
    this.storageService.setDefaultValues(values);
    this.values$.next(this.storageService.getDefaultValues());
  }
}
