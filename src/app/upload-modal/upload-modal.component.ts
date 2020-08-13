import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent {
  @Input() isOpen = false;

  @Output() url: EventEmitter<string> = new EventEmitter<string>();

  form = new FormGroup({
    url: new FormControl('', [
      Validators.required,
      Validators.pattern(httpRegex),
    ]),
  });

  constructor() {}

  resetForm() {
    this.form.reset();
  }

  submit() {
    this.url.emit(this.form.controls.url.value);
  }
}

const httpRegex =
  'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
