import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { UrlService } from './url.service';
import { take } from 'rxjs/operators';
import { YamlDocument2 } from './data/schema/yaml-document';
import { ValueModalComponent } from './value-modal/value-modal.component';
import { Field } from './ytt-editor/ytt-editor.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { StorageService } from './data/service/storage/storage.service';
import { DocumentDescriptor } from './data/schema/document-descriptor';
import { Value } from './data/schema/value';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('uploadModal') uploadModal: UploadModalComponent;
  @ViewChild('valueModal') valueModal: ValueModalComponent;

  showSidebar = false;

  descriptor$: Subject<DocumentDescriptor> = new Subject<DocumentDescriptor>();

  documentDescriptors: DocumentDescriptor[];

  documentDescriptors$: BehaviorSubject<
    DocumentDescriptor[]
  > = new BehaviorSubject<DocumentDescriptor[]>([]);

  constructor(
    private urlService: UrlService,
    private storageService: StorageService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const source = this.storageService.getSource();
      if (!source) {
        this.uploadModal.open();
        return;
      }

      this.updateSource(source);
    });
  }

  updateCode(url: string) {
    this.urlService
      .download(url)
      .pipe(take(1))
      .subscribe((source) => {
        this.storageService.setSource(source);
        this.updateSource(source);
        this.uploadModal.close();
      });
  }
  updateSource(source: string) {
    const doc = new YamlDocument2(source);
    this.descriptor$.next(doc.current());
    this.documentDescriptors$.next(doc.docDescriptors());
    this.showSidebar = true;
  }

  fieldClicked(field: Field) {
    this.valueModal.open(field);
  }

  descriptorSelected(descriptor: DocumentDescriptor) {
    this.descriptor$.next(descriptor);
  }
}
