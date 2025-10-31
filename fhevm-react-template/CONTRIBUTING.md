# Contributing to FHEVM SDK

Thank you for your interest in contributing to the FHEVM SDK! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/fhevm-sdk.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install all dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm run test

# Start examples
npm run dev:nextjs
npm run dev:prediction-market
```

## Project Structure

- `packages/fhevm-sdk/` - Main SDK package
  - `src/core/` - Framework-agnostic core functionality
  - `src/react/` - React-specific hooks and components
  - `src/types/` - TypeScript type definitions
  - `src/utils/` - Utility functions

- `examples/` - Example applications
  - `nextjs/` - Next.js example
  - `prediction-market/` - Real-world dApp example

## Coding Standards

- Use TypeScript for all code
- Follow existing code style (enforced by ESLint)
- Write tests for new features
- Update documentation for API changes
- Keep commits atomic and well-described

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation in `/docs` if you're changing APIs
3. Add tests for new functionality
4. Ensure all tests pass: `npm test`
5. Ensure the build succeeds: `npm run build`
6. Create a Pull Request with a clear description

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
