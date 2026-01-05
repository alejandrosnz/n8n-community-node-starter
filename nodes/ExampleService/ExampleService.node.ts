import { INodeType, INodeTypeDescription } from "n8n-workflow";
import {
  ItemCrudResource,
} from "./resources";

export class ExampleService implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Example Service',
    name: 'exampleService',
    icon: 'file:example.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
    description: 'Interact with Example Service API (JSONPlaceholder)',
    defaults: {
      name: 'Example Service'
    },
    inputs: ['main'],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [
      {
        name: 'exampleServiceApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          ItemCrudResource.Resource,
        ],
        default: '',
        required: true,
      },
      ...ItemCrudResource.Operations,
    ],
  };
}