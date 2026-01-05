import { GetItemOperation } from 'nodes/ExampleService/resources/itemCrud/GetItemOperation';

describe('GetItemOperation', () => {
  describe('static properties', () => {
    it('should have correct OperationId', () => {
      expect(GetItemOperation.OperationId).toBe('getItem');
    });

    it('should have correct Operation definition', () => {
      expect(GetItemOperation.Operation).toEqual({
        name: 'Get Item',
        value: 'getItem',
        description: 'Retrieve a single item by ID',
      });
    });

    it('should have correct Fields', () => {
      expect(GetItemOperation.Fields).toEqual([
        {
          displayName: 'Item ID',
          name: 'itemId',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['getItem'],
            },
          },
          default: '',
          required: true,
          description: 'The ID of the item to retrieve',
        },
      ]);
    });

    it('should have correct Routing configuration', () => {
      expect(GetItemOperation.Routing).toEqual({
        request: {
          method: 'GET',
          url: '=/posts/{{$parameter.itemId}}',
        },
      });
    });
  });
});