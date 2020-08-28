import { Injectable } from '@angular/core';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { YamlDocument } from '../../../data/schema/yaml-document';
import { SchemaService } from '../schema/schema.service';
import { Schema } from '../schema/schema';
import { KubernetesObject } from '../../../data/schema/kubernetes-object';
import { ExtractService } from '../extract/extract.service';
import { SourceLinkService } from '../../../data/service/source-link/source-link.service';
import { v4 as uuidv4 } from 'uuid';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import IDisposable = monaco.IDisposable;

@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  constructor(
    private schemaService: SchemaService,
    private extractService: ExtractService,
    private sourceLinkService: SourceLinkService
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
      disposables.push(
        this.registerYamlHoverProvider(schema, editor),
        this.configureSourceLink(editor, schema)
      );
    });

    return disposable;
  }

  extract() {
    return this.extractService;
  }

  configureSourceLink(
    editor: IStandaloneCodeEditor,
    schema: Schema
  ): IDisposable {
    // set up code lens
    const ko = new KubernetesObject(editor.getValue(), schema);
    const sourceLinks = this.sourceLinkService.get(
      ko.groupVersionKind(),
      ko.name()
    );

    let lenses = sourceLinks.map<monaco.languages.CodeLens>((sl) => {
      const commandId = editor.addCommand(0, (...args: any): void => {
        console.log('codelens clicked', args);
      });

      return {
        range: sl.range,
        id: uuidv4(),
        command: {
          id: commandId,
          title: `value:${sl.value}`,
          arguments: [{ sl }],
        },
      };
    });

    return monaco.languages.registerCodeLensProvider('yaml', {
      provideCodeLenses(
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken
      ): monaco.languages.ProviderResult<monaco.languages.CodeLensList> {
        return {
          lenses,
          dispose() {
            lenses = [];
          },
        };
      },
      resolveCodeLens(
        model: monaco.editor.ITextModel,
        codeLens: monaco.languages.CodeLens,
        token: monaco.CancellationToken
      ): monaco.languages.ProviderResult<monaco.languages.CodeLens> {
        return codeLens;
      },
    });
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
}
