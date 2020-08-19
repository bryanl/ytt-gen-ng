export class Value {
  name: string;
  raw: string;
  fieldTypes: string[];

  constructor(options: { name: string; raw: string; fieldsTypes: string }) {
    this.fieldTypes = JSON.parse(options.fieldsTypes) as string[];
    this.name = options.name;
    this.raw = options.raw;
  }
}
