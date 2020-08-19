import { Component, Input, OnInit } from '@angular/core';
import { Value } from '../data/schema/value';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
})
export class WorkbenchComponent implements OnInit {
  @Input() values: Value[] = [];

  constructor() {}

  ngOnInit(): void {}
}
