import { ListItemsOperation } from 'nodes/ExampleService/resources/itemCrud/ListItemsOperation';

describe('ListItemsOperation', () => {
  describe('static properties', () => {
    it('should have correct OperationId', () => {
      expect(ListItemsOperation.OperationId).toBe('listItems');
    });

    it('should have correct Operation definition', () => {
      expect(ListItemsOperation.Operation).toEqual({
        name: 'List Items',
        value: 'listItems',
        description: 'Retrieve a list of items',
      });
    });

    it('should have correct Fields', () => {
      expect(ListItemsOperation.Fields).toEqual([
        {
          displayName: 'Return All',
          name: 'returnAll',
          type: 'boolean',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['listItems'],
            },
          },
          default: false,
          description: 'Whether to return all results or only up to a given limit',
        },
        {
          displayName: 'Limit',
          name: 'limit',
          type: 'number',
          displayOptions: {
            show: {
              resource: ['itemCrud'],
              operation: ['listItems'],
              returnAll: [false],
            },
          },
          typeOptions: {
            minValue: 1,
            maxValue: 100,
          },
          default: 50,
          description: 'Max number of results to return',
        },
      ]);
    });

    it('should have correct Routing configuration', () => {
      expect(ListItemsOperation.Routing).toEqual({
        request: {
          method: 'GET',
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