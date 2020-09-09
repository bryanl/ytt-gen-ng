import { Component, OnInit, ViewChild } from '@angular/core';

import { DocumentDescriptor } from '@data/schema/document-descriptor';
import { Field } from '@data/schema/field';
import { Manifest } from '@data/schema/manifest';
import { DefaultValueService } from '@data/service/value/default-value.service';
import { YttEditorComponent } from '@home/page/ytt-editor/ytt-editor.component';
import { getCurrentDescriptor, getSource } from '@home/state/home.selectors';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as HomeActions from '../state/home.actions';
import { State } from '../state/home.state';
import * as UrlActions from '../state/url.actions';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ValueModalComponent } from './value-modal/value-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('uploadModal') uploadModal: UploadModalComponent;
  @ViewChild('valueModal') valueModal: ValueModalComponent;
  @ViewChild('yttEditor') yttEditor: YttEditorComponent;

  showSidebar = false;
  descriptor$: Subject<DocumentDescriptor> = new Subject<DocumentDescriptor>();

  documentDescriptors: DocumentDescriptor[];

  constructor(
    private defaultValueService: DefaultValueService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.store.select(getSource).subscribe((source) => {
      console.log('got source', { source });
      if (source === null) {
        setTimeout(() => this.uploadYAML());
      } else {
        this.updateSource(source);
      }
    });

    this.store.dispatch(HomeActions.loadSource());

    // TODO: figure out what this does again...
    // this.defaultValueService.current().subscribe(() => {
    //   if (this.yttEditor) {
    //     this.yttEditor.reload();
    //   }
    // });

    // TODO: unsubscribe
    this.store.select(getCurrentDescriptor).subscribe((currentDescriptor) => {
      this.descriptor$.next(currentDescriptor);
    });
  }

  uploadYAML() {
    this.store.dispatch(UrlActions.openDialog());
  }

  updateSource(source: string) {
    setTimeout(() => {
      const doc = new Manifest(source);

      const current = doc.current();
      if (!current) {
        return;
      }

      this.descriptor$.next(current);
      this.store.dispatch(
        HomeActions.setDocumentDescriptors({
          descriptors: doc.docDescriptors(),
        })
      );
      this.showSidebar = true;
    });
  }

  fieldClicked(field: Field) {
    this.valueModal.open(field);
  }
}
