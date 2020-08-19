import { IGroupVersionKind } from './group-version-kind';

export class SourceLink {
  constructor(
    public value: string,
    public groupVersionKind: IGroupVersionKind,
    public name: string,
    public range: monaco.IRange
  ) {}
}
