import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { UrlService } from './url.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(UploadModalComponent) uploadModal: UploadModalComponent;

  // code = 'foo: bar\n---\nfoo: bar\n';
  code = '';

  constructor(private urlService: UrlService) {}

  modalOpen() {
    return this.code.length === 0;
  }

  updateCode(url: string) {
    this.urlService
      .download(url)
      .pipe(take(1))
      .subscribe((code) => (this.code = code));
  }
}
