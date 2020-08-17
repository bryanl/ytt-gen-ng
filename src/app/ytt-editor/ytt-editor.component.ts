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
import {
  DocumentDescriptor,
  Value,
  YamlDocument2,
} from '../core/services/monaco/yaml-document';
import { KubernetesObject } from '../core/services/monaco/kubernetes-object';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

export interface Field {
  kubernetesObject: KubernetesObject;
  value: Value;
}

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

  @Output() clientField: EventEmitter<Field> = new EventEmitter<Field>();

  @Output() docDescriptors: EventEmitter<
    DocumentDescriptor[]
  > = new EventEmitter<DocumentDescriptor[]>();

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
    const source = editor.getValue();

    const doc = new YamlDocument2(source);
    this.ngZone.run(() => {
      this.docDescriptors.emit(doc.docDescriptors());
    });

    const decorations = source
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

    this.monacoService.handleMargin(editor).subscribe((field) => {
      this.ngZone.run(() => this.clientField.emit(field));
    });

    this.monacoService.registerYamlHoverProvider(editor);
    this.monacoService.createTestProvider(editor);
  }
}
