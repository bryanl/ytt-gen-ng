import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DefaultValueService } from '../../../../data/service/value/default-value.service';
import { Form, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DefaultValue } from '../../../../data/schema/default-value';

@Component({
  selector: 'app-choose-value-form',
  templateUrl: './choose-value-form.component.html',
  styleUrls: ['./choose-value-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseValueFormComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() fieldType: string[];

  matchingValues$: BehaviorSubject<DefaultValue[]> = new BehaviorSubject<
    DefaultValue[]
  >([]);
  selected: DefaultValue;

  constructor(private valueService: DefaultValueService) {}

  ngOnInit(): void {
    console.log('form group', this.formGroup.value);
    this.valueService
      .current()
      .subscribe((values) =>
        this.matchingValues$.next(
          values.filter(
            (v) =>
              this.fieldType.filter((ft) => v.fieldTypes.includes(ft)).length >
              0
          )
        )
      );
  }

  values$() {
    return this.valueService.current();
  }

  selectionChanged(selected: DefaultValue) {
    this.selected = selected;
    (this.formGroup.controls.choose as FormGroup).setValue({
      selected: selected.name,
    });
  }
}
