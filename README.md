# n8n-community-node-starter

A comprehensive boilerplate for creating n8n community nodes with TypeScript, CI/CD, and n8n Agents compatibility.

## What is this repository?

This repository serves as a **starting template** for building custom n8n community nodes. It provides:

- **Clean architecture** following n8n best practices
- **TypeScript support** with proper type definitions
- **n8n Agents compatibility** for AI-assisted workflows
- **Comprehensive testing** with Jest and nock
- **CI/CD pipeline** with GitHub Actions
- **Example implementation** using JSONPlaceholder API
- **AI-assisted development** prompts and guides

## Features

- ✅ **TypeScript-first** development
- ✅ **n8n Agents compatible** (`usableAsTool: true`)
- ✅ **Declarative node architecture** (no custom `execute` functions)
- ✅ **Resource/Operation pattern** for scalable node design
- ✅ **Comprehensive testing** (unit + workflow tests)
- ✅ **GitHub Actions CI/CD** (lint, test, build, release)
- ✅ **ESLint + Prettier** code quality tools
- ✅ **Automated releases** with release-it
- ✅ **AI development prompts** for assisted coding

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/n8n-community-node-starter.git
cd n8n-community-node-starter

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### 2. Customize for Your API

Edit the following files to adapt the boilerplate to your API:

#### Required Changes

**`package.json`**:
```json
{
  "name": "n8n-nodes-your-api",  // ⚠️ IMPORTANT: Must follow n8n naming convention
  "description": "Your API integration for n8n",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "url": "https://github.com/yourusername/n8n-nodes-your-api.git"
  }
}
```

> **⚠️ CRITICAL**: The package name **MUST** follow the format `n8n-nodes-[your-service-name]` for n8n to automatically discover your node. Examples:
> - `n8n-nodes-slack` for Slack integration
> - `n8n-nodes-google-drive` for Google Drive
> - `n8n-nodes-airtable` for Airtable
> 
> Do **NOT** use generic names like `n8n-nodes-boilerplate` or `n8n-nodes-template`.

**`nodes/ExampleService/ExampleService.node.ts`**:
- Change `displayName`, `name`, `description`
- Update `icon` path if you have a custom icon
- Modify `credentials` to match your API authentication

**`credentials/ExampleServiceApi.credentials.ts`**:
- Update `displayName`, `documentationUrl`
- Modify authentication properties (API key, OAuth, etc.)
- Adjust `authenticate` and `test` blocks

**`nodes/ExampleService/resources/itemCrud/`**:
- Rename operations to match your API endpoints
- Update field definitions for your data model
- Modify routing configurations

### 3. Test Your Changes

```bash
# Run tests
npm test

# Build and lint
npm run build
npm run lint

# Test in n8n (link your local development)
# Follow the development docs below
```

### 4. Publish

```bash
# Create a release
npm run release

# Or manually publish
npm publish
```

## Project Structure

```
├── nodes/
│   └── ExampleService/           # Example node implementation
│       ├── ExampleService.node.ts    # Main node definition
│       ├── example.svg               # Node icon
│       ├── generic/                  # Type definitions
│       └── resources/                # API operations
├── credentials/
│   └── ExampleServiceApi.credentials.ts  # Authentication
├── tests/                         # Test files
├── docs/                          # Documentation
│   └── ai-prompts/                # AI development guides
├── .github/
│   └── workflows/                 # CI/CD pipelines
├── package.json                   # Node configuration
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

## Using AI Agents for Development

This boilerplate includes specialized prompts to help AI assistants create n8n nodes. See [docs/ai-prompts/](docs/ai-prompts/) for detailed guides.

### Example Prompt for AI

```
I need to create a new n8n node for the GitHub API. I want to implement:
- List repositories
- Get repository details
- Create issues
- List pull requests

Please use this boilerplate structure and help me:
1. Update the credentials for GitHub API token auth
2. Create the repository resource with CRUD operations
3. Set up proper routing for each endpoint
4. Add comprehensive tests

Base it on the existing ExampleService structure in this n8n-community-node-starter.
```

## Development

### Local Development Setup

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd n8n-community-node-starter
   npm install
   ```

2. **Link to local n8n**:
   ```bash
   # In your n8n installation
   npm link /path/to/this/boilerplate

   # Or use n8n's community node loading
   ```

3. **Development workflow**:
   ```bash
   # Watch mode
   npm run dev

   # Test changes
   npm test

   # Build
   npm run build
   ```

### Architecture Overview

This boilerplate follows n8n's recommended patterns:

- **Declarative nodes**: No `execute()` functions, uses routing configuration
- **Resource/Operation separation**: Clean organization of API endpoints
- **TypeScript throughout**: Full type safety
- **Agent-compatible**: `usableAsTool: true` for AI workflows

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed explanations.

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- tests/nodes/ExampleService/ExampleService.node.test.ts
```

### Test Structure

- **Unit tests**: Test individual operations and routing
- **Integration tests**: Test full workflows with NodeTestHarness
- **Mocking**: Uses nock for HTTP request mocking

## CI/CD

This boilerplate includes GitHub Actions workflows for:

- **CI**: Lint, type-check, test, and build on every PR
- **Release**: Automated publishing on version tags

### Release Process

```bash
# For patch release (1.0.0 -> 1.0.1)
npm run release

# For minor release (1.0.0 -> 1.1.0)
npm run release -- --release-as minor

# For major release (1.0.0 -> 2.0.0)
npm run release -- --release-as major
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file.

## Links

- [n8n Documentation](https://docs.n8n.io/)
- [Community Nodes Guide](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Agents](https://docs.n8n.io/workflows/components/agents/)