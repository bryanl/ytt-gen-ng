import { Injectable } from '@angular/core';
import { IGroupVersionKind } from '../../schema/group-version-kind';
import { SourceLink } from '../../schema/source-link';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SourceLinkService {
  constructor(private storageService: StorageService) {}

  add(
    valueName: string,
    groupVersionKind: IGroupVersionKind,
    name: string,
    range: monaco.IRange
  ) {
    const sourceLink = new SourceLink(valueName, groupVersionKind, name, range);
    const cur = this.storageService.getSourceLinks();
    this.storageService.setSourceLinks([...cur, sourceLink]);
  }

  get(groupVersionKind: IGroupVersionKind, name: string): SourceLink[] {
    return this.storageService
      .getSourceLinks()
      .filter(
        (sl) =>
          groupVersionKindComparator(sl.groupVersionKind, groupVersionKind) &&
          sl.name === name
      );
  }
}

const groupVersionKindComparator = (
  a: IGroupVersionKind,
  b: IGroupVersionKind
): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};
