# AI Agent Prompts for n8n Node Development

This directory contains specialized prompts designed to help AI assistants (like GitHub Copilot, Cursor, or Claude) develop and test n8n community nodes.

## Available Prompts

### [NODE_DEVELOPMENT.md](NODE_DEVELOPMENT.md)
**Purpose**: Guide AI assistants through creating new n8n community nodes from scratch
- Node architecture patterns
- Parameter configuration
- Routing setup
- Best practices for n8n compatibility

### [UNIT_TESTING.md](UNIT_TESTING.md)
**Purpose**: Help AI assistants write comprehensive unit tests for n8n nodes
- Test structure and organization
- Mocking strategies for HTTP requests
- Error handling scenarios
- Binary data testing patterns

### [WORKFLOW_TESTING.md](WORKFLOW_TESTING.md)
**Purpose**: Guide AI assistants in creating workflow-level integration tests
- NodeTestHarness usage
- Workflow JSON structure
- HTTP mocking with nock
- Multi-node workflow testing

### [QUICK_GUIDE.md](QUICK_GUIDE.md)
**Purpose**: Quick reference for using AI to write tests
- Two testing approaches (unit vs workflow)
- Credential schema specification
- AI prompt templates

## How to Use These Prompts

1. **Copy the relevant prompt** into your AI assistant
2. **Provide context** about your specific node (API documentation, credentials, etc.)
3. **Specify the task** you want the AI to help with
4. **Review and iterate** on the generated code

## Example Usage

```
I want to create a new n8n node for [API Service]. Here's the API documentation: [link]
Please use the NODE_DEVELOPMENT.md prompt to help me structure this node.
```

## Contributing

These prompts are designed to evolve with n8n's best practices. If you find improvements or new patterns, consider contributing back to the n8n community.