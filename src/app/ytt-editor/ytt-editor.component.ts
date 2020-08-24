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
import { Subject } from 'rxjs';
import { DocumentDescriptor } from '../data/schema/document-descriptor';
import { Field } from '../data/schema/field';
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
export class YttEditorComponent implements OnInit {
  @ViewChild('editor') editor: EditorComponent;

  @Input() descriptor$: Subject<DocumentDescriptor>;

  @Output() clientField: EventEmitter<Field> = new EventEmitter<Field>();

  private currentDescriptor: DocumentDescriptor;
  private monacoServiceDisposable: monaco.IDisposable;

  model: NgxEditorModel = {
    value: '',
    language: 'yaml',
  };

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

  reload() {
    this.model = {
      value: this.currentDescriptor.value,
      language: 'yaml',
    };
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

    this.monacoService
      .extract()
      .onKeySelected(editor)
      .subscribe((field) => {
        this.ngZone.run(() => this.clientField.emit(field));
      });

    this.monacoServiceDisposable = this.monacoService.setup(editor);
  }
}
