import { Component, OnInit } from '@angular/core';
import { DefaultValue } from '../../../../data/schema/default-value';
import { DefaultValueService } from '../../../../data/service/value/default-value.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-value-viewer',
  templateUrl: './value-viewer.component.html',
  styleUrls: ['./value-viewer.component.scss'],
})
export class ValueViewerComponent implements OnInit {
  values$: Observable<DefaultValue[]>;

  constructor(private valueService: DefaultValueService) {}

  ngOnInit(): void {
    this.values$ = this.valueService.current();
  }

  onDelete(value: DefaultValue) {
    this.valueService.delete(value.name);
  }
}
