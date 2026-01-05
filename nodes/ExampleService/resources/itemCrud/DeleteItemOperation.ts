import { INodeProperties, INodePropertyOptions } from "n8n-workflow";

export class DeleteItemOperation {
  static readonly OperationId = 'deleteItem';

  static readonly Operation: INodePropertyOptions = {
    name: 'Delete Item',
    value: DeleteItemOperation.OperationId,
    description: 'Delete an item by ID',
  };

  static readonly Fields: INodeProperties[] = [
    {
      displayName: 'Item ID',
      name: 'itemId',
      type: 'string',
      displayOptions: {
        show: {
          resource: ['itemCrud'],
          operation: [DeleteItemOperation.OperationId],
        },
      },
      default: '',
      required: true,
      description: 'The ID of the item to delete',
    },
  ];

  static readonly Routing = {
    request: {
      method: 'DELETE',
      url: '=/posts/{{$parameter.itemId}}',
    },
  };
}