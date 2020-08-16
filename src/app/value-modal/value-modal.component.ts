import { Component, NgZone, OnInit } from '@angular/core';
import { Field } from '../ytt-editor/ytt-editor.component';

@Component({
  selector: 'app-value-modal',
  templateUrl: './value-modal.component.html',
  styleUrls: ['./value-modal.component.scss'],
})
export class ValueModalComponent implements OnInit {
  isOpen = false;

  field: Field;

  constructor() {}

  ngOnInit(): void {}

  open(field: Field) {
    console.log('opening value modal', field, NgZone.isInAngularZone());
    this.field = field;
    this.isOpen = true;
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
}
