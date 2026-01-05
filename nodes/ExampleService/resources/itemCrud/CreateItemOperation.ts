import { INodeProperties, INodePropertyOptions } from "n8n-workflow";

export class CreateItemOperation {
  static readonly OperationId = 'createItem';

  static readonly Operation: INodePropertyOptions = {
    name: 'Create Item',
    value: CreateItemOperation.OperationId,
    description: 'Create a new item',
  };

  static readonly Fields: INodeProperties[] = [
    {
      displayName: 'Title',
      name: 'title',
      type: 'string',
      displayOptions: {
        show: {
          resource: ['itemCrud'],
          operation: [CreateItemOperation.OperationId],
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
          operation: [CreateItemOperation.OperationId],
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
          operation: [CreateItemOperation.OperationId],
        },
      },
      default: 1,
      description: 'The user ID associated with the item',
    },
  ];

  static readonly Routing = {
    request: {
      method: 'POST',
      url: '/posts',
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