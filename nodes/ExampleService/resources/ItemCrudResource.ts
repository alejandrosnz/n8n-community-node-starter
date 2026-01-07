import { INodeProperties, INodePropertyOptions, IHttpRequestOptions } from "n8n-workflow";
import {
  ListItemsOperation,
  GetItemOperation,
  CreateItemOperation,
  UpdateItemOperation,
  DeleteItemOperation,
} from "./itemCrud";
import { ExampleServiceN8nResource } from "../generic/ExampleServiceN8nResource";

export class ItemCrudResource implements ExampleServiceN8nResource {
  static readonly ResourceId = 'itemCrud';
  static readonly Resource: INodePropertyOptions = {
    name: 'Item: CRUD',
    value: ItemCrudResource.ResourceId,
  };
  static readonly Operations: INodeProperties[] = [
    {
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
            (request: IHttpRequestOptions) => {
              const operation = (request.body as { operation: string }).operation;
              switch (operation) {
                case ListItemsOperation.OperationId:
                  return Promise.resolve({ ...request, ...ListItemsOperation.Routing });
                case GetItemOperation.OperationId:
                  return Promise.resolve({ ...request, ...GetItemOperation.Routing });
                case CreateItemOperation.OperationId:
                  return Promise.resolve({ ...request, ...CreateItemOperation.Routing });
                case UpdateItemOperation.OperationId:
                  return Promise.resolve({ ...request, ...UpdateItemOperation.Routing });
                case DeleteItemOperation.OperationId:
                  return Promise.resolve({ ...request, ...DeleteItemOperation.Routing });
                default:
                  return Promise.resolve(request);
              }
            },
          ],
        },
      },
    },
    ...ListItemsOperation.Fields,
    ...GetItemOperation.Fields,
    ...CreateItemOperation.Fields,
    ...UpdateItemOperation.Fields,
    ...DeleteItemOperation.Fields,
  ];
}