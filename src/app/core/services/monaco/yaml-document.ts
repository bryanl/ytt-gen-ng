import * as YAMLParser from 'yaml-ast-parser';
import IRange = monaco.IRange;
import IPosition = monaco.IPosition;

interface Positionable {
  startPosition: number;
  endPosition: number;
}

export interface Value {
  keyRange: IRange;
  name: string;
  path: string[];
}

export interface DocumentPosition {
  position: IPosition;
  character: string;
}

const BreakException = {};

export class YamlDocument {
  readonly yamlNode: YAMLParser.YAMLNode;

  constructor(private readonly value: string) {
    this.yamlNode = YAMLParser.safeLoad(value);
  }

  absPosition(position: monaco.IPosition): number {
    const currentPosition = {
      lineNumber: 1,
      column: 0,
    };

    let pos: number;

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

    if (!pos) {
      throw new Error(`position ${JSON.stringify(position)} is out of bounds`);
    }

    return pos;
  }

  position(absPosition: number): DocumentPosition {
    if (absPosition < 0) {
      throw new Error(`absolute position ${absPosition} is negative`);
    } else if (absPosition > this.value.length - 1) {
      throw new Error(
        `absolute position ${absPosition} is beyond the end of the document`
      );
    }

    let char = '';

    const cursor = {
      lineNumber: 1,
      column: 0,
    };
    try {
      [...this.value].forEach((c, i) => {
        cursor.column++;
        if (c === '\n') {
          cursor.lineNumber++;
          cursor.column = 0;
        }

        char = c;

        if (i >= absPosition) {
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }

    return {
      position: cursor,
      character: char,
    };
  }

  valueAt(absPos: number): Value {
    const visitor = (doc: YAMLParser.YAMLNode, path: string[]): Value => {
      switch (doc.kind) {
        case YAMLParser.Kind.MAP:
          const ym = doc as YAMLParser.YamlMap;
          const cur = ym.mappings.find((m) => inRange(m, absPos));

          if (!cur) {
            return undefined;
          }

          if (inRange(cur.key, absPos)) {
            return this.valueFromScalar(cur.key, path);
          }
          return visitor(cur.value, [...path, cur.key.value]);

        case YAMLParser.Kind.SEQ:
          const seq = doc as YAMLParser.YAMLSequence;
          const seqCur = seq.items.find((s) => inRange(s, absPos));
          if (seqCur) {
            return visitor(seqCur, [...path]);
          }
          return undefined;
      }

      return undefined;
    };

    return visitor(this.yamlNode, []);
  }

  lineValue(line: number): Value {
    let done = false;
    let curColumn = 1;
    let absPos: number;
    while (!done) {
      absPos = this.absPosition({ column: curColumn, lineNumber: line });
      const db = this.position(absPos);
      curColumn++;
      done = /[^\s]/.test(db.character);
    }

    return this.valueAt(absPos);
  }

  private valueFromScalar(s: YAMLParser.YAMLScalar, path: string[]): Value {
    const start = this.position(s.startPosition);
    const end = this.position(s.endPosition);

    return {
      path: [...path, s.value],
      name: s.value,
      keyRange: {
        endColumn: end.position.column,
        endLineNumber: end.position.lineNumber,
        startColumn: start.position.column,
        startLineNumber: start.position.lineNumber,
      },
    };
  }
}

const inRange = (p: Positionable, pos: number): boolean => {
  return pos >= p.startPosition && pos <= p.endPosition;
};
