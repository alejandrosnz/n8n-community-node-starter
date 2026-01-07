# n8n-community-node-starter

**A production-ready boilerplate for building n8n community nodes with agentic-first development, comprehensive testing, and automated CI/CD.**

[![Build Status](https://github.com/yourusername/n8n-community-node-starter/workflows/CI/badge.svg)](https://github.com/yourusername/n8n-community-node-starter/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## The Problem with the Official Starter

The official n8n-nodes-starter gets you started, but leaves you to figure out the hard parts:

- **No testing setup** → Bugs slip into production
- **No CI/CD guidance** → Manual, error-prone releases
- **Minimal documentation** → Steep learning curve for newcomers
- **No agentic IDE support** → Can't leverage modern AI coding assistants

If you've struggled building your first community node, or spent hours debugging issues that tests would have caught, this starter is for you.

---

## The Solution: Agentic-First Development

This starter is built for **modern development workflows**:

✅ **Agentic IDE compatible** → Works seamlessly with Claude, Cursor, Windsurf, and other AI coding assistants  
✅ **Comprehensive testing** → Catch bugs before they reach production  
✅ **Automated CI/CD** → Tests run on every PR, safe merges to master  
✅ **TypeScript-first** → Full type safety and IntelliSense  
✅ **Best practices baked in** → Declarative architecture, proper routing patterns  
✅ **Production-ready** → From zero to published node in hours, not days  

---

## Why Choose This Starter?

| Feature                  | Official Starter | n8n-community-node-starter |
|--------------------------|------------------|----------------------------|
| Testing Setup            | ❌ None          | ✅ Unit + Integration      |
| Agentic IDE Support      | ❌ None          | ✅ AGENTS.md + sub-agents  |
| CI/CD Pipeline           | ⚠️ Basic         | ✅ Tests + Auto-release    |
| Documentation            | ⚠️ Minimal       | ✅ Comprehensive           |
| Code Quality Tools       | ⚠️ Basic         | ✅ ESLint + Prettier       |
| Example Implementation   | ⚠️ Hello World   | ✅ Real API (JSONPlaceholder) |

---

## Agentic-First Development

This starter is designed to work seamlessly with modern AI coding assistants like **Claude, Cursor, Windsurf, GitHub Copilot**, and more.

### How It Works

1. **`AGENTS.md`** → Complete development guide compatible with all modern agentic IDEs
2. **`agents/` directory** → Specialized sub-agents for specific tasks:
   - Test creation
   - Workflow implementation

### Development Flow

```bash
# 1. Reference AGENTS.md in your IDE
# Claude Code, Cursor, Windsurf will automatically understand the project structure

# 2. Ask your coding assistant to create operations
"Create a new 'getUser' operation for the Users resource"

# 3. Tests are generated automatically
"Add comprehensive tests for the getUser operation"

# 4. CI/CD catches issues before merge
# Every PR runs: lint → test → build
```

**Result**: Faster development, fewer bugs, consistent code quality.

---

## Features

- 🤖 **Agentic-first architecture** – AGENTS.md + specialized sub-agents for AI coding assistants
- ✅ **Comprehensive testing** – Unit tests + workflow integration tests with Jest and nock
- 🔄 **Automated CI/CD** – GitHub Actions pipeline: lint → test → build → release
- 🛡️ **Type-safe development** – Full TypeScript support with strict checking
- 📐 **Declarative node pattern** – No custom `execute()` functions, uses routing configuration
- 🎯 **Resource/Operation structure** – Scalable, maintainable node architecture
- 🚀 **Easy releases** – Automated versioning and npm publishing via GitHub Actions
- 🎨 **Code quality tools** – ESLint + Prettier pre-configured
- 📚 **Comprehensive docs** – Architecture, development, and publishing guides

---

## 📚 Documentation

- **[AGENTS.md](./AGENTS.md)** – Complete guide for agentic-first n8n development
- **[AI Agents](./agents/)** – Specialized sub-agents for specific development tasks
- **[Agent Examples](./docs/AGENT_EXAMPLES.md)** – Concrete prompt examples for AI-assisted development
- **[Architecture](./docs/ARCHITECTURE.md)** – Project structure and design patterns
- **[Development](./docs/DEVELOPMENT.md)** – Setup and development workflow
- **[Publishing](./docs/PUBLISHING.md)** – Release and publishing guide

---

## 🚀 Quick Start

### Prerequisites

- Node.js v22 or later
- Basic knowledge of n8n and TypeScript
- A GitHub account for forking the repository

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

# Run tests to verify setup
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

# Run with coverage
npm run test:coverage

# Build and lint
npm run build
npm run lint
```

### 4. Publish

Once your node is ready, publish it to npm. This starter provides two release methods:

#### Option 1: GitHub Actions Release (Recommended)

Use the automated workflow for reliable releases:

1. Go to **Actions** tab in your GitHub repository
2. Select **"Release — publish to npm (manual)"**
3. Click **"Run workflow"**
4. Choose release type (patch/minor/major)
5. Workflow handles: versioning, changelog, git tagging, npm publishing

#### Option 2: Quick Local Release

```bash
# Patch release (1.0.0 -> 1.0.1)
npm run release

# Minor release (1.0.0 -> 1.1.0)
npm run release -- --release-as minor

# Major release (1.0.0 -> 2.0.0)
npm run release -- --release-as major
```

---

## Project Structure

```
├── nodes/
│   └── ExampleService/              # Example node implementation
│       ├── ExampleService.node.ts   # Main node definition
│       ├── example.svg              # Node icon
│       ├── generic/                 # Type definitions
│       └── resources/               # API operations
├── credentials/
│   └── ExampleServiceApi.credentials.ts  # Authentication
├── tests/                           # Test files
│   ├── nodes/                       # Node tests
│   └── workflows/                   # Integration tests
├── agents/                          # Agentic IDE sub-agents
│   ├── operation-generator.md       # Operation creation guide
│   ├── test-generator.md            # Test creation guide
│   └── ...                          # Other specialized agents
├── docs/                            # Documentation
│   ├── AGENT_EXAMPLES.md            # AI prompt examples
│   ├── ARCHITECTURE.md              # Project structure guide
│   ├── DEVELOPMENT.md               # Development setup
│   └── PUBLISHING.md                # Release guide
├── .github/
│   └── workflows/                   # CI/CD pipelines
│       ├── ci.yml                   # Test on every PR
│       └── release.yml              # Automated publishing
├── AGENTS.md                        # Main agentic development guide
├── package.json                     # Node configuration
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
```

---

## 🛠️ Development

### Local Development Setup

1. **Fork and clone** (if not already done):
   ```bash
   # Fork this repository on GitHub
   # Then clone YOUR fork
   git clone https://github.com/yourusername/n8n-community-node-starter.git
   cd n8n-community-node-starter
   npm install
   ```

2. **Link to local n8n** for testing:
   ```bash
   # In this project directory
   npm run build
   npm link

   # In your n8n installation directory
   npm link n8n-nodes-your-api
   ```

3. **Development workflow**:
   ```bash
   # Watch mode (auto-rebuild on changes)
   npm run dev

   # Run tests
   npm test

   # Full build
   npm run build

   # Lint and format
   npm run lint
   npm run format
   ```

### Architecture Overview

This boilerplate follows n8n's recommended patterns:

- **Declarative nodes**: No `execute()` functions, uses routing configuration
- **Resource/Operation separation**: Clean organization of API endpoints
- **TypeScript throughout**: Full type safety and IntelliSense
- **Test-driven**: Unit tests + workflow integration tests

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed explanations.

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/nodes/ExampleService/ExampleService.node.test.ts

# Watch mode (re-run on changes)
npm test -- --watch
```

### Test Structure

- **Unit tests**: Test individual operations, routing, and functions
- **Integration tests**: Test full workflows with NodeTestHarness
- **HTTP mocking**: Uses nock to mock API responses
- **Coverage**: Enforced minimum coverage thresholds

Example test output:
```
✓ ExampleService node tests
  ✓ should load node properties correctly
  ✓ should have correct credentials
  ✓ should route GET requests correctly
  ✓ should handle errors gracefully

✓ Workflow tests
  ✓ should execute getAll operation successfully
  ✓ should create item with correct payload
```

---

## CI/CD

This starter includes GitHub Actions workflows that ensure code quality and automate releases:

### Continuous Integration (CI)

**Triggers**: Every push and pull request

**Pipeline**:
1. ✅ **Lint** – ESLint checks code quality
2. ✅ **Type-check** – TypeScript validates types
3. ✅ **Test** – Jest runs all tests
4. ✅ **Build** – Compiles TypeScript to JavaScript

**Benefit**: Bugs are caught before merging to master. Every PR must pass all checks.

### Automated Release

**Triggers**: Manual workflow dispatch or version tags

**Two release methods**:

#### Method 1: GitHub Actions (Recommended)

1. Go to **Actions** → **"Release — publish to npm (manual)"**
2. Click **"Run workflow"**
3. Select version bump type (patch/minor/major)
4. Workflow automatically:
   - Updates version in `package.json`
   - Generates changelog
   - Creates git tag
   - Publishes to npm

#### Method 2: Local Release

```bash
npm run release              # Patch version
npm run release -- --release-as minor  # Minor version
npm run release -- --release-as major  # Major version
```

For detailed workflow documentation, see [.github/workflows/README.md](.github/workflows/README.md).

---

## Using Agentic IDEs for Development

This starter is optimized for AI-assisted development. Here's how to leverage it:

### Step 1: Open AGENTS.md in Your IDE

Claude Code, Cursor, Windsurf, and other agentic IDEs will automatically detect and use this file as context.

### Step 2: Use Specialized Sub-Agents

Ask your coding assistant to reference specific agents for targeted tasks:

```
"Using the operation-generator agent, create a new 'updateUser' operation
for the Users resource with fields: name, email, role"
```

```
"Using the test-generator agent, create comprehensive tests for the
getUserById operation including error cases"
```

### Step 3: Let CI/CD Verify

Push your changes and let GitHub Actions validate:
- Linting
- Type checking
- All tests pass
- Build succeeds

### Example Prompts

See [docs/AGENT_EXAMPLES.md](docs/AGENT_EXAMPLES.md) for complete examples, including:
- Creating new resources
- Adding operations
- Writing tests
- Implementing error handling
- Setting up authentication

---

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

**Note**: All PRs must pass CI checks (lint, test, build) before merging.

---

## License

MIT License - see [LICENSE](LICENSE) file.

---

## Links & Resources

- **[n8n Documentation](https://docs.n8n.io/)** – Official n8n docs
- **[Community Nodes Guide](https://docs.n8n.io/integrations/community-nodes/)** – How to publish your node
- **[n8n GitHub](https://github.com/n8n-io/n8n)** – n8n source code
- **[JSONPlaceholder API](https://jsonplaceholder.typicode.com/)** – Example API used in this starter

---

## Support

- 🐛 **Found a bug?** [Open an issue](https://github.com/yourusername/n8n-community-node-starter/issues)
- 💡 **Have a feature request?** [Start a discussion](https://github.com/yourusername/n8n-community-node-starter/discussions)
- 📧 **Need help?** Check the [docs/](docs/) directory or open an issue

---

**Built with ❤️ for the n8n community**
