import { SourceLocator } from './source-locator';

export interface DocumentDescriptor {
  id: string;
  sourceLocator: SourceLocator;
  value: string;
}
