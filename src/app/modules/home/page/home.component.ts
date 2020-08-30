import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DocumentDescriptor } from '../../../data/schema/document-descriptor';
import { UrlService } from '../url.service';
import { SourceService } from '../../../data/service/source/source.service';
import { DefaultValueService } from '../../../data/service/value/default-value.service';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ValueModalComponent } from './value-modal/value-modal.component';
import { YttEditorComponent } from './ytt-editor/ytt-editor.component';
import { take } from 'rxjs/operators';
import { Field } from '../../../data/schema/field';
import { Manifest } from '../../../data/schema/manifest';

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

  documentDescriptors$: BehaviorSubject<
    DocumentDescriptor[]
  > = new BehaviorSubject<DocumentDescriptor[]>([]);

  constructor(
    private urlService: UrlService,
    private sourceService: SourceService,
    private defaultValueService: DefaultValueService
  ) {}

  ngOnInit(): void {
    this.sourceService
      .current()
      .subscribe((source) => this.handleSource(source));

    this.defaultValueService.current().subscribe(() => {
      if (this.yttEditor) {
        this.yttEditor.reload();
      }
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
      this.documentDescriptors$.next(doc.docDescriptors());
      this.showSidebar = true;
    });
  }

  fieldClicked(field: Field) {
    this.valueModal.open(field);
  }

  descriptorSelected(descriptor: DocumentDescriptor) {
    this.descriptor$.next(descriptor);
  }
}
