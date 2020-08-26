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

  sourceErrors() {
    const object = this.formGroup.get(['add', 'raw']);
    if (object) {
      const errors = object.errors || {};
      const text = Object.values<string>(errors);
      return text.join(' ');
    }

    return 'unable to find value';
  }
}
