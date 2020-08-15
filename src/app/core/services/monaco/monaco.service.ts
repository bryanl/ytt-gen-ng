import { Injectable } from '@angular/core';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { YamlDocument } from './yaml-document';
import { SchemaService } from '../schema/schema.service';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import ITextModel = monaco.editor.ITextModel;
import CodeLensList = monaco.languages.CodeLensList;
import { filter, take } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Schema } from '../schema/schema';
import { KubernetesObject } from './kubernetes-object';

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
      } as IStandaloneEditorConstructionOptions,
    };
  }

  registerYamlHoverProvider() {
    this.schema$
      .pipe(
        filter((x) => x !== undefined),
        take(1)
      )
      .subscribe((schema) => {
        monaco.languages.registerHoverProvider('yaml', {
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
                range: value.range,
                contents: [
                  { value: `**${value.name}**` },
                  {
                    isTrusted: true,
                    value: ko.description(...value.path),
                  },
                  {
                    isTrusted: true,
                    value: '[Link 1](http://google.com)',
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
