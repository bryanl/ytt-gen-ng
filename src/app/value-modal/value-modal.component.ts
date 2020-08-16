import { Component, Input, OnInit } from '@angular/core';
import { Value } from '../core/services/monaco/yaml-document';

@Component({
  selector: 'app-value-modal',
  templateUrl: './value-modal.component.html',
  styleUrls: ['./value-modal.component.scss'],
})
export class ValueModalComponent implements OnInit {
  isOpen = false;

  value: Value;

  constructor() {}

  ngOnInit(): void {}

  open(value: Value) {
    this.value = value;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
