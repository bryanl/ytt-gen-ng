import { Injectable } from '@angular/core';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { YamlDocument } from './yaml-document';
import { SchemaService } from '../schema/schema.service';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import ITextModel = monaco.editor.ITextModel;
import CodeLensList = monaco.languages.CodeLensList;

@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  constructor(private schemaService: SchemaService) {
    schemaService.getSchema().subscribe((data) => {
      console.log('got schema', data);
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
      onMonacoLoad: () => {
        console.log('new onMonacoLoad');
      },
    };
  }

  registerYamlHoverProvider() {
    monaco.languages.registerHoverProvider('yaml', {
      provideHover(
        model: monaco.editor.ITextModel,
        position: monaco.Position
      ): monaco.languages.ProviderResult<monaco.languages.Hover> {
        const doc = new YamlDocument(model.getValue());
        const pos = doc.absPosition(position);

        const got = doc.valueAt(pos);

        if (got) {
          return {
            range: got.range,
            contents: [
              { value: `**${got.name}**` },
              {
                isTrusted: true,
                value:
                  'This is a placeholder for something more interesting [(click me)](http://google.com)',
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
        console.log('code lens', model.getValue());

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
