import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Value } from '../data/schema/value';
import { ValueService } from '../data/service/value/value.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-value-viewer',
  templateUrl: './value-viewer.component.html',
  styleUrls: ['./value-viewer.component.scss'],
})
export class ValueViewerComponent implements OnInit {
  values$: Observable<Value[]>;

  constructor(private valueService: ValueService) {}

  ngOnInit(): void {
    this.values$ = this.valueService.values();
  }

  onDelete(value: Value) {
    this.valueService.deleteValue(value.name);
  }
}
