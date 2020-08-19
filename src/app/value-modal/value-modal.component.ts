import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Field } from '../ytt-editor/ytt-editor.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as YAML from 'yaml';
import { ValuesService } from '../services/values/values.service';
import { Value } from '../data/schema/value';
import { ValueService } from '../data/service/value/value.service';

@Component({
  selector: 'app-value-modal',
  templateUrl: './value-modal.component.html',
  styleUrls: ['./value-modal.component.scss'],
})
export class ValueModalComponent implements OnInit {
  isOpen = false;

  field: Field;

  fieldType: string[];

  constructor(
    private valuesServices: ValuesService,
    private valueService: ValueService
  ) {}

  form: FormGroup;

  ngOnInit(): void {}

  open(field: Field) {
    console.log('field', field);

    this.field = field;
    this.isOpen = true;

    this.fieldType = field.kubernetesObject.type(...field.value.path);

    this.form = new FormGroup({
      options: new FormGroup({
        action: new FormControl('add'),
      }),
      choose: new FormGroup({
        value: new FormControl(''),
      }),
      add: new FormGroup({
        name: new FormControl(field.value.name, [Validators.required]),
        raw: new FormControl(
          YAML.stringify(field.object),
          this.valuesServices.objectValidators(this.fieldType)
        ),
        fieldsTypes: new FormControl(JSON.stringify(this.fieldType)),
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
      console.log('setting value', this.form.value);
      if (this.form.get('options').get('action').value === 'add') {
        const value = new Value(this.form.get('add').value);
        this.valueService.addValue(value);
        this.close();
      }
    }
  }

  objectErrors() {
    const add = this.form.get('add');
    if (add) {
      const object = add.get('object');
      if (object) {
        const errors = object.errors || {};
        const text = Object.values<string>(errors);
        return text.join(' ');
      }
    }

    return 'something went wrong';
  }
}
