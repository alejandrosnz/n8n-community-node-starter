import { INodeProperties, INodePropertyOptions } from "n8n-workflow";
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
            (request: any) => {
              const operation = request.body.operation;
              switch (operation) {
                case ListItemsOperation.OperationId:
                  return { ...request, ...ListItemsOperation.Routing };
                case GetItemOperation.OperationId:
                  return { ...request, ...GetItemOperation.Routing };
                case CreateItemOperation.OperationId:
                  return { ...request, ...CreateItemOperation.Routing };
                case UpdateItemOperation.OperationId:
                  return { ...request, ...UpdateItemOperation.Routing };
                case DeleteItemOperation.OperationId:
                  return { ...request, ...DeleteItemOperation.Routing };
                default:
                  return request;
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