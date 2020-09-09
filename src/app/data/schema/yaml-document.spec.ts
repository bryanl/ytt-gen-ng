import * as YAMLParser from 'yaml-ast-parser';
import { DocumentPosition } from './document-position';
import { ValueDescriptor } from './value-descriptor';
import { YamlDocument } from './yaml-document';
import IPosition = monaco.IPosition;

// describe('YamlDocument', () => {
//   describe('find absolute position given a monaco position', () => {
//     const value = ['foo: bar', 'bar: foo'].join('\n');
//
//     interface Test {
//       name: string;
//       args: {
//         value: string;
//         position: IPosition;
//       };
//       want?: number;
//       wantErr?: boolean;
//     }
//
//     const tests: Test[] = [
//       {
//         name: 'position on first line #1',
//         args: { value, position: { lineNumber: 1, column: 1 } },
//         want: 1,
//       },
//       {
//         name: 'position on second line',
//         args: { value, position: { lineNumber: 2, column: 2 } },
//         want: 10,
//       },
//       {
//         name: 'position out of bounds',
//         args: { value, position: { lineNumber: 3, column: 2 } },
//         wantErr: true,
//       },
//     ];
//
//     tests.forEach((tt) => {
//       it(tt.name, () => {
//         const doc = new YamlDocument(tt.args.value);
//
//         tt.wantErr
//           ? expect(() => doc.absPosition(tt.args.position)).toThrow()
//           : expect(doc.absPosition(tt.args.position)).toEqual(tt.want);
//       });
//     });
//   });
//
//   describe('find monaco position given an absolute position', () => {
//     const value = 'foo:\n  bar: baz';
//
//     interface Test {
//       name: string;
//       args: {
//         value: string;
//         absPos: number;
//       };
//       want?: DocumentPosition;
//       wantErr?: boolean;
//     }
//
//     const tests: Test[] = [
//       {
//         name: 'absolute position on first line #1',
//         args: { value, absPos: 2 },
//         want: {
//           character: 'o',
//           position: { lineNumber: 1, column: 3 },
//         } as DocumentPosition,
//       },
//       {
//         name: 'absolute position on first line #2',
//         args: { value, absPos: 0 },
//         want: {
//           character: 'f',
//           position: { lineNumber: 1, column: 1 },
//         } as DocumentPosition,
//       },
//       {
//         name: 'absolute position on first line #3',
//         args: { value, absPos: 3 },
//         want: {
//           character: ':',
//           position: { lineNumber: 1, column: 4 },
//         } as DocumentPosition,
//       },
//       {
//         name: 'absolute position on second line #1',
//         args: { value, absPos: 7 },
//         want: {
//           character: 'b',
//           position: { lineNumber: 2, column: 3 },
//         } as DocumentPosition,
//       },
//       {
//         name: 'absolute position is negative',
//         args: { value, absPos: -1 },
//         wantErr: true,
//       },
//       {
//         name: 'absolute position is beyond the end of the document',
//         args: { value, absPos: value.length + 5 },
//         wantErr: true,
//       },
//     ];
//
//     tests.forEach((tt) => {
//       it(tt.name, () => {
//         const doc = new YamlDocument(tt.args.value);
//
//         tt.wantErr
//           ? expect(() => doc.position(tt.args.absPos)).toThrow()
//           : expect(doc.position(tt.args.absPos)).toEqual(tt.want);
//       });
//     });
//   });
//
//   describe('find value at absolute point', () => {
//     const value1 = 'foo:\n  bar: baz';
//     const value2 = 'foo:\n  - nested:\n    foo: bar';
//
//     interface Test {
//       name: string;
//       args: {
//         value: string;
//         absPos: number;
//       };
//       want?: ValueDescriptor;
//       wantErr?: boolean;
//     }
//
//     const tests: Test[] = [
//       {
//         name: 'find key in root',
//         args: { value: value1, absPos: 2 },
//         want: {
//           name: 'foo',
//           path: ['foo'],
//           node: undefined,
//           keyRange: {
//             endColumn: 4,
//             endLineNumber: 1,
//             startColumn: 1,
//             startLineNumber: 1,
//           },
//         },
//       },
//       {
//         name: 'find nested key',
//         args: { value: value1, absPos: 7 },
//         want: {
//           name: 'bar',
//           path: ['foo', 'bar'],
//           node: undefined,
//           keyRange: {
//             endColumn: 6,
//             endLineNumber: 2,
//             startColumn: 3,
//             startLineNumber: 2,
//           },
//         },
//       },
//       {
//         name: 'nested array',
//         args: { value: value2, absPos: 22 },
//         want: {
//           name: 'foo',
//           path: ['foo', 'foo'],
//           node: undefined,
//           keyRange: {
//             endColumn: 8,
//             endLineNumber: 3,
//             startColumn: 5,
//             startLineNumber: 3,
//           },
//         },
//       },
//       {
//         name: 'out of bounds',
//         args: { value: value1, absPos: 13 },
//         want: undefined,
//       },
//     ];
//
//     tests.forEach((tt) => {
//       it(tt.name, () => {
//         const doc = new YamlDocument(tt.args.value);
//
//         tt.wantErr
//           ? expect(() => doc.valueAt(tt.args.absPos)).toThrow()
//           : expect(doc.valueAt(tt.args.absPos)).toEqual(tt.want);
//       });
//     });
//   });
//
//   describe('find value on line', () => {
//     const value1 = 'foo:\n  bar: baz';
//
//     interface Test {
//       name: string;
//       args: {
//         value: string;
//         line: number;
//       };
//       want?: ValueDescriptor;
//       wantErr?: boolean;
//     }
//
//     const tests: Test[] = [
//       {
//         name: 'find key in root',
//         args: { value: value1, line: 1 },
//         want: {
//           name: 'foo',
//           path: ['foo'],
//           node: {
//             startPosition: 0,
//             endPosition: 1,
//             kind: YAMLParser.Kind.MAP,
//             parent: null,
//             errors: [],
//           },
//           keyRange: {
//             endColumn: 4,
//             endLineNumber: 1,
//             startColumn: 1,
//             startLineNumber: 1,
//           },
//         },
//       },
//       {
//         name: 'find nested key',
//         args: { value: value1, line: 2 },
//         want: {
//           name: 'bar',
//           path: ['foo', 'bar'],
//           node: undefined,
//           keyRange: {
//             endColumn: 6,
//             endLineNumber: 2,
//             startColumn: 3,
//             startLineNumber: 2,
//           },
//         },
//       },
//       {
//         name: 'out of bounds',
//         args: { value: value1, line: 4 },
//         wantErr: true,
//       },
//     ];
//
//     tests.forEach((tt) => {
//       it(tt.name, () => {
//         const doc = new YamlDocument(tt.args.value);
//
//         tt.wantErr
//           ? expect(() => doc.lineValue(tt.args.line)).toThrow()
//           : expect(JSON.stringify(doc.lineValue(tt.args.line))).toEqual(
//               JSON.stringify(tt.want)
//             );
//       });
//     });
//   });
// });
