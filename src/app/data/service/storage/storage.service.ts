import { Injectable } from '@angular/core';

enum Key {
  Source = 'source',
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
}
