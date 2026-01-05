import { INodeProperties, INodePropertyOptions } from "n8n-workflow";

export class ListItemsOperation {
  static readonly OperationId = 'listItems';

  static readonly Operation: INodePropertyOptions = {
    name: 'List Items',
    value: ListItemsOperation.OperationId,
    description: 'Retrieve a list of items',
  };

  static readonly Fields: INodeProperties[] = [
    {
      displayName: 'Return All',
      name: 'returnAll',
      type: 'boolean',
      displayOptions: {
        show: {
          resource: ['itemCrud'],
          operation: [ListItemsOperation.OperationId],
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
          operation: [ListItemsOperation.OperationId],
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
  ];

  static readonly Routing = {
    request: {
      method: 'GET',
      url: '/posts',
    },
    send: {
      preSend: [
        (request: any) => {
          if (!request.query) request.query = {};
          if (request.body.returnAll === false && request.body.limit) {
            request.query._limit = request.body.limit;
          }
          return request;
        },
      ],
    },
  };
}