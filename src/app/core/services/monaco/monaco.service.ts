import { Injectable } from '@angular/core';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { YamlDocument } from './yaml-document';
import { SchemaService } from '../schema/schema.service';
import { Schema } from '../schema/schema';
import { KubernetesObject } from './kubernetes-object';
import { ExtractService } from '../extract/extract.service';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import ITextModel = monaco.editor.ITextModel;
import CodeLensList = monaco.languages.CodeLensList;
import IDisposable = monaco.IDisposable;

@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  constructor(
    private schemaService: SchemaService,
    private extractService: ExtractService
  ) {}

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

  setup(editor: IStandaloneCodeEditor): IDisposable {
    const disposables: IDisposable[] = [];

    const disposable: IDisposable = {
      dispose() {
        disposables.forEach((d) => d.dispose());
      },
    };

    this.schemaService.current().subscribe((schema) => {
      disposables.push(this.registerYamlHoverProvider(schema, editor));
    });

    return disposable;
  }

  extract() {
    return this.extractService;
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
                value: ko.description(...[...value.path]),
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
