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
        const x = new YamlDocument2(editor.getValue());

        const doc = new YamlDocument(editor.getValue());

        const source = editor.getValue();

        editor.onMouseDown((e) => {
          switch (e.target.type) {
            case monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN:
              const value = doc.lineValue(e.target.position.lineNumber);

              observer.next({
                kubernetesObject: new KubernetesObject(source, schema),
                value,
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

  registerYamlHoverProvider(editor: IStandaloneCodeEditor) {
    this.currentSchema().subscribe((schema) => {
      monaco.languages.registerHoverProvider('yaml', {
        provideHover(
          model: monaco.editor.ITextModel,
          position: monaco.Position
        ): monaco.languages.ProviderResult<monaco.languages.Hover> {
          const x = new YamlDocument2(model.getValue());
          console.log(x);

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

    monaco.languages.registerCodeLensProvider('yaml', {
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
