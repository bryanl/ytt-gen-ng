import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent {
  @Output() url: EventEmitter<string> = new EventEmitter<string>();

  isOpen = false;

  form = new FormGroup({
    url: new FormControl(sampleURL, [
      Validators.required,
      Validators.pattern(httpRegex),
    ]),
  });

  constructor() {}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  resetForm() {
    this.form.reset();
  }

  submit() {
    this.url.emit(this.form.controls.url.value);
  }
}

const httpRegex =
  'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

const sampleURL =
  'https://gist.githubusercontent.com/bryanl/bf78e444419db3b78450ff35cdb99ec5/raw/ef4e0b96b762311cb4706b5f3537f95ae2ab9b37/manifest.yaml';
