import { UpdateItemOperation } from 'nodes/ExampleService/resources/itemCrud/UpdateItemOperation';

describe('UpdateItemOperation', () => {
  describe('static properties', () => {
    it('should have correct OperationId', () => {
      expect(UpdateItemOperation.OperationId).toBe('updateItem');
    });

    it('should have correct Operation definition', () => {
      expect(UpdateItemOperation.Operation).toEqual({
        name: 'Update Item',
        value: 'updateItem',
        description: 'Update an existing item',
      });
    });

    it('should have correct Fields', () => {
      expect(UpdateItemOperation.Fields).toEqual([
        {
          displayName: 'Item ID',
          name: 'itemId',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['updateItem'],
            },
          },
          default: '',
          required: true,
          description: 'The ID of the item to update',
        },
        {
          displayName: 'Title',
          name: 'title',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['updateItem'],
            },
          },
          default: '',
          description: 'The new title of the item',
        },
        {
          displayName: 'Body',
          name: 'body',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['updateItem'],
            },
          },
          default: '',
          description: 'The new body content of the item',
        },
        {
          displayName: 'User ID',
          name: 'userId',
          type: 'number',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['updateItem'],
            },
          },
          default: 1,
          description: 'The new user ID associated with the item',
        },
      ]);
    });

    it('should have correct Routing configuration', () => {
      expect(UpdateItemOperation.Routing).toEqual({
        request: {
          method: 'PUT',
          url: '=/posts/{{$parameter.itemId}}',
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