import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-value-form',
  templateUrl: './create-value-form.component.html',
  styleUrls: ['./create-value-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateValueFormComponent implements OnInit {
  @Input() formGroup: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  objectErrors() {
    const add = this.formGroup.get('add');
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
