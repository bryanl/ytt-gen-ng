import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import { EditorComponent, NgxEditorModel } from 'ngx-monaco-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './ytt-editor.component.html',
  styleUrls: ['./ytt-editor.component.scss'],
})
export class YttEditorComponent implements OnChanges {
  @ViewChild('editor') editor: EditorComponent;

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

  onInit($event: any) {
    console.log('on init', (window as any).monaco);

    console.log('editor onInit', $event);
    console.log(this.editor);
  }
}
