import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DefaultValue } from '../../../../data/schema/default-value';
import { DefaultValueService } from '../../../../data/service/value/default-value.service';

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
