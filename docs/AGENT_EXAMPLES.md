# Agent Development Examples

This document provides concrete examples of prompts you can use with AI assistants to develop n8n community nodes using this boilerplate. Each example includes the prompt, expected output structure, and implementation notes.

## Prerequisites

Before using these prompts, you should have:
1. Forked this repository on GitHub
2. Cloned your fork locally
3. Renamed the project and updated package.json following the Quick Start guide

The prompts assume you have the n8n-community-node-starter boilerplate set up and are working within it.

## Example 1: Creating a "Users" Resource with CRUD Operations

### Prompt

```
I have an n8n community node starter project set up locally. I need to create a new resource called "Users" for my n8n node that integrates with a REST API. The API has these endpoints:

- GET /users - List all users
- GET /users/{id} - Get user by ID
- POST /users - Create new user
- PUT /users/{id} - Update user
- DELETE /users/{id} - Delete user

User object structure:
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string (admin|user|moderator)"
}

Please help me:
1. Create the UsersResource.ts file in nodes/ExampleService/resources/
2. Create all 5 CRUD operations in nodes/ExampleService/resources/usersCrud/
3. Update the index.ts files to export the new resource
4. Create comprehensive unit tests for all operations
5. Update the main node definition to include the Users resource

Follow the same patterns as the existing ItemCrudResource and its operations in this project.
```

### Expected Output Structure

The agent should create:

```
nodes/ExampleService/resources/
├── UsersResource.ts
└── usersCrud/
    ├── CreateUserOperation.ts
    ├── GetUserOperation.ts
    ├── ListUsersOperation.ts
    ├── UpdateUserOperation.ts
    └── DeleteUserOperation.ts

tests/nodes/ExampleService/resources/
├── UsersResource.test.ts
└── usersCrud/
    ├── CreateUserOperation.test.ts
    ├── GetUserOperation.test.ts
    ├── ListUsersOperation.test.ts
    ├── UpdateUserOperation.test.ts
    └── DeleteUserOperation.test.ts
```

### Implementation Notes

- Follow the exact same pattern as ItemCrudResource
- Use proper TypeScript interfaces for User type
- Include all required fields in operation definitions
- Tests should mock HTTP calls and verify field mappings

## Example 2: Adding OAuth Authentication

### Prompt

```
I have an n8n community node starter project set up locally. I need to add OAuth 2.0 authentication to my n8n node. The API uses OAuth2 with these details:

- Authorization URL: https://api.example.com/oauth/authorize
- Token URL: https://api.example.com/oauth/token
- Scopes: read, write, admin
- Client ID/Secret authentication

Please help me:
1. Update credentials/ExampleServiceApi.credentials.ts to support OAuth2
2. Add OAuth2 flow configuration
3. Update the authenticate block for OAuth token handling
4. Add test for OAuth authentication
5. Update documentation

Use the existing credential structure in this project as a base.
```

### Expected Output Structure

The agent should modify:

```
credentials/ExampleServiceApi.credentials.ts
tests/credentials/ExampleServiceApi.credentials.test.ts
```

### Implementation Notes

- OAuth2 credentials require different properties than API key
- Include scope selection in credentials
- Test should mock OAuth flow
- Update authenticate method to handle token refresh

## Example 3: Generating Integration Tests for Workflow Testing

### Prompt

```
I have an n8n community node starter project set up locally. I need to create integration tests for my n8n node using NodeTestHarness. My node has:

- Users resource with CRUD operations
- API key authentication
- Base URL configuration

Please help me:
1. Create a workflow test file that tests the full CRUD cycle
2. Use NodeTestHarness to simulate n8n environment
3. Mock external API calls with realistic data
4. Test error handling scenarios
5. Include workflow examples in the test

Follow the existing workflow testing patterns in this project.
```

### Expected Output Structure

The agent should create:

```
tests/nodes/ExampleService/ExampleService.workflow.test.ts
```

### Implementation Notes

- Use NodeTestHarness for realistic testing
- Test complete workflows, not just individual operations
- Include both success and error scenarios
- Mock external APIs with nock
- Verify data transformation and field mapping

## General Guidelines for Agent Prompts

### Always Include These Elements

1. **Clear Scope**: Specify exactly what files to create/modify
2. **API Details**: Provide endpoint URLs, data structures, auth methods
3. **Base Reference**: Reference existing patterns in the boilerplate
4. **Test Requirements**: Always demand comprehensive tests
5. **File Structure**: Specify exact file paths and naming conventions

### Best Practices

- **Test-First**: Ask agents to create tests immediately after operations
- **Follow Patterns**: Reference existing files as templates
- **Complete Coverage**: Include all CRUD operations for resources
- **Type Safety**: Emphasize TypeScript interfaces and proper typing
- **Documentation**: Request updates to relevant documentation files

### Common Pitfalls to Avoid

- **Missing Tests**: Always remind agents to create tests
- **Inconsistent Naming**: Use the established naming conventions
- **Incomplete Operations**: Ensure all required fields are included
- **Poor Error Handling**: Include proper error scenarios in tests

## Quick Reference

| Task              | Reference File                     | Key Elements                      |
|-------------------|------------------------------------|-----------------------------------|
| New Resource      | `ItemCrudResource.ts`              | Routing config, operation mapping |
| CRUD Operations   | `CreateItemOperation.ts`           | Field definitions, HTTP config    |
| Authentication    | `ExampleServiceApi.credentials.ts` | Auth properties, test block       |
| Unit Tests        | `CreateItemOperation.test.ts`      | Mock setup, assertion patterns    |
| Integration Tests | `ExampleService.node.test.ts`      | NodeTestHarness usage             |

For more detailed guidance, see the specialized prompts in `../agents/`.
