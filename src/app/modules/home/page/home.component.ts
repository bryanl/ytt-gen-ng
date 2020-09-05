import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { DocumentDescriptor } from '../../../data/schema/document-descriptor';
import { Field } from '../../../data/schema/field';
import { Manifest } from '../../../data/schema/manifest';
import { SourceService } from '../../../data/service/source/source.service';
import { DefaultValueService } from '../../../data/service/value/default-value.service';
import * as HomeActions from '../state/home.actions';
import { getCurrentDescriptor } from '../state/home.reducer';
import { State } from '../state/home.state';
import { UrlService } from '../url.service';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ValueModalComponent } from './value-modal/value-modal.component';
import { YttEditorComponent } from './ytt-editor/ytt-editor.component';

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
    private urlService: UrlService,
    private sourceService: SourceService,
    private defaultValueService: DefaultValueService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    // TODO: unsubscribe
    this.sourceService
      .current()
      .subscribe((source) => this.handleSource(source));

    // TODO: unsubscribe
    this.defaultValueService.current().subscribe(() => {
      if (this.yttEditor) {
        this.yttEditor.reload();
      }
    });

    // TODO: unsubscribe
    this.store.select(getCurrentDescriptor).subscribe((currentDescriptor) => {
      this.descriptor$.next(currentDescriptor);
    });
  }

  handleSource(source: string) {
    if (!source) {
      this.uploadModal.open();
      return;
    }

    this.updateSource(source);
  }

  updateCode(url: string) {
    this.urlService
      .download(url)
      .pipe(take(1))
      .subscribe((source) => {
        this.sourceService.set(source);
        this.updateSource(source);
        this.uploadModal.close();
      });
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
