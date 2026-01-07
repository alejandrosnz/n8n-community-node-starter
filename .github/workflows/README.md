# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for the n8n-nodes-markdown-to-telegram-html project.

## Workflows

### CI — test (`ci.yml`)

**Purpose**: Automated testing and quality checks for pull requests and pushes to the master branch.

**Triggers**:
- Pull requests (any branch)
- Pushes to `master` branch

**What it does**:
1. Sets up Node.js (20.19, 22.x, 24.x) - matching n8n compatibility
2. Installs dependencies
3. Runs ESLint for code linting
4. Runs type checking (if available)
5. Runs Jest test suite with coverage
6. Builds the project
7. Generates coverage summary in job output

**Secrets required**: None

**Usage**: This workflow runs automatically. No manual intervention needed.

---

### Release — publish to npm (`publish.yml`)

**Purpose**: Manual workflow for releasing new versions of the package to npm.

**Triggers**: Manual (`workflow_dispatch`)

**Inputs**:
- `release_type` (choice, optional, default: 'patch'): Auto-increases version (patch/minor/major)
- `branch` (string, optional, default: 'master'): Branch to use for release
- `dry_run` (boolean, optional, default: false): Test mode without publishing

**What it does**:

1. **Pre-release validation**:
   - Checks out the specified branch
   - Verifies working directory is clean (no uncommitted changes)
   - Validates that the target version doesn't already exist on npm
   - Runs tests (lint + test suite)

2. **Version bumping** (separate step):
   - Bumps version in package.json according to release_type
   - Commits the version change locally (not pushed yet)

3. **Build & Release**:
   - Builds the project
   - Runs release-it with `--no-increment` flag to:
     - Generate changelog from commits
     - Create git tag with the already-bumped version
     - Push commits and tags to GitHub
     - Publish to npm
     - Create GitHub release

4. **Post-release**:
   - Verifies the package was published successfully
   - Generates detailed summary with links

**Important**: The workflow uses a **two-step versioning approach** to prevent double-bumping:
- Step 1: Manual `npm version` to bump package.json
- Step 2: Release-it with `--no-increment` to use the already-bumped version

This ensures that if you choose "major", you get exactly the major version (e.g., 1.0.0 → 2.0.0), not 2.0.1.

**Timeout**: 15 minutes (workflow will automatically fail if it takes longer)

**Secrets required**:

#### NPM_TOKEN
npm authentication token for publishing packages.

**How to obtain**:
1. Go to [npmjs.com](https://www.npmjs.com/)
2. Log in to your account
3. Go to "Access Tokens" in your account settings
4. Click "Generate New Token"
5. Select "Automation" or "Publish" type
6. Enable 'Bypass 2FA Authentication' if required
7. Set Read and Write Permissions to All Packages
8. Generate and copy the new token

**How to set in repository**:
1. Go to your GitHub repository
2. Click "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Name: `NPM_TOKEN`
6. Value: Paste your npm token
7. Click "Add secret"

#### GITHUB_TOKEN
GitHub token for repository access (automatically provided by GitHub Actions).

**No manual setup required** - This is automatically available in workflows.

---

**Usage**:
1. Go to GitHub Actions tab
2. Select "Release — publish to npm (manual)"
3. Click "Run workflow"
4. Fill in the inputs:
   - Choose `release_type` (patch/minor/major)
   - Optionally change branch or enable dry_run
5. Click "Run workflow"

**Examples**:
- **Patch release** (1.0.7 → 1.0.8): Leave defaults - for bug fixes and small changes
- **Minor release** (1.0.7 → 1.1.0): Set `release_type` to 'minor' - for new features that are backward compatible
- **Major release** (1.0.7 → 2.0.0): Set `release_type` to 'major' - for breaking changes
- **Dry run**: Set `dry_run` to true - test the release process without publishing

---

### Release Types Explained

**Patch Release (x.y.Z → x.y.Z+1)**:
- Bug fixes and small improvements
- No new features, no breaking changes
- Safe to update automatically
- Example: Fixed a typo in error messages

**Minor Release (x.Y.z → x.Y+1.0)**:
- New features that are backward compatible
- API additions (but not removals)
- Performance improvements
- Example: Added a new optional parameter to an operation

**Major Release (X.y.z → X+1.0.0)**:
- Breaking changes to the API
- Removed features or parameters
- Significant architectural changes
- Example: Changed authentication method or renamed operations

---

## Workflow Summary Outputs

After a successful release, the workflow generates a detailed summary including:

**For successful releases**:
- 📦 Package name and published version
- 🎯 Release type used
- 📊 Previous version (for comparison)
- 🔗 Direct links to:
  - npm package page
  - GitHub release
  - Changelog/compare view
  - Commit history
- 📥 Installation command

**For dry runs**:
- ✅ Validation results
- Current and target versions
- Confirmation that no changes were made

**For failures**:
- ❌ Error status
- Release details attempted
- Common troubleshooting tips

---

## Troubleshooting

### Release fails with "version already exists on npm"

**Cause**: The version you're trying to publish already exists on npm.

**Solutions**:
- Check existing versions: `npm view <package-name> versions`
- Choose a different release type (patch/minor/major)
- The workflow now validates this BEFORE making any changes, so you'll catch this early

### "NPM_TOKEN not found" error

**Cause**: The NPM_TOKEN secret is not configured or has expired.

**Solutions**:
- Verify the token exists in repository Settings → Secrets and variables → Actions
- Generate a new token on npmjs.com if the old one expired
- Ensure the token has "Automation" or "Publish" permissions with write access

### Tests fail during release

**Cause**: The workflow runs `npm run lint` and `npm test` before releasing.

**Solutions**:
- Fix the failing tests locally first
- Run tests locally: `npm run lint && npm test`
- Commit fixes and try the release again
- If tests or lint aren't configured, the workflow will warn but continue

### Tests fail in CI but pass locally

**Possible causes**:
- Different Node.js versions (CI tests on 20.19, 22.x, and 24.x)
- Missing dependencies (check if all dev dependencies are in package.json)
- Environment-specific issues

**Solutions**:
- Test locally with the same Node version: `nvm use 20.19` or `nvm use 22`
- Run `npm ci` instead of `npm install` to match CI behavior
- Check CI logs for specific error messages
