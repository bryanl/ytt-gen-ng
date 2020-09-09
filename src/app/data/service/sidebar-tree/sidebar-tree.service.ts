import { Injectable } from '@angular/core';
import { TreeNode } from '../../schema/tree-node';

@Injectable({
  providedIn: 'root',
})
export class SidebarTreeService {
  constructor() {}

  // genTreeNodes(descriptors: DocumentDescriptor[]): TreeNode[] {
  //   const documents: TreeNode = {
  //     name: 'Documents',
  //     children: this.genDocuments(descriptors),
  //     classNames: ['section'],
  //   };
  //
  //   const generated: TreeNode = {
  //     name: 'Generated',
  //     children: [
  //       {
  //         name: 'values.yaml',
  //         children: [],
  //         classNames: [],
  //         icon: 'list',
  //         click(descriptor: DocumentDescriptor) {
  //           console.log('clicked');
  //         },
  //         isSelected(descriptor: DocumentDescriptor): boolean {
  //           return false;
  //         },
  //       },
  //     ],
  //     classNames: ['section'],
  //   };
  //
  //   return [documents, generated];
  // }
  //
  // genDocuments(descriptors: DocumentDescriptor[]): TreeNode[] {
  //   const groupVersionKinds: TreeNode[] = [];
  //
  //   descriptors.forEach((desc, i) => {
  //     const sourceLocator = desc.sourceLocator;
  //     const gvk = `${sourceLocator.kind} (${sourceLocator.apiVersion})`;
  //
  //     let gvkIndex = groupVersionKinds.findIndex((n) => n.name === gvk);
  //     if (gvkIndex === -1) {
  //       const t = groupVersionKinds.push({
  //         name: gvk,
  //         children: [],
  //         icon: 'folder',
  //         classNames: [],
  //       });
  //       gvkIndex = t - 1;
  //     }
  //
  //     groupVersionKinds[gvkIndex].children.push({
  //       id: desc.id,
  //       name: sourceLocator.name,
  //       children: [],
  //       descriptor: desc,
  //       icon: 'block',
  //       classNames: [],
  //       isSelected: (descriptor: DocumentDescriptor): boolean =>
  //         this.isSelected(descriptor),
  //       click: (descriptor: DocumentDescriptor) =>
  //         this.selectDescriptor(descriptor),
  //     });
  //
  //     groupVersionKinds[gvkIndex].children.sort(treeNodeSort);
  //     groupVersionKinds.sort(treeNodeSort);
  //
  //     if (i === 0) {
  //       this.selectDescriptor(desc);
  //     }
  //   });
  //
  //   return groupVersionKinds;
  // }
  //
  // isSelected(descriptor: DocumentDescriptor): boolean {
  //   return descriptor.id === this.selectedId;
  // }
  //
  // selectDescriptor(descriptor: DocumentDescriptor) {
  //   if (this.selectedId !== descriptor.id) {
  //     this.store.dispatch(HomeActions.selectDocumentDescriptor({ descriptor }));
  //   }
  // }
}

const treeNodeSort = (a: TreeNode, b: TreeNode) => (a.name > b.name ? 1 : -1);
