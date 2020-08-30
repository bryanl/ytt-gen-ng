import { v4 as uuidv4 } from 'uuid';
import * as YAML from 'yaml';
import { DocumentDescriptor } from './document-descriptor';

/**
 * Manifest contains a Kubernetes manifest
 */
export class Manifest {
  private readonly documents: YAML.CST.Document[];

  private selected: number;

  constructor(private readonly source: string) {
    this.documents = YAML.parseCST(source);
  }

  /**
   * docDescriptors returns the descriptors found in source.
   */
  docDescriptors(): DocumentDescriptor[] {
    return this.documents.map<DocumentDescriptor>((doc) => {
      const source = this.source
        .substring(doc.valueRange.start, doc.valueRange.end)
        .trim();
      return docToDescriptor(source);
    });
  }

  /**
   * select selects the current document.
   *
   * @param index is the index of the selected document.
   */
  select(index: number) {
    this.selected = index;
  }

  /**
   * current returns the currently selected document.
   */
  current(): DocumentDescriptor {
    const index = !this.selected ? 0 : this.selected;
    return this.docDescriptors()[index];
  }
}

/**
 * docToDescriptor converts a single YAML document to a Document Descriptor.
 *
 * @param source is the source of the YAML document.
 */
const docToDescriptor = (source: string): DocumentDescriptor => {
  const obj = YAML.parse(source);

  if (!obj || !obj.apiVersion) {
    throw new Error('invalid document');
  }

  return {
    id: uuidv4(),
    sourceLocator: {
      apiVersion: obj.apiVersion,
      kind: obj.kind,
      name: obj.metadata.name,
    },
    value: source,
  };
};
