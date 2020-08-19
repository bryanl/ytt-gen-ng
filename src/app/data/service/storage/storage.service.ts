import { Injectable } from '@angular/core';
import { Value } from '../../schema/value';

enum Key {
  Source = 'source',
  Values = 'values',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getSource(): string | null {
    return localStorage.getItem(Key.Source);
  }

  setSource(source: string) {
    localStorage.setItem(Key.Source, source);
  }

  setValues(values: Value[]) {
    const data = JSON.stringify(
      values.sort((a, b) => (a.name < b.name ? -1 : 1))
    );
    localStorage.setItem(Key.Values, data);
  }

  getValues(): Value[] {
    const data = localStorage.getItem(Key.Values);
    if (!data) {
      return [];
    }

    return (JSON.parse(data) as Value[]).sort((a, b) =>
      a.name < b.name ? -1 : 1
    );
  }
}
