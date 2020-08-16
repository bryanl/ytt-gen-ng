import { Schema, SchemaDefinition, SchemaDoc } from './schema';

const definitionSource: SchemaDoc = {
  definitions: {
    foo: {
      description: 'this is foo',
      type: 'object',
      properties: {
        metadata: {
          $ref: '#/definitions/metadata',
          description: 'metadata in foo',
        },
      },
    },
    metadata: {
      description: 'metadata',
      type: 'object',
      properties: {
        other: {
          description: 'other in metadata',
          $ref: '#/definitions/other',
        },
      },
    },
    other: {
      description: 'other',
      type: 'object',
      properties: {
        name: {
          description: 'name',
          type: ['string'],
        },
      },
    },
    arrayContainer: {
      description: 'array container',
      type: 'object',
      properties: {
        array1: {
          description: 'array1',
          type: 'array',
          items: {
            type: 'object',
            description: 'embedded object',
            properties: {
              field1: {
                description: 'field1',
                type: 'string',
              },
            },
          },
        },
        array2: {
          description: 'array2',
          type: 'array',
          items: {
            $ref: '#/definitions/other',
          },
        },
      },
    },
  },
};

const expandedFoo: SchemaDefinition = {
  description: 'this is foo',
  type: 'object',
  properties: {
    metadata: {
      description: 'metadata in foo',
      type: 'object',
      properties: {
        other: {
          description: 'other in metadata',
          type: 'object',
          properties: {
            name: {
              description: 'name',
              type: ['string'],
            },
          },
        },
      },
    },
  },
};

describe('Schema', () => {
  describe('get', () => {
    let schema: Schema;

    beforeEach(() => {
      schema = new Schema(definitionSource);
    });

    interface Test {
      name: string;
      args: {
        id: string;
      };
      want?: SchemaDefinition;
      wantErr?: boolean;
    }

    const tests: Test[] = [
      {
        name: 'item with no refs',
        args: { id: 'other' },
        want: definitionSource.definitions.other,
      },
      {
        name: 'item with nested refs',
        args: { id: 'foo' },
        want: expandedFoo,
      },
      {
        name: 'get from array',
        args: { id: 'arrayContainer' },
        want: definitionSource.definitions.arrayContainer,
      },
    ];

    tests.forEach((tt) => {
      it(tt.name, () => {
        tt.wantErr
          ? expect(() => schema.get(tt.args.id)).toThrow()
          : expect(schema.get(tt.args.id)).toEqual(tt.want);
      });
    });
  });

  describe('type', () => {
    let schema: Schema;

    beforeEach(() => {
      schema = new Schema(definitionSource);
    });

    interface Test {
      name: string;
      args: {
        id: string;
        path: string[];
      };
      want?: string[];
      wantErr?: boolean;
    }

    const tests: Test[] = [
      {
        name: 'at root',
        args: { id: 'foo', path: ['metadata'] },
        want: ['object'],
      },
      {
        name: 'nested',
        args: { id: 'foo', path: ['metadata', 'other', 'name'] },
        want: ['string'],
      },
      {
        name: 'in array',
        args: { id: 'arrayContainer', path: ['array1', 'field1'] },
        want: ['string'],
      },
      {
        name: 'path not found',
        args: { id: 'foo', path: ['not-found'] },
        wantErr: true,
      },
    ];

    tests.forEach((tt) => {
      it(tt.name, () => {
        tt.wantErr
          ? expect(() => schema.type(tt.args.id, tt.args.path)).toThrow()
          : expect(schema.type(tt.args.id, tt.args.path)).toEqual(tt.want);
      });
    });
  });

  describe('description', () => {
    let schema: Schema;

    beforeEach(() => {
      schema = new Schema(definitionSource);
    });

    interface Test {
      name: string;
      args: {
        id: string;
        path: string[];
      };
      want?: string;
      wantErr?: boolean;
    }

    const tests: Test[] = [
      {
        name: 'at root',
        args: { id: 'foo', path: ['metadata'] },
        want: 'metadata in foo',
      },
      {
        name: 'nested',
        args: { id: 'foo', path: ['metadata', 'other', 'name'] },
        want: 'name',
      },
      {
        name: 'in array',
        args: { id: 'arrayContainer', path: ['array1', 'field1'] },
        want: 'field1',
      },
      {
        name: 'path not found',
        args: { id: 'foo', path: ['not-found'] },
        wantErr: true,
      },
    ];

    tests.forEach((tt) => {
      it(tt.name, () => {
        tt.wantErr
          ? expect(() => schema.description(tt.args.id, tt.args.path)).toThrow()
          : expect(schema.description(tt.args.id, tt.args.path)).toEqual(
              tt.want
            );
      });
    });
  });
});
