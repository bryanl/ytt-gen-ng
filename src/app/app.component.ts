import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { UrlService } from './url.service';
import { take } from 'rxjs/operators';
import { Value } from './core/services/monaco/yaml-document';
import { ValueModalComponent } from './value-modal/value-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('uploadModal') uploadModal: UploadModalComponent;
  @ViewChild('valueModal') valueModal: ValueModalComponent;

  code = '';

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
        this.code = code;
        this.uploadModal.close();
      });
  }

  valueClicked(value: Value) {
    this.valueModal.open(value);
  }
}
