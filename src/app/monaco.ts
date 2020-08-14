import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import * as YAMLParser from 'yaml-ast-parser';
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import IRange = monaco.IRange;
import ITextModel = monaco.editor.ITextModel;
import CodeLensList = monaco.languages.CodeLensList;

// TODO: move this to the component with notes from: https://github.com/atularen/ngx-monaco-editor/issues/42
const onMonacoLoad = () => {
  console.log((window as any).monaco);

  // const uri = monaco.Uri.parse('a://b/foo.json');
  // console.log('uri:', uri);

  monaco.languages.registerHoverProvider('yaml', {
    provideHover(
      model: monaco.editor.ITextModel,
      position: monaco.Position
    ): monaco.languages.ProviderResult<monaco.languages.Hover> {
      const doc = new Doc(model.getValue());
      const pos = doc.absPosition(position);

      const got = doc.findValueAt(doc.yamlNode, pos);

      if (got) {
        return {
          range: got.range,
          contents: [
            { value: `**${got.name}**` },
            {
              value:
                '```html\n' +
                'This is a placeholder for something more interesting' +
                '\n```',
            },
          ],
        };
      }

      return undefined;
    },
  });

  // const commandId = editor.addCommand(
  //   0,
  //   () => {
  //     // services available in `ctx`
  //     alert('my command is executing!');
  //   },
  //   ''
  // );

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
              id: '12345', // TODO: get the appropriate command from above,
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
};

interface Positionable {
  startPosition: number;
  endPosition: number;
}

const inRange = (p: Positionable, pos: number): boolean => {
  return pos >= p.startPosition && pos <= p.endPosition;
};

const BreakException = {};

interface KeyContents {
  range: IRange;
  name: string;
}

class Doc {
  readonly yamlNode: YAMLParser.YAMLNode;

  constructor(private readonly value: string) {
    this.yamlNode = YAMLParser.safeLoad(value);
  }

  absPosition(position: monaco.Position): number {
    const currentPosition = {
      lineNumber: 1,
      column: 0,
    };

    let pos = 0;

    try {
      [...this.value].forEach((c, i) => {
        if (i === 0) {
          return;
        } else if (c === '\n') {
          currentPosition.lineNumber++;
          currentPosition.column = 0;
        } else {
          currentPosition.column++;
        }

        if (
          currentPosition.lineNumber === position.lineNumber &&
          currentPosition.column === position.column
        ) {
          pos = i;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }

    return pos;
  }

  position(absPosition: number): monaco.IPosition {
    const p = {
      lineNumber: 1,
      column: 0,
    };
    try {
      [...this.value].forEach((c, i) => {
        if (c === '\n') {
          p.lineNumber++;
          p.column = 0;
        } else {
          p.column++;
        }

        if (i === absPosition) {
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }

    return p;
  }

  findValueAt(doc: YAMLParser.YAMLNode, absPos: number): KeyContents {
    switch (doc.kind) {
      case YAMLParser.Kind.MAP:
        const ym = doc as YAMLParser.YamlMap;
        const cur = ym.mappings.find((m) => inRange(m, absPos));

        // hovering over the key?

        if (!cur) {
          return undefined;
        }

        if (inRange(cur.key, absPos)) {
          const start = this.position(cur.key.startPosition);
          const end = this.position(cur.key.endPosition);

          return {
            name: cur.key.value,
            range: {
              endColumn: end.column,
              endLineNumber: end.lineNumber,
              startColumn: start.column,
              startLineNumber: start.lineNumber,
            },
          };
        }
        return this.findValueAt(cur.value, absPos);

      case YAMLParser.Kind.SEQ:
        const seq = doc as YAMLParser.YAMLSequence;
        const seqCur = seq.items.find((s) => inRange(s, absPos));
        if (seqCur) {
          return this.findValueAt(seqCur, absPos);
        }
        return undefined;
    }

    return undefined;
  }
}

export const monacoConfig: NgxMonacoEditorConfig = {
  defaultOptions: {
    theme: 'vs-dark',
    language: 'yaml',
    scrollBeyondLastLine: false,
  } as IStandaloneEditorConstructionOptions,
  onMonacoLoad,
};
