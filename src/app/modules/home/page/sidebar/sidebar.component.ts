import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { DocumentDescriptor } from '../../../../data/schema/document-descriptor';
import { group } from '@angular/animations';

interface TreeNode {
  name: string;
  children: TreeNode[];
  descriptor?: DocumentDescriptor;
  icon?: string;
  classNames: string[];
  isSelected?(descriptor: DocumentDescriptor): boolean;
  click?(descriptor: DocumentDescriptor);
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Input() docDescriptors$: Subject<DocumentDescriptor[]>;

  @Output() currentDescriptor: EventEmitter<
    DocumentDescriptor
  > = new EventEmitter<DocumentDescriptor>();

  treeNodes: TreeNode[] = [];
  selectedId: string;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.docDescriptors$.subscribe((descriptors) => {
      this.treeNodes = this.genTreeNodes(descriptors);
      this.cdr.markForCheck();
    });
  }

  genDocuments(descriptors: DocumentDescriptor[]): TreeNode[] {
    const groupVersionKinds: TreeNode[] = [];
    const self = this;

    descriptors.forEach((desc, i) => {
      const sourceLocator = desc.sourceLocator;
      const gvk = `${sourceLocator.kind} (${sourceLocator.apiVersion})`;

      let gvkIndex = groupVersionKinds.findIndex((n) => n.name === gvk);
      if (gvkIndex === -1) {
        const t = groupVersionKinds.push({
          name: gvk,
          children: [],
          icon: 'folder',
          classNames: [],
        });
        gvkIndex = t - 1;
      }

      groupVersionKinds[gvkIndex].children.push({
        name: sourceLocator.name,
        children: [],
        descriptor: desc,
        icon: 'block',
        classNames: [],
        // isSelected: self.isSelected,
        // click: self.selectDescriptor,
        isSelected: (descriptor: DocumentDescriptor): boolean =>
          this.isSelected(descriptor),
        click: (descriptor: DocumentDescriptor) =>
          this.selectDescriptor(descriptor),
      });

      groupVersionKinds[gvkIndex].children.sort(treeNodeSort);
      groupVersionKinds.sort(treeNodeSort);

      if (i === 0) {
        this.selectDescriptor(desc);
      }
    });

    return groupVersionKinds;
  }

  genTreeNodes(descriptors: DocumentDescriptor[]): TreeNode[] {
    const documents: TreeNode = {
      name: 'Documents',
      children: this.genDocuments(descriptors),
      classNames: ['section'],
    };

    const generated: TreeNode = {
      name: 'Generated',
      children: [{ name: 'test', children: [], classNames: [] }],
      classNames: ['section'],
    };

    return [documents, generated];
  }

  isSelected(descriptor: DocumentDescriptor): boolean {
    return descriptor.id === this.selectedId;
  }

  selectDescriptor(descriptor: DocumentDescriptor) {
    this.selectedId = descriptor.id;
    this.currentDescriptor.emit(descriptor);
  }
}

const treeNodeSort = (a: TreeNode, b: TreeNode) => (a.name > b.name ? 1 : -1);
