import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  EditorComponent,
  NGX_MONACO_EDITOR_CONFIG,
  NgxEditorModel,
} from 'ngx-monaco-editor';
import { MonacoService } from '../core/services/monaco/monaco.service';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

@Component({
  selector: 'app-editor',
  templateUrl: './ytt-editor.component.html',
  styleUrls: ['./ytt-editor.component.scss'],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useFactory: (monacoService: MonacoService) => {
        return monacoService.config();
      },
      deps: [MonacoService],
    },
  ],
})
export class YttEditorComponent implements OnChanges {
  @ViewChild('editor') editor: EditorComponent;

  @Input() code: string;

  model: NgxEditorModel = {
    value: 'foo: bar',
    language: 'yaml',
  };

  constructor(private monacoService: MonacoService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.code.currentValue) {
      this.model.value = changes.code.currentValue;
    }
  }

  onInit(editor: IStandaloneCodeEditor) {
    this.monacoService.registerYamlHoverProvider();
    this.monacoService.createTestProvider(editor);
  }
}
