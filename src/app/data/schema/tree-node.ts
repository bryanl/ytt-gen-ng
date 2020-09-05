import { DocumentDescriptor } from './document-descriptor';

export interface TreeNode {
  id?: string;
  name: string;
  children: TreeNode[];
  descriptor?: DocumentDescriptor;
  icon?: string;
  classNames: string[];
  isSelected?(descriptor: DocumentDescriptor): boolean;
  click?(descriptor: DocumentDescriptor);
}
