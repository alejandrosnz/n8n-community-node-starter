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

## Why Choose This Starter?

This starter is designed to be **better than the official n8n starter** in every way:

| Feature | Official Starter | This Starter |
|---------|------------------|--------------|
| Architecture | Programmatic | ✅ Declarative |
| Testing | None | ✅ Unit + Integration |
| CI/CD | None | ✅ GitHub Actions |
| AI Assistance | None | ✅ Specialized prompts |
| Example Code | Minimal | ✅ Complete CRUD |
| Documentation | Basic | ✅ Comprehensive |
| Agent Ready | No | ✅ 100% Compatible |

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

## How It Works

### Declarative Node Architecture

This starter uses **declarative routing** instead of custom execute functions:
- **No boilerplate code**: Define operations as configuration
- **Automatic HTTP handling**: n8n manages requests/responses
- **Better maintainability**: Changes are configuration, not code

### Resource/Operation Pattern

Operations are organized in a scalable hierarchy:
```
YourNode
├── Resource 1 (e.g., "Users")
│   ├── Create User
│   ├── Get User
│   └── Update User
└── Resource 2 (e.g., "Posts")
    ├── List Posts
    └── Delete Post
```

### AI-First Development

Specialized prompts guide AI assistants to:
- Generate properly structured operations
- Create comprehensive tests automatically
- Follow n8n best practices

## 📚 Documentation

- **[AGENTS.md](./AGENTS.md)** - Complete guide for n8n node development with AI assistance
- **[AI Prompts](./agents/)** - Specialized prompts for AI-assisted development
- **[Agent Examples](./docs/AGENT_EXAMPLES.md)** - Concrete prompt examples for AI-assisted development
- **[Architecture](./docs/ARCHITECTURE.md)** - Project structure and design patterns
- **[Development](./docs/DEVELOPMENT.md)** - Setup and development workflow
- **[Publishing](./docs/PUBLISHING.md)** - Release and publishing guide

## Quick Start

### 1. Fork and Setup

```bash
# Fork this repository on GitHub first
# Then clone YOUR fork (replace 'yourusername' with your actual GitHub username)
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
    "url": "https://github.com/alejandrosnz/n8n-nodes-your-api.git"
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

Once your node is ready, you can publish it to npm. This starter provides two release methods:

#### Quick Local Release
```bash
# Create a release (patch/minor/major)
npm run release

# Or manually publish (not recommended)
npm publish
```

#### Recommended: GitHub Actions Release
For a more automated and reliable release process, use the GitHub Actions workflow. See the [CI/CD section](#cicd) below for detailed instructions.

This method handles versioning, changelog generation, git tagging, and npm publishing automatically.

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
├── AGENTS.md                      # Development guide
├── agents/                        # AI development guides
├── docs/                          # Additional documentation
│   ├── AGENT_EXAMPLES.md          # AI prompt examples
│   ├── ARCHITECTURE.md            # Project structure
│   ├── DEVELOPMENT.md             # Setup guide
│   └── PUBLISHING.md              # Release guide
├── .github/
│   └── workflows/                 # CI/CD pipelines
├── package.json                   # Node configuration
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

## Using AI Agents for Development

This boilerplate includes specialized prompts to help AI assistants create n8n nodes. See [agents/](agents/) for detailed guides and [docs/AGENT_EXAMPLES.md](docs/AGENT_EXAMPLES.md) for concrete examples.

### Example Prompt for AI

<details>
<summary>Click to see an example agent prompt</summary>

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

</details>

For more examples, see [Agent Examples](docs/AGENT_EXAMPLES.md).

## Development

### Local Development Setup

1. **Fork and clone** (if not already done):
   ```bash
   # Fork this repository on GitHub
   # Then clone YOUR fork
   git clone https://github.com/yourusername/n8n-community-node-starter.git
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
- **Release**: Automated publishing on version tags OR manual releases via GitHub Actions

### Release Process

You can release new versions in two ways:

#### Option 1: Manual Release via GitHub Actions (Recommended)

Use the "Release — publish to npm" workflow in GitHub Actions:

1. Go to **Actions** tab in your GitHub repository
2. Select **"Release — publish to npm (manual)"**
3. Click **"Run workflow"**
4. Choose release type (patch/minor/major) or specify custom version
5. Click **"Run workflow"**

This method handles versioning, changelog generation, git tagging, and npm publishing automatically.

#### Option 2: Local Release

```bash
# For patch release (1.0.0 -> 1.0.1)
npm run release

# For minor release (1.0.0 -> 1.1.0)
npm run release -- --release-as minor

# For major release (1.0.0 -> 2.0.0)
npm run release -- --release-as major
```

For detailed workflow documentation, see [.github/workflows/README.md](.github/workflows/README.md).

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