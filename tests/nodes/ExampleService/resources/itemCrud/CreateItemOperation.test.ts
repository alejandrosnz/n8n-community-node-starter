import { CreateItemOperation } from 'nodes/ExampleService/resources/itemCrud/CreateItemOperation';

describe('CreateItemOperation', () => {
  describe('static properties', () => {
    it('should have correct OperationId', () => {
      expect(CreateItemOperation.OperationId).toBe('createItem');
    });

    it('should have correct Operation definition', () => {
      expect(CreateItemOperation.Operation).toEqual({
        name: 'Create Item',
        value: 'createItem',
        description: 'Create a new item',
      });
    });

    it('should have correct Fields', () => {
      expect(CreateItemOperation.Fields).toEqual([
        {
          displayName: 'Title',
          name: 'title',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['createItem'],
            },
          },
          default: '',
          required: true,
          description: 'The title of the item',
        },
        {
          displayName: 'Body',
          name: 'body',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['createItem'],
            },
          },
          default: '',
          description: 'The body content of the item',
        },
        {
          displayName: 'User ID',
          name: 'userId',
          type: 'number',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['createItem'],
            },
          },
          default: 1,
          description: 'The user ID associated with the item',
        },
      ]);
    });

    it('should have correct Routing configuration', () => {
      expect(CreateItemOperation.Routing).toEqual({
        request: {
          method: 'POST',
          url: '/posts',
        },
        send: {
          preSend: [
            expect.any(Function),
          ],
        },
      });
    });
  });
});