import { Injectable } from '@angular/core';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { YamlDocument, YamlDocument2 } from './yaml-document';
import { SchemaService } from '../schema/schema.service';
import { filter, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Schema } from '../schema/schema';
import { KubernetesObject } from './kubernetes-object';
import { Field } from '../../../ytt-editor/ytt-editor.component';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import ITextModel = monaco.editor.ITextModel;
import CodeLensList = monaco.languages.CodeLensList;
import IDisposable = monaco.IDisposable;
import * as YAML from 'yaml';

@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  private schema$: Subject<Schema> = new BehaviorSubject<Schema>(undefined);

  constructor(private schemaService: SchemaService) {
    schemaService
      .getSchema()
      .pipe(take(1))
      .subscribe((data) => {
        this.schema$.next(data);
      });
  }

  config(): NgxMonacoEditorConfig {
    return {
      defaultOptions: {
        theme: 'vs-dark',
        language: 'yaml',
        scrollBeyondLastLine: false,
        readOnly: true,
        glyphMargin: true,
        minimap: {
          enabled: false,
        },
      } as IStandaloneEditorConstructionOptions,
    };
  }

  handleMargin(editor: IStandaloneCodeEditor) {
    return new Observable<Field>((observer) => {
      this.currentSchema().subscribe((schema) => {
        const doc = new YamlDocument(editor.getValue());

        const resolveObject = (object: any, path: string[]): any => {
          if (path.length === 0) {
            return object;
          }
          const key = path.shift();
          return resolveObject(object[key], path);
        };

        editor.onMouseDown((e) => {
          switch (e.target.type) {
            case monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN:
              const value = doc.lineValue(e.target.position.lineNumber);
              const object = YAML.parse(editor.getValue());

              observer.next({
                kubernetesObject: new KubernetesObject(doc.source, schema),
                value,
                object: resolveObject(object, value.path),
              });
              break;
          }
        });
      });
    });
  }

  currentSchema(): Observable<Schema> {
    return this.schema$.pipe(
      filter((x) => x !== undefined),
      take(1)
    );
  }

  setup(editor: IStandaloneCodeEditor): IDisposable {
    const disposables: IDisposable[] = [];

    const disposable: IDisposable = {
      dispose() {
        disposables.forEach((d) => d.dispose());
      },
    };

    this.currentSchema().subscribe((schema) => {
      disposables.push(this.registerYamlHoverProvider(schema, editor));
    });

    return disposable;
  }

  registerYamlHoverProvider(
    schema: Schema,
    editor: IStandaloneCodeEditor
  ): IDisposable {
    return monaco.languages.registerHoverProvider('yaml', {
      provideHover(
        model: monaco.editor.ITextModel,
        position: monaco.Position
      ): monaco.languages.ProviderResult<monaco.languages.Hover> {
        const doc = new YamlDocument(model.getValue());
        const pos = doc.absPosition(position);

        const ko = new KubernetesObject(model.getValue(), schema);

        const value = doc.valueAt(pos);

        if (value) {
          return {
            range: value.keyRange,
            contents: [
              // { value: `**${value.name}**` },
              {
                isTrusted: true,
                value: ko.description(...value.path),
              },
            ],
          };
        }

        return undefined;
      },
    });
  }

  createTestProvider(editor: IStandaloneCodeEditor) {
    const commandId = editor.addCommand(
      0,
      () => {
        // services available in `ctx`
        alert('my command is executing!');
      },
      ''
    );

    const t = monaco.languages.registerCodeLensProvider('yaml', {
      provideCodeLenses(
        model: ITextModel,
        token: monaco.CancellationToken
      ): monaco.languages.ProviderResult<CodeLensList> {
        return {
          lenses: [
            {
              range: {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 1,
              },
              id: 'First Line',
              command: {
                id: commandId,
                title: 'First Line',
              },
            },
          ],
          dispose() {},
        };
      },
      resolveCodeLens(model, codeLens, token) {
        return codeLens;
      },
    });
  }
}
