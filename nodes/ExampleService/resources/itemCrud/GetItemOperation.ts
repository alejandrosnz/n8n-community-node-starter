import { INodeProperties, INodePropertyOptions } from "n8n-workflow";

export class GetItemOperation {
  static readonly OperationId = 'getItem';

  static readonly Operation: INodePropertyOptions = {
    name: 'Get Item',
    value: GetItemOperation.OperationId,
    description: 'Retrieve a single item by ID',
  };

  static readonly Fields: INodeProperties[] = [
    {
      displayName: 'Item ID',
      name: 'itemId',
      type: 'string',
      displayOptions: {
        show: {
          resource: ['itemCrud'],
          operation: [GetItemOperation.OperationId],
        },
      },
      default: '',
      required: true,
      description: 'The ID of the item to retrieve',
    },
  ];

  static readonly Routing = {
    request: {
      method: 'GET',
      url: '=/posts/{{$parameter.itemId}}',
    },
  };
}