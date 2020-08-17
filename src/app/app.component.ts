import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { UrlService } from './url.service';
import { take } from 'rxjs/operators';
import {
  DocumentDescriptor,
  YamlDocument2,
} from './core/services/monaco/yaml-document';
import { ValueModalComponent } from './value-modal/value-modal.component';
import { Field } from './ytt-editor/ytt-editor.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('uploadModal') uploadModal: UploadModalComponent;
  @ViewChild('valueModal') valueModal: ValueModalComponent;

  doc: YamlDocument2;

  descriptor$: Subject<DocumentDescriptor> = new Subject<DocumentDescriptor>();

  documentDescriptors: DocumentDescriptor[];

  documentDescriptors$: BehaviorSubject<
    DocumentDescriptor[]
  > = new BehaviorSubject<DocumentDescriptor[]>([]);

  constructor(private urlService: UrlService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.uploadModal.open();
    });
  }

  updateCode(url: string) {
    this.urlService
      .download(url)
      .pipe(take(1))
      .subscribe((code) => {
        this.doc = new YamlDocument2(code);
        this.descriptor$.next(this.doc.current());
        this.documentDescriptors$.next(this.doc.docDescriptors());
        this.uploadModal.close();
      });
  }

  fieldClicked(field: Field) {
    this.valueModal.open(field);
  }

  descriptorSelected(descriptor: DocumentDescriptor) {
    this.descriptor$.next(descriptor);
  }
}
