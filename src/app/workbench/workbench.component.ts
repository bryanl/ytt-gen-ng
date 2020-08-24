import { Component, Input, OnInit } from '@angular/core';
import { DefaultValue } from '../data/schema/default-value';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
})
export class WorkbenchComponent implements OnInit {
  @Input() values: DefaultValue[] = [];

  constructor() {}

  ngOnInit(): void {}
}
