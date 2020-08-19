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
import { DocumentDescriptor } from '../data/schema/document-descriptor';

interface TreeNode {
  name: string;
  children: TreeNode[];
  descriptor?: DocumentDescriptor;
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

  nodes: TreeNode[] = [];
  selectedId: string;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.docDescriptors$.subscribe((descriptors) => {
      this.nodes = this.genNodes(descriptors);
      this.cdr.markForCheck();
    });
  }

  genNodes(descriptors: DocumentDescriptor[]): TreeNode[] {
    const apiVersions: TreeNode[] = [];

    descriptors.forEach((desc) => {
      let avIndex = apiVersions.findIndex((n) => n.name === desc.apiVersion);
      if (avIndex === -1) {
        const t = apiVersions.push({ name: desc.apiVersion, children: [] });
        avIndex = t - 1;
      }

      let kindIndex = apiVersions[avIndex].children.findIndex(
        (n) => n.name === desc.kind
      );
      if (kindIndex === -1) {
        const t = apiVersions[avIndex].children.push({
          name: desc.kind,
          children: [],
        });
        kindIndex = t - 1;
      }

      apiVersions[avIndex].children[kindIndex].children.push({
        name: desc.name,
        children: [],
        descriptor: desc,
      });

      apiVersions[avIndex].children[kindIndex].children.sort(treeNodeSort);
      apiVersions[avIndex].children.sort(treeNodeSort);
      apiVersions.sort(treeNodeSort);
    });

    this.selectedId = apiVersions[0].children[0].children[0].descriptor.id;

    return apiVersions;
  }

  isSelected(descriptor: DocumentDescriptor) {
    return descriptor.id === this.selectedId;
  }

  selectDescriptor(descriptor: DocumentDescriptor) {
    this.selectedId = descriptor.id;
    this.currentDescriptor.emit(descriptor);
  }
}

const treeNodeSort = (a: TreeNode, b: TreeNode) => (a.name > b.name ? 1 : -1);
