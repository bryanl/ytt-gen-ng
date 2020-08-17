import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DocumentDescriptor } from '../core/services/monaco/yaml-document';

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
export class SidebarComponent {
  @Input() set docDescriptors(v: DocumentDescriptor[]) {
    if (!v) {
      return;
    }
    this.nodes = this.genNodes(v);
  }

  @Output() currentDescriptor: EventEmitter<
    DocumentDescriptor
  > = new EventEmitter<DocumentDescriptor>();

  nodes: TreeNode[] = [];

  constructor() {}

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

    return apiVersions;
  }

  select(descriptor: DocumentDescriptor) {
    this.currentDescriptor.emit(descriptor);
  }
}

const treeNodeSort = (a: TreeNode, b: TreeNode) => (a.name > b.name ? 1 : -1);
