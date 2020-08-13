import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import { NgxEditorModel } from 'ngx-monaco-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnChanges {
  @Input() code: string;

  editorOptions: IStandaloneEditorConstructionOptions = {};

  model: NgxEditorModel = {
    value: 'foo: bar',
    language: 'yaml',
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.code.currentValue) {
      this.model.value = changes.code.currentValue;
    }
  }
}
