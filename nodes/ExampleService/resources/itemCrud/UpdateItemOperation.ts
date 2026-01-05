import { INodeProperties, INodePropertyOptions } from "n8n-workflow";

export class UpdateItemOperation {
  static readonly OperationId = 'updateItem';

  static readonly Operation: INodePropertyOptions = {
    name: 'Update Item',
    value: UpdateItemOperation.OperationId,
    description: 'Update an existing item',
  };

  static readonly Fields: INodeProperties[] = [
    {
      displayName: 'Item ID',
      name: 'itemId',
      type: 'string',
      displayOptions: {
        show: {
          resource: ['itemCrud'],
          operation: [UpdateItemOperation.OperationId],
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
          operation: [UpdateItemOperation.OperationId],
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
          operation: [UpdateItemOperation.OperationId],
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
          operation: [UpdateItemOperation.OperationId],
        },
      },
      default: 1,
      description: 'The new user ID associated with the item',
    },
  ];

  static readonly Routing = {
    request: {
      method: 'PUT',
      url: '=/posts/{{$parameter.itemId}}',
    },
    send: {
      preSend: [
        (request: any) => {
          const { title, body, userId } = request.body;
          request.body = { title, body, userId };
          return request;
        },
      ],
    },
  };
}