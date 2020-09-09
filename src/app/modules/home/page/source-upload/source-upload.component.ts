import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UrlService } from '@home/url.service';
import { DynamicModal } from '@shared/services/dynamic-modal/dynamic-modal.model';
import { Subject } from 'rxjs';

export interface UrlLocation {
  sourceURL: string;
}

@Component({
  selector: 'app-source-upload',
  templateUrl: './source-upload.component.html',
  styleUrls: ['./source-upload.component.scss'],
})
export class SourceUploadComponent implements OnInit, DynamicModal {
  destroy$: Subject<UrlLocation> = new Subject();

  open = false;

  form = this.fb.group({
    sourceURL: [
      UrlService.sampleURL,
      [Validators.required, Validators.pattern(UrlService.httpRegex)],
    ],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('source upload init');
  }

  cancel() {
    this.open = false;
    this.destroy$.next(null);
  }

  save() {
    this.open = false;
    this.destroy$.next(this.form.value);
  }
}
