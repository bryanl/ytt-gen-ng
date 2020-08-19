import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Value } from '../data/schema/value';

@Component({
  selector: 'app-value-viewer',
  templateUrl: './value-viewer.component.html',
  styleUrls: ['./value-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueViewerComponent implements OnInit {
  @Input() values: Value[] = [];

  constructor() {}

  ngOnInit(): void {}
}
