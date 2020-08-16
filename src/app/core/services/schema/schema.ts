export interface SchemaDefinition {
  description?: string;
  properties?: { [key: string]: SchemaDefinition };
  $ref?: string;
  type?: string[] | string;
  items?: SchemaDefinition;
}

export interface SchemaDoc {
  definitions: { [key: string]: SchemaDefinition };
}

export interface ISchema {
  get(id: string): SchemaDefinition;
  description(id: string, path: string[]): string;
  type(id: string, path: string[]): string[];
}

export class Schema implements ISchema {
  constructor(private doc: SchemaDoc) {}

  get(id: string): SchemaDefinition {
    let def = { ...this.doc.definitions[id] };
    if (def.$ref) {
      const child = this.get(resolveRef(def.$ref));
      def.$ref = undefined;
      def = { ...child, ...def };
    }

    if (def.properties) {
      Object.entries(def.properties).forEach(([name, property]) => {
        if (property.$ref) {
          const child = this.get(resolveRef(property.$ref));
          delete def.properties[name].$ref;
          def.properties[name] = { ...child, ...def.properties[name] };
        }

        if (
          property.type === 'array' &&
          property.items &&
          property.items.$ref
        ) {
          const item = this.get(resolveRef(property.items.$ref));
          delete def.properties[name].items.$ref;
          def.properties[name].items = {
            ...item,
            ...def.properties[name].items,
          };
        }
      });
    }

    return def;
  }

  description(id: string, path: string[]): string {
    const visit = (def: SchemaDefinition, p: string[]): string => {
      if (p.length === 0) {
        return def.description;
      }

      if (def && hasType(def, 'array')) {
        return visit(def.items, p);
      }

      if (!def.properties) {
        return '';
      }

      const name = p.shift();
      const prop = def.properties[name];
      return visit(prop, p);
    };

    return visit(this.get(id), path);
  }

  type(id: string, path: string[]): string[] {
    const visit = (def: SchemaDefinition, p: string[]): string[] => {
      if (p.length === 0) {
        if (!def.type) {
          return [];
        } else if (Array.isArray(def.type)) {
          return def.type;
        }
        return [def.type];
      }

      if (def && hasType(def, 'array')) {
        return visit(def.items, p);
      }

      if (!def.properties) {
        return [];
      }

      const name = p.shift();
      const prop = def.properties[name];
      return visit(prop, p);
    };

    return visit(this.get(id), path);
  }
}

const resolveRef = (ref: string): string => {
  return ref.replace(/^#\/definitions\//, '');
};

const hasType = (def: SchemaDefinition, name: string): boolean => {
  if (Array.isArray(def.type)) {
    return (def.type as string[]).includes(name);
  }

  return def.type === name;
};
