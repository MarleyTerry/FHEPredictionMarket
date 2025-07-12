# CI/CD Documentation

Comprehensive Continuous Integration and Continuous Deployment documentation for the Confidential Prediction Market project.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Code Quality Tools](#code-quality-tools)
- [Running CI/CD Locally](#running-cicd-locally)
- [Workflow Details](#workflow-details)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses GitHub Actions for automated CI/CD pipelines that ensure code quality, run tests, and maintain deployment readiness.

### CI/CD Pipeline Features

✅ **Automated Testing** - Runs on every push and pull request
✅ **Multi-Node Support** - Tests on Node.js 18.x and 20.x
✅ **Multi-OS Support** - Tests on Ubuntu and Windows
✅ **Code Quality Checks** - Solhint, ESLint, Prettier
✅ **Security Scanning** - npm audit for vulnerabilities
✅ **Code Coverage** - Integrated with Codecov
✅ **Deployment Checks** - Validates deployment readiness

## GitHub Actions Workflows

### Workflow Files

Located in `.github/workflows/`:

1. **main.yml** - Main CI/CD pipeline
2. **pull-request.yml** - Pull request checks

### Trigger Events

#### Main Pipeline (`main.yml`)

Triggers on:
- Push to `main` branch
- Push to `develop` branch
- Pull requests to `main` or `develop`

#### Pull Request Pipeline (`pull-request.yml`)

Triggers on:
- Pull request opened
- Pull request synchronized
- Pull request reopened

## Code Quality Tools

### 1. Solhint - Solidity Linter

**Configuration**: `.solhint.json`

```bash
# Run Solidity linting
npm run lint:sol

# Auto-fix issues
npm run lint:sol:fix
```

**Rules Applied**:
- Code complexity limit: 8
- Compiler version: >=0.8.20
- Max line length: 120 characters
- Function visibility enforcement
- Named parameters for mappings

### 2. ESLint - JavaScript/TypeScript Linter

```bash
# Run JavaScript linting
npm run lint:js

# Auto-fix issues
npm run lint:js:fix
```

### 3. Prettier - Code Formatter

**Configuration**: `.prettierrc.json`

```bash
# Check formatting
npm run prettier:check

# Auto-format code
npm run prettier:write
```

**Formatting Rules**:
- Print width: 100 (JS/TS), 120 (Solidity)
- Tab width: 2 (JS/TS), 4 (Solidity)
- Single quotes: false
- Semicolons: true
- Trailing commas: ES5

### 4. Combined Linting

```bash
# Run all linters
npm run lint

# Fix all auto-fixable issues
npm run lint:fix
```

## Running CI/CD Locally

### Prerequisites

```bash
# Install dependencies
npm install

# Ensure all dev dependencies are installed
npm ci
```

### Local CI Commands

```bash
# Run complete CI pipeline locally
npm run ci

# Run CI with coverage
npm run ci:coverage

# Individual steps
npm run compile       # Compile contracts
npm test             # Run tests
npm run lint         # Run all linters
npm run prettier:check  # Check formatting
```

### Test Local CI Pipeline

Run the same checks that GitHub Actions will run:

```bash
# Step 1: Clean
npm run clean

# Step 2: Install fresh dependencies
npm ci

# Step 3: Lint
npm run lint:sol
npm run prettier:check

# Step 4: Compile
npm run compile

# Step 5: Test
npm test

# Step 6: Coverage
npm run test:coverage
```

## Workflow Details

### Main CI/CD Pipeline Jobs

#### 1. Build and Test

**Matrix Strategy**:
- Operating Systems: Ubuntu, Windows
- Node.js Versions: 18.x, 20.x

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Compile contracts
5. Run tests
6. Upload test results

**Artifacts**: Test results and coverage data (30 days retention)

#### 2. Code Quality

**Platform**: Ubuntu Latest, Node.js 20.x

**Steps**:
1. Lint Solidity contracts
2. Check code formatting
3. Compile contracts
4. Generate coverage report
5. Upload to Codecov

**Coverage Upload**: Integrated with Codecov for tracking

#### 3. Security Scan

**Checks**:
- npm audit for dependency vulnerabilities
- Audit level: moderate and above
- Generates security summary

#### 4. Build Artifacts

**Generates**:
- Compiled contracts (artifacts/)
- Type definitions
- Build cache

**Retention**: 7 days

#### 5. Deployment Check

**Only on**: Push to `main` branch

**Validates**:
- Deploy script exists
- Verify script exists
- Environment template present
- Contract size within limits

### Pull Request Pipeline Jobs

#### 1. PR Information

Displays:
- PR number and title
- Author
- Source and target branches

#### 2. Quick Checks

**Fast validation**:
- Code formatting
- Solidity linting
- Quick compilation

#### 3. Test Changes

**Complete testing**:
- Runs full test suite
- Comments results on PR

#### 4. Coverage Report

**Generates**:
- Coverage metrics
- Posts coverage table as comment
- Uploads to Codecov

#### 5. Security Check

**Security validation**:
- Runs npm audit
- Posts security status

#### 6. Contract Size Check

**Validates**:
- Contract compilation
- Size limits (24KB for deployment)

#### 7. PR Summary

**Final report**:
- All check statuses
- Pass/fail indication
- Merge readiness

## Environment Variables

### Required Secrets

Configure in GitHub repository settings:

```
CODECOV_TOKEN          # Codecov integration token
```

### Optional Secrets

```
SEPOLIA_RPC_URL       # For testnet integration tests
PRIVATE_KEY           # For deployment tests
ETHERSCAN_API_KEY     # For verification tests
```

## Codecov Integration

### Setup

1. Visit [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Copy the Codecov token
4. Add to GitHub Secrets as `CODECOV_TOKEN`

### Coverage Reports

**Automatic uploads on**:
- Every push to main/develop
- All pull requests

**Coverage metrics tracked**:
- Lines
- Statements
- Functions
- Branches

### Viewing Coverage

```bash
# Generate local coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

## Workflow Status Badges

Add to README.md:

```markdown
![CI/CD](https://github.com/your-org/your-repo/workflows/Main%20CI/CD%20Pipeline/badge.svg)
![Coverage](https://codecov.io/gh/your-org/your-repo/branch/main/graph/badge.svg)
```

## Best Practices

### For Contributors

1. **Run linters before commit**:
   ```bash
   npm run lint
   npm run prettier:write
   ```

2. **Test locally**:
   ```bash
   npm test
   ```

3. **Check CI before pushing**:
   ```bash
   npm run ci
   ```

4. **Keep dependencies updated**:
   ```bash
   npm audit fix
   ```

### For Reviewers

1. **Check CI status** - All checks must pass
2. **Review coverage** - Should not decrease
3. **Check security** - No new vulnerabilities
4. **Validate changes** - Test locally if needed

## Automated Checks Summary

### On Every Push

- ✅ Compile contracts
- ✅ Run all tests
- ✅ Check code quality
- ✅ Scan for security issues
- ✅ Generate coverage

### On Every Pull Request

- ✅ All push checks PLUS:
- ✅ Comment test results
- ✅ Post coverage report
- ✅ Validate merge readiness
- ✅ Check contract size

### On Main Branch Push

- ✅ All checks PLUS:
- ✅ Deployment readiness
- ✅ Build artifacts
- ✅ Tag preparation

## Performance Optimization

### Caching

The workflows cache:
- npm dependencies
- Hardhat compilation cache
- Type definitions

**Benefits**:
- Faster CI runs
- Reduced API calls
- Lower resource usage

### Parallel Execution

Matrix strategy runs:
- 4 parallel jobs for build-and-test
- Independent quality checks
- Concurrent security scans

**Result**: ~50% faster than sequential execution

## Troubleshooting

### Common Issues

#### 1. Tests Failing in CI but Pass Locally

**Causes**:
- Environment differences
- Cached dependencies
- Node version mismatch

**Solution**:
```bash
# Match CI environment
nvm use 20
npm ci  # Clean install
npm test
```

#### 2. Linting Errors

**Causes**:
- Formatting inconsistencies
- Different Solhint rules

**Solution**:
```bash
# Auto-fix most issues
npm run lint:fix
npm run prettier:write
```

#### 3. Coverage Upload Fails

**Causes**:
- Missing CODECOV_TOKEN
- Coverage file not generated

**Solution**:
1. Check GitHub Secrets
2. Verify coverage generation:
   ```bash
   npm run test:coverage
   ls coverage/lcov.info
   ```

#### 4. Build Artifacts Too Large

**Causes**:
- Including node_modules
- Large test files

**Solution**:
- Check `.prettierignore`
- Verify artifact paths in workflow

#### 5. Security Audit Failures

**Causes**:
- Vulnerable dependencies
- Outdated packages

**Solution**:
```bash
# Update dependencies
npm audit fix

# Check specific vulnerabilities
npm audit
```

### Debug Mode

Enable workflow debugging:

1. Go to repository Settings
2. Secrets and variables > Actions
3. Add secret: `ACTIONS_STEP_DEBUG` = `true`

### View Workflow Logs

1. Go to Actions tab in GitHub
2. Select workflow run
3. Click on specific job
4. Expand step details

## Continuous Improvement

### Metrics to Monitor

1. **CI Run Time** - Target: <5 minutes
2. **Test Pass Rate** - Target: 100%
3. **Code Coverage** - Target: >80%
4. **Security Issues** - Target: 0

### Regular Maintenance

**Monthly**:
- [ ] Update Node.js versions in matrix
- [ ] Update action versions
- [ ] Review and update dependencies
- [ ] Check coverage trends

**Quarterly**:
- [ ] Review CI/CD performance
- [ ] Optimize workflow structure
- [ ] Update documentation
- [ ] Security audit review

## Additional Resources

### GitHub Actions

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Action Marketplace](https://github.com/marketplace?type=actions)

### Code Quality

- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Testing & Coverage

- [Hardhat Testing](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)
- [Codecov Documentation](https://docs.codecov.com/)
- [Solidity Coverage](https://github.com/sc-forks/solidity-coverage)

## Quick Reference

### Essential Commands

| Command | Description |
|---------|-------------|
| `npm run ci` | Run full CI pipeline locally |
| `npm run lint` | Run all linters |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run prettier:write` | Format all code |
| `npm test` | Run test suite |
| `npm run test:coverage` | Generate coverage report |
| `npm run compile` | Compile contracts |

### Workflow Files

| File | Purpose | Triggers |
|------|---------|----------|
| `main.yml` | Main CI/CD pipeline | Push, PR to main/develop |
| `pull-request.yml` | PR-specific checks | PR opened/updated |

### Configuration Files

| File | Purpose |
|------|---------|
| `.solhint.json` | Solidity linting rules |
| `.solhintignore` | Solhint ignore patterns |
| `.prettierrc.json` | Code formatting rules |
| `.prettierignore` | Prettier ignore patterns |

---

**Last Updated**: 2025-10-30

For issues with CI/CD, please open an issue in the repository or contact the development team.
