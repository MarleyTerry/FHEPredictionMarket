# FHEVM SDK - Universal Toolkit for Confidential Smart Contracts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Agnostic-green.svg)]()

A universal, framework-agnostic SDK for building confidential dApps with FHEVM (Fully Homomorphic Encryption Virtual Machine). This SDK makes encrypted computation on blockchain simple, consistent, and developer-friendly.

## 🎯 Competition Submission

This is the next generation of FHEVM development tooling - a unified SDK that wraps all necessary packages and provides a clean, wagmi-like API structure for building confidential applications.

## ✨ Features

- **🔧 Framework Agnostic**: Works with React, Next.js, Vue, Node.js, or any JavaScript/TypeScript environment
- **📦 All-in-One Package**: Single dependency that includes everything you need
- **🎣 React Hooks**: Intuitive wagmi-style hooks for React developers
- **🔐 Complete FHEVM Support**: Full encryption, decryption, and contract interaction capabilities
- **📝 TypeScript First**: Fully typed with excellent IDE support
- **🚀 Quick Setup**: Get started in less than 10 lines of code
- **📚 Well Documented**: Comprehensive guides and examples

### Live Demo
🌐 **Website**: [https://fhe-prediction-market.vercel.app/](https://fhe-prediction-market.vercel.app/)  demo.mp4

## 🎬 Demo & Documentation

### Video Demonstration
📹 **Video Demo**: `demo.mp4` - Complete setup and usage walkthrough

### Documentation Files
- 📘 **README.md** - This file, main documentation
- 📋 **[COMPETITION_SUMMARY.md](./COMPETITION_SUMMARY.md)** - Complete competition requirements checklist
- 📝 **[SUBMISSION.md](./SUBMISSION.md)** - Competition submission details
- 📊 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview and architecture
- ⚙️ **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

## 🏗️ Project Architecture

```
fhevm-react-template/
│
├── 📦 packages/
│   └── fhevm-sdk/                    # ⭐ Universal SDK Package (CORE DELIVERABLE)
│       ├── dist/                     # ✅ Compiled SDK (ready to use)
│       ├── src/
│       │   ├── core/                 # Framework-agnostic core
│       │   │   ├── FhevmClient.ts
│       │   │   ├── EncryptionService.ts
│       │   │   ├── DecryptionService.ts
│       │   │   └── ContractService.ts
│       │   ├── react/                # React-specific hooks
│       │   │   ├── FhevmProvider.tsx
│       │   │   ├── useFhevmClient.ts
│       │   │   ├── useEncryption.ts
│       │   │   ├── useDecryption.ts
│       │   │   ├── useContract.ts
│       │   │   └── useEncryptedTransaction.ts
│       │   ├── types/                # TypeScript definitions
│       │   └── utils/                # Helper utilities
│       ├── package.json
│       ├── tsconfig.json
│       ├── rollup.config.js          # Build configuration
│       └── README.md
│
├── 🌐 examples/
│   ├── nextjs/                       # ⭐ Next.js Example (REQUIRED)
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   │   ├── api/             # API routes (FHE operations, keys)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/          # React components
│   │   │   │   ├── ui/              # Button, Input, Card
│   │   │   │   ├── fhe/             # FHE-specific components
│   │   │   │   └── examples/        # Banking, Medical examples
│   │   │   ├── lib/                 # Utilities and FHE client
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   └── types/               # TypeScript types
│   │   ├── package.json             # ✅ Integrates @fhevm/sdk
│   │   └── README.md
│   │
│   ├── react-vite/                  # React + Vite example
│   │   ├── src/
│   │   │   ├── components/          # WalletConnect, EncryptionDemo
│   │   │   ├── App.tsx              # Main application
│   │   │   ├── main.tsx             # Entry point
│   │   │   └── index.css            # Styles
│   │   ├── package.json             # ✅ Integrates @fhevm/sdk
│   │   ├── vite.config.ts           # Vite configuration
│   │   └── README.md
│   │
│   └── prediction-market/           # Real-world application example
│       ├── contracts/               # FHEVM Solidity contracts
│       ├── scripts/                 # Deployment scripts
│       ├── src/                     # React frontend
│       └── README.md
│
├── 📑 templates/                    # Example templates (per bounty.md)
│   ├── nextjs/                      # Next.js template
│   ├── react/                       # React template
│   ├── vue/                         # Vue template (placeholder)
│   └── nodejs/                      # Node.js template (placeholder)
│
├── 🔧 contracts/                    # Shared Solidity contracts
├── 🚀 scripts/                      # Deployment and utility scripts
│
├── 📄 Documentation Files
│   ├── README.md                    # Main documentation (this file)
│   ├── COMPETITION_SUMMARY.md       # Requirements checklist
│   ├── SUBMISSION.md                # Competition submission
│   ├── PROJECT_SUMMARY.md           # Project overview
│   ├── SETUP.md                     # Setup instructions
│   └── CONTRIBUTING.md              # Contribution guide
│
├── 🎬 demo.mp4                      # Video demonstration
├── 📦 package.json                  # Root workspace config
└── 📄 LICENSE                       # MIT License
```

## 🚀 Quick Start

### Installation

Install from the root directory:

```bash
npm install
```

Or install the SDK directly in your project:

```bash
npm install @fhevm/sdk ethers
```

### Basic Usage (Framework Agnostic)

```typescript
import { createFhevmClient, EncryptionService } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Initialize
const provider = new BrowserProvider(window.ethereum);
const client = await createFhevmClient(provider);

// Encrypt a value
const encryptionService = new EncryptionService(client);
const encrypted = await encryptionService.encryptUint32(42);

// Use in contract call
const contract = new Contract(address, abi, signer);
await contract.submitValue(encrypted.data);
```

### React Usage (With Hooks)

```tsx
import { FhevmProvider, useEncryption, useFhevmClient } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';

// Wrap your app
function App() {
  const provider = new BrowserProvider(window.ethereum);

  return (
    <FhevmProvider provider={provider}>
      <YourComponent />
    </FhevmProvider>
  );
}

// Use in components
function YourComponent() {
  const { isReady } = useFhevmClient();
  const { encryptUint32, isEncrypting } = useEncryption();

  const handleSubmit = async () => {
    const encrypted = await encryptUint32(100);
    // Use encrypted value...
  };

  return (
    <button onClick={handleSubmit} disabled={!isReady || isEncrypting}>
      Encrypt & Submit
    </button>
  );
}
```

## 📋 Complete FHEVM Flow

### 1. Initialization

```typescript
import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const client = new FhevmClient({ provider });
await client.init();
```

### 2. Encryption

```typescript
import { EncryptionService } from '@fhevm/sdk';

const service = new EncryptionService(client);

// Single values
const encryptedBool = await service.encryptBool(true);
const encryptedUint32 = await service.encryptUint32(100);

// Batch encryption
const encrypted = await service.encryptBatch(
  contractAddress,
  userAddress,
  [
    { type: 'uint32', value: 100 },
    { type: 'bool', value: true },
    { type: 'address', value: '0x...' }
  ]
);
```

### 3. Decryption (with EIP-712 Signature)

```typescript
import { DecryptionService } from '@fhevm/sdk';

const service = new DecryptionService(signer);

// User-initiated decryption
const value = await service.decryptUint32({
  contractAddress: '0x...',
  ciphertext: '0x...',
  userAddress: '0x...'
});

// Public decryption
const publicValue = await service.publicDecrypt(contractAddress, ciphertext);
```

### 4. Contract Interaction

```typescript
import { ContractService } from '@fhevm/sdk';

const service = new ContractService({
  address: '0x...',
  abi: [...],
  signer
});

// Read methods
const balance = await service.read('balanceOf', [address]);

// Write methods
const tx = await service.write('transfer', [to, amount], { value: ethers.parseEther('0.1') });

// Listen to events
service.on('Transfer', (from, to, amount) => {
  console.log('Transfer:', from, to, amount);
});
```

## 📑 Templates

As required by the competition, this project includes a `templates/` directory with example templates for different frameworks:

### Available Templates

#### Next.js Template (`templates/nextjs/`)
Complete Next.js application with full SDK integration including:
- App Router with API routes for FHE operations
- Comprehensive component library (UI + FHE-specific)
- Real-world use case examples (Banking, Medical)
- Custom hooks and utilities
- Full TypeScript support

#### React Template (`templates/react/`)
React + Vite application demonstrating SDK integration in a traditional React setup.

#### Vue Template (`templates/vue/`)
Placeholder for Vue.js integration (coming soon).

#### Node.js Template (`templates/nodejs/`)
Placeholder for server-side Node.js integration (coming soon).

## 🎨 Examples

### Next.js Example (Required Deliverable)

The Next.js example demonstrates the SDK in a modern React framework with App Router:

```bash
cd examples/nextjs
npm install
npm run dev
```

**Complete Structure:**
- **API Routes**: `/api/fhe/` - Encryption, decryption, and computation endpoints
- **UI Components**: Reusable Button, Input, and Card components
- **FHE Components**: FHEProvider, EncryptionDemo, ComputationDemo, KeyManager
- **Use Case Examples**: Banking and Medical record demos
- **Custom Hooks**: useFHE, useEncryption, useComputation
- **Utilities**: Security, validation, and FHE client helpers
- **TypeScript**: Full type definitions for FHE and API operations

Features:
- Wallet connection with MetaMask
- Real-time encryption demonstration
- Homomorphic computation examples
- Key management interface
- Banking and medical use cases
- Complete TypeScript integration
- Tailwind CSS styling
- SDK integration via React hooks

### React + Vite Example

A lightweight React application demonstrating SDK integration with Vite:

```bash
cd examples/react-vite
npm install
npm run dev
```

Features:
- React 19 with TypeScript
- Vite for fast development
- Wallet connection with MetaMask
- Encryption demonstrations
- Clean and minimal setup
- Full SDK integration via React hooks

### Prediction Market Example (Real-world Application)

A complete confidential prediction market application demonstrating real-world usage:

```bash
cd examples/prediction-market
npm install
npm run compile  # Compile contracts
npm run deploy   # Deploy to network
npm run dev      # Start frontend
```

Features:
- Create encrypted prediction markets
- Place confidential bets
- Resolve markets
- Claim winnings
- Full FHEVM integration

## 🛠️ Development Commands

### Root Level Commands

```bash
# Install all dependencies (root + packages + examples)
npm install

# Build the SDK package
npm run build

# Build SDK only
npm run build:sdk

# Run tests
npm run test

# Lint code
npm run lint

# Lint SDK
npm run lint:sdk

# Lint examples
npm run lint:examples
```

### Example-Specific Commands

#### Next.js Example (REQUIRED)
```bash
cd examples/nextjs
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint code
```

#### React + Vite Example
```bash
cd examples/react-vite
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

#### Prediction Market Example
```bash
cd examples/prediction-market
npm install
npm run dev                    # Start development server
npm run build                  # Build frontend
npm run compile                # Compile Solidity contracts
npm run deploy:localhost       # Deploy to localhost
npm run deploy:sepolia         # Deploy to Sepolia
npm run init-demo              # Initialize demo data
npm run test                   # Run contract tests
```

### SDK Package Commands

```bash
cd packages/fhevm-sdk
npm install
npm run build       # Build the SDK
npm run dev         # Build in watch mode
npm run test        # Run tests
npm run lint        # Lint code
```

## 📚 API Reference

### Core Classes

#### `FhevmClient`
Main client for FHEVM operations.

```typescript
const client = new FhevmClient({ provider });
await client.init();
client.encrypt32(value);
client.createEncryptedInput(contractAddress, userAddress);
```

#### `EncryptionService`
Service for encrypting values.

```typescript
const service = new EncryptionService(client);
await service.encryptUint32(100);
await service.encryptBatch(contractAddress, userAddress, values);
```

#### `DecryptionService`
Service for decrypting values with signatures.

```typescript
const service = new DecryptionService(signer, gatewayUrl);
await service.decryptUint32(params);
await service.publicDecrypt(contractAddress, ciphertext);
```

#### `ContractService`
Service for contract interactions.

```typescript
const service = new ContractService({ address, abi, signer });
await service.read(method, args);
await service.write(method, args, overrides);
```

### React Hooks

#### `useFhevmClient()`
Access the FHEVM client.

```typescript
const { client, isReady, error } = useFhevmClient();
```

#### `useEncryption()`
Encrypt values easily.

```typescript
const { encrypt, encryptBatch, isEncrypting, error } = useEncryption();
const encrypted = await encrypt('uint32', 100);
```

#### `useDecryption(signer, gatewayUrl?)`
Decrypt values with signatures.

```typescript
const { decrypt, publicDecrypt, isDecrypting, error } = useDecryption(signer);
const value = await decrypt('uint32', params);
```

#### `useContract(config)`
Interact with contracts.

```typescript
const { read, write, estimateGas, on, off, isLoading, error } = useContract({
  address, abi, signer
});
```

#### `useEncryptedTransaction(config)`
Send encrypted transactions.

```typescript
const { sendEncryptedTransaction, isLoading, error } = useEncryptedTransaction({
  address, abi, signer
});

await sendEncryptedTransaction({
  method: 'placeBet',
  encryptedInputs: [
    { type: 'uint32', value: 100 },
    { type: 'bool', value: true }
  ],
  additionalArgs: [marketId]
});
```

## 🎥 Video Demo

Check out `demo.mp4` for a complete walkthrough of:
- Setting up the SDK
- Running the examples
- Building a simple encrypted dApp
- Design decisions and architecture

## 📝 Documentation

This project includes comprehensive documentation:

- **[README.md](./README.md)** - Main documentation (this file)
- **[COMPETITION_SUMMARY.md](./COMPETITION_SUMMARY.md)** - Complete requirements checklist and submission status
- **[SUBMISSION.md](./SUBMISSION.md)** - Competition submission details and deliverables
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview and architecture summary
- **[SETUP.md](./SETUP.md)** - Detailed setup and installation instructions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guidelines for contributing to the project
- **[packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)** - SDK package documentation
- **[examples/nextjs/README.md](./examples/nextjs/README.md)** - Next.js example guide
- **[examples/prediction-market/README.md](./examples/prediction-market/README.md)** - Prediction market dApp guide

## 🏆 Competition Criteria Checklist

- ✅ **Usability**: < 10 lines of code to get started
- ✅ **Completeness**: Full FHEVM flow (init, encrypt, decrypt, contracts)
- ✅ **Reusability**: Framework-agnostic core with React adapters
- ✅ **Documentation**: Comprehensive README with examples
- ✅ **Creativity**: Multiple environment showcases (Next.js, React, prediction market)
- ✅ **Next.js Example**: Required demonstration included
- ✅ **SDK Structure**: Clean, modular, wagmi-inspired API
- ✅ **Video Demo**: Complete setup and design walkthrough

## 🌐 Deployment

### Deployment Options

This project can be deployed to various networks:

#### Frontend Deployment
- **Vercel**: Recommended for Next.js examples
- **Netlify**: Alternative for static builds
- **AWS/GCP**: For production deployments

#### Smart Contracts
- **Zama Devnet**: Development and testing
- **Sepolia**: Ethereum testnet with FHEVM support
- **Local Network**: Using Hardhat for development

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built for the Zama FHEVM SDK Competition. Based on the official fhevm-react-template and enhanced with community feedback.

## 📬 Support & Resources

### Getting Help
- 📖 Read the documentation files in this repository
- 🎬 Watch `demo.mp4` for visual walkthrough
- 📋 Check [COMPETITION_SUMMARY.md](./COMPETITION_SUMMARY.md) for complete project overview
- ⚙️ See [SETUP.md](./SETUP.md) for detailed setup instructions
- 🐛 Report issues via GitHub Issues

### Official Resources
- **Zama Documentation**: [https://docs.zama.ai](https://docs.zama.ai)
- **FHEVM GitHub**: [https://github.com/zama-ai/fhevm](https://github.com/zama-ai/fhevm)
- **fhevmjs Library**: [https://github.com/zama-ai/fhevmjs](https://github.com/zama-ai/fhevmjs)

## 📊 Project Status

### ✅ Competition Submission
- **Status**: Complete and ready for submission
- **SDK**: Built and tested
- **Examples**: All working (Next.js, Prediction Market, React Vite)
- **Documentation**: Comprehensive
- **Video Demo**: Included (demo.mp4)
- **Code Quality**: Clean, no unwanted references

See [COMPETITION_SUMMARY.md](./COMPETITION_SUMMARY.md) for detailed checklist.

---

## 🎯 Project Highlights

This project successfully delivers:
- 📦 **Universal SDK** - Works with any JavaScript/TypeScript framework
- 🎣 **React Hooks** - Wagmi-like API for React developers
- 🔐 **Complete FHEVM** - Full encryption/decryption support
- 📝 **TypeScript** - Fully typed with excellent IDE support
- 🚀 **Quick Setup** - Less than 10 lines to get started
- 📚 **Well Documented** - Comprehensive guides and examples
- 🌐 **Multiple Examples** - Next.js (required), Prediction Market, React Vite

---

**Built with ❤️ for the FHEVM Community**

*Part of the Zama FHEVM SDK Competition*
