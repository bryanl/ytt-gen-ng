import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as YAML from 'yaml';
import { ValuesService } from '../../../../services/values/values.service';
import { DefaultValue } from '../../../../data/schema/default-value';
import { DefaultValueService } from '../../../../data/service/value/default-value.service';
import { Field } from '../../../../data/schema/field';
import { SourceLinkService } from '../../../../data/service/source-link/source-link.service';
import { ApiVersionPipe } from '../../../shared/pipes/api-version/api-version.pipe';

@Component({
  selector: 'app-value-modal',
  templateUrl: './value-modal.component.html',
  styleUrls: ['./value-modal.component.scss'],
  providers: [ApiVersionPipe],
})
export class ValueModalComponent implements OnInit {
  isOpen = false;
  field: Field;
  fieldType: string[];

  constructor(
    private valuesServices: ValuesService,
    private valueService: DefaultValueService,
    private sourceLinkService: SourceLinkService,
    private apiVersion: ApiVersionPipe
  ) {}

  form: FormGroup;

  ngOnInit(): void {}

  open(field: Field) {
    console.log('field', field);
    console.log('gvk', field.kubernetesObject.groupVersionKind());

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
        description: new FormControl(this.description()),
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

  currentAction() {
    try {
      return this.form.get('options').get('action').value;
    } catch (e) {
      return '';
    }
  }

  submit() {
    if (this.form) {
      console.log('setting value', this.form.value);
      if (this.form.get('options').get('action').value === 'add') {
        const value = new DefaultValue(this.form.get('add').value);
        this.valueService.add(value);
        const ko = this.field.kubernetesObject;
        this.sourceLinkService.add(
          value.name,
          ko.groupVersionKind(),
          ko.name(),
          this.field.value.keyRange
        );
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

  modalTitle() {
    const kubernetesObject = this.field.kubernetesObject;
    const gvk = kubernetesObject.groupVersionKind();
    const gvkDesc = this.apiVersion.transform(gvk);
    return `${gvkDesc} | ${kubernetesObject.name()}`;
  }
}
