export interface SchemaDefinition {
  description: string;
  properties?: { [key: string]: SchemaDefinition };
  $ref?: string;
  type?: string[];
}

export interface SchemaDoc {
  definitions: { [key: string]: SchemaDefinition };
}

export class Schema {
  doc: SchemaDoc;

  constructor(private source: string) {
    this.doc = JSON.parse(source);
  }

  get(id: string): SchemaDefinition {
    let def = { ...this.doc.definitions[id] };
    if (def.$ref) {
      const child = this.get(this.resolveRef(def.$ref));
      def.$ref = undefined;
      def = { ...child, ...def };
    }

    Object.entries(def.properties).forEach(([name, value]) => {
      if (value.$ref) {
        const child = this.get(this.resolveRef(value.$ref));
        delete def.properties[name].$ref;
        def.properties[name] = { ...child, ...def.properties[name] };
      }
    });

    return def;
  }

  resolveRef(ref: string): string {
    console.log('resolving ref', ref);
    return ref.replace(/^#\/definitions\//, '');
  }
}
