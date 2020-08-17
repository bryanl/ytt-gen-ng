import { Component, OnInit } from '@angular/core';
import { Field } from '../ytt-editor/ytt-editor.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-value-modal',
  templateUrl: './value-modal.component.html',
  styleUrls: ['./value-modal.component.scss'],
})
export class ValueModalComponent implements OnInit {
  isOpen = false;

  field: Field;

  constructor() {}

  form: FormGroup;

  ngOnInit(): void {}

  open(field: Field) {
    console.log('field', field);

    this.field = field;
    this.isOpen = true;

    this.form = new FormGroup({
      options: new FormGroup({
        action: new FormControl('add'),
      }),
      choose: new FormGroup({
        value: new FormControl(''),
      }),
      add: new FormGroup({
        value: new FormControl('wtf', Validators.required),
      }),
    });
  }

  close() {
    this.isOpen = false;
  }

  description() {
    return this.field.kubernetesObject.description(...this.field.value.path);
  }

  type() {
    return this.field.kubernetesObject.type(...this.field.value.path);
  }

  resetForm() {
    if (this.form) {
      this.form.reset();
    }
  }

  submit() {
    if (this.form) {
      console.log('setttng value', this.form.value);
    }
  }
}
