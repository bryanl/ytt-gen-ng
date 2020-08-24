import { Injectable } from '@angular/core';
import { DefaultValue } from '../../schema/default-value';
import { SourceLink } from '../../schema/source-link';

enum Key {
  Source = 'source',
  SourceLinks = 'source-links',
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

  setDefaultValues(values: DefaultValue[]) {
    const data = JSON.stringify(
      values.sort((a, b) => (a.name < b.name ? -1 : 1))
    );
    localStorage.setItem(Key.Values, data);
  }

  getDefaultValues(): DefaultValue[] {
    const data = localStorage.getItem(Key.Values);
    if (!data) {
      return [];
    }

    return (JSON.parse(data) as DefaultValue[]).sort((a, b) =>
      a.name < b.name ? -1 : 1
    );
  }

  getSourceLinks(): SourceLink[] {
    const data = localStorage.getItem(Key.SourceLinks);
    if (!data) {
      return [];
    }

    return JSON.parse(data) as SourceLink[];
  }

  setSourceLinks(sourceLinks: SourceLink[]) {
    const data = JSON.stringify(sourceLinks);
    localStorage.setItem(Key.SourceLinks, data);
  }
}
