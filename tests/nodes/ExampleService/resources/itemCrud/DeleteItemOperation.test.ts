import { DeleteItemOperation } from 'nodes/ExampleService/resources/itemCrud/DeleteItemOperation';

describe('DeleteItemOperation', () => {
  describe('static properties', () => {
    it('should have correct OperationId', () => {
      expect(DeleteItemOperation.OperationId).toBe('deleteItem');
    });

    it('should have correct Operation definition', () => {
      expect(DeleteItemOperation.Operation).toEqual({
        name: 'Delete Item',
        value: 'deleteItem',
        description: 'Delete an item by ID',
      });
    });

    it('should have correct Fields', () => {
      expect(DeleteItemOperation.Fields).toEqual([
        {
          displayName: 'Item ID',
          name: 'itemId',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['deleteItem'],
            },
          },
          default: '',
          required: true,
          description: 'The ID of the item to delete',
        },
      ]);
    });

    it('should have correct Routing configuration', () => {
      expect(DeleteItemOperation.Routing).toEqual({
        request: {
          method: 'DELETE',
          url: '=/posts/{{$parameter.itemId}}',
        },
      });
    });
  });
});