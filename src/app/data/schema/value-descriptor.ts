import * as YAMLParser from 'yaml-ast-parser';
import IRange = monaco.IRange;

export class ValueDescriptor {
  keyRange: IRange;
  name: string;
  path: string[];
  node: YAMLParser.YAMLNode;
}
