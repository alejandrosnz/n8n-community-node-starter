import { ItemCrudResource } from 'nodes/ExampleService/resources/ItemCrudResource';
import {
  ListItemsOperation,
  GetItemOperation,
  CreateItemOperation,
  UpdateItemOperation,
  DeleteItemOperation,
} from 'nodes/ExampleService/resources/itemCrud';

describe('ItemCrudResource', () => {
  describe('static properties', () => {
    it('should have correct ResourceId', () => {
      expect(ItemCrudResource.ResourceId).toBe('itemCrud');
    });

    it('should have correct Resource definition', () => {
      expect(ItemCrudResource.Resource).toEqual({
        name: 'Item: CRUD',
        value: 'itemCrud',
      });
    });

    it('should have Operations array with operation selector and fields', () => {
      expect(ItemCrudResource.Operations.length).toBeGreaterThan(1);

      // First item is the operation selector
      expect(ItemCrudResource.Operations[0]).toEqual({
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: [ItemCrudResource.ResourceId],
          },
        },
        options: [
          ListItemsOperation.Operation,
          GetItemOperation.Operation,
          CreateItemOperation.Operation,
          UpdateItemOperation.Operation,
          DeleteItemOperation.Operation,
        ],
        default: '',
        routing: {
          request: {
            method: 'GET',
            url: '/posts',
          },
          send: {
            preSend: [
              expect.any(Function),
            ],
          },
        },
      });

      // The rest are the Fields from all operations
      const fieldsFromOperations = ItemCrudResource.Operations.slice(1);
      expect(fieldsFromOperations).toEqual([
        ...ListItemsOperation.Fields,
        ...GetItemOperation.Fields,
        ...CreateItemOperation.Fields,
        ...UpdateItemOperation.Fields,
        ...DeleteItemOperation.Fields,
      ]);
    });
  });
});