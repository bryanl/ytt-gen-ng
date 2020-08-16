import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
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
import { Value, YamlDocument } from '../core/services/monaco/yaml-document';

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

  @Output() clickValue: EventEmitter<Value> = new EventEmitter<Value>();

  model: NgxEditorModel = {
    value: 'foo: bar',
    language: 'yaml',
  };

  constructor(private monacoService: MonacoService, private ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.code.currentValue) {
      this.model.value = changes.code.currentValue;
    }
  }

  onInit(editor: IStandaloneCodeEditor) {
    const doc = new YamlDocument(editor.getValue());

    const decorations = editor
      .getValue()
      .split('\n')
      .map<monaco.editor.IModelDeltaDecoration>((line, i) => {
        return {
          range: new monaco.Range(i + 1, 1, i + 1, 1),
          options: {
            isWholeLine: true,
            className: 'myContentClass',
            glyphMarginClassName: 'myGlyphMarginClass',
          },
        };
      });

    editor.deltaDecorations([], decorations);

    editor.onMouseDown((e) => {
      switch (e.target.type) {
        case monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN:
          const value = doc.lineValue(e.target.position.lineNumber);
          this.ngZone.run(() => {
            this.clickValue.emit(value);
          });
          break;
      }
    });

    this.monacoService.registerYamlHoverProvider(editor);
    this.monacoService.createTestProvider(editor);
  }
}
