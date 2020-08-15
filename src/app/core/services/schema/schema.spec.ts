import { Schema, SchemaDefinition, SchemaDoc } from './schema';

describe('Schema', () => {
  describe('get', () => {
    let schema: Schema;

    let definitions: string;

    beforeAll(() => {
      definitions = JSON.stringify(definitionSource);
    });

    beforeEach(() => {
      schema = new Schema(definitions);
    });

    describe('item with no refs', () => {
      it('returns a definition if it exists', () => {
        expect(schema.get('other')).toEqual(definitionSource.definitions.other);
      });
    });

    describe('item with nested refs', () => {
      it('returns a definition if it exists', () => {
        const foo: SchemaDefinition = {
          description: 'this is foo',
          properties: {
            metadata: {
              properties: {
                other: {
                  description: 'other in metadata',
                  properties: {
                    name: {
                      description: 'name',
                      type: ['string'],
                    },
                  },
                },
              },
              description: 'metadata in foo',
            },
          },
        };
        const x = schema.get('foo');
        console.log(JSON.stringify(x));

        expect(schema.get('foo')).toEqual(foo);
      });
    });
  });
});

const definitionSource: SchemaDoc = {
  definitions: {
    foo: {
      description: 'this is foo',
      properties: {
        metadata: {
          $ref: '#/definitions/metadata',
          description: 'metadata in foo',
        },
      },
    },
    metadata: {
      description: 'metadata',
      properties: {
        other: {
          description: 'other in metadata',
          $ref: '#/definitions/other',
        },
      },
    },
    other: {
      description: 'other',
      properties: {
        name: {
          description: 'name',
          type: ['string'],
        },
      },
    },
  },
};
