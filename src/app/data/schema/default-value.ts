export interface DefaultValueOptions {
  name: string;
  raw: string;
  fieldsTypes: string;
  description?: string;
}

/**
 * DefaultValue is a default value for a manifest.
 */
export class DefaultValue {
  name: string;
  raw: string;
  fieldTypes: string[];
  description: string;

  constructor(options: DefaultValueOptions) {
    this.fieldTypes = JSON.parse(options.fieldsTypes) as string[];
    this.name = options.name;
    this.raw = options.raw;
    this.description = options.description;
  }
}
