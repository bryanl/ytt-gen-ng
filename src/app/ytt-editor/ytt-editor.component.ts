import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
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
} from '../core/services/monaco/yaml-document';
import { KubernetesObject } from '../core/services/monaco/kubernetes-object';
import { Subject } from 'rxjs';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

export interface Field {
  kubernetesObject: KubernetesObject;
  value: Value;
  object: any;
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
export class YttEditorComponent implements OnInit {
  @ViewChild('editor') editor: EditorComponent;

  @Input() descriptor$: Subject<DocumentDescriptor>;

  @Output() clientField: EventEmitter<Field> = new EventEmitter<Field>();

  private currentDescriptor: DocumentDescriptor;

  model: NgxEditorModel = {
    value: 'foo: bar',
    language: 'yaml',
  };

  private monacoServiceDisposable: monaco.IDisposable;

  constructor(private monacoService: MonacoService, private ngZone: NgZone) {}

  ngOnInit() {
    this.descriptor$.subscribe((descriptor) => {
      if (this.monacoServiceDisposable) {
        this.monacoServiceDisposable.dispose();
      }

      if (
        this.currentDescriptor &&
        descriptor.id === this.currentDescriptor.id
      ) {
        return;
      }
      this.model = {
        value: descriptor.value,
        language: 'yaml',
      };
      this.currentDescriptor = descriptor;
    });
  }

  onInit(editor: IStandaloneCodeEditor) {
    const source = editor.getValue();

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

    this.monacoServiceDisposable = this.monacoService.setup(editor);
    // this.monacoService.createTestProvider(editor);
  }
}
