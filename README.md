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

## 🏗️ Architecture

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/          # Universal SDK package
│       ├── src/
│       │   ├── core/       # Framework-agnostic core
│       │   │   ├── FhevmClient.ts
│       │   │   ├── EncryptionService.ts
│       │   │   ├── DecryptionService.ts
│       │   │   └── ContractService.ts
│       │   ├── react/      # React-specific hooks
│       │   │   ├── FhevmProvider.tsx
│       │   │   ├── useFhevmClient.ts
│       │   │   ├── useEncryption.ts
│       │   │   ├── useDecryption.ts
│       │   │   ├── useContract.ts
│       │   │   └── useEncryptedTransaction.ts
│       │   ├── types/      # TypeScript definitions
│       │   └── utils/      # Helper utilities
│       └── package.json
│
├── examples/
│   ├── nextjs/            # Next.js example (Required)
│   ├── react-vite/        # React + Vite example
│   └── prediction-market/ # Real-world dApp example
│
├── contracts/             # Solidity contracts
├── scripts/              # Deployment scripts
└── README.md
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

## 🎨 Examples

### Next.js Example (Required Deliverable)

The Next.js example demonstrates the SDK in a modern React framework with App Router:

```bash
cd examples/nextjs
npm install
npm run dev
```

Features:
- Wallet connection
- Real-time encryption demo
- TypeScript integration
- Tailwind CSS styling

### Prediction Market Example (Real-world dApp)

A complete confidential prediction market application imported from a production-ready implementation:

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

From the root directory:

```bash
# Install all dependencies (root + packages + examples)
npm install

# Build the SDK
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Start Next.js example
npm run dev:nextjs

# Start prediction market example
npm run dev:prediction-market

# Compile Solidity contracts
npm run compile

# Deploy contracts
npm run deploy
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

- [Getting Started Guide](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [React Integration](./docs/react-integration.md)
- [Advanced Usage](./docs/advanced-usage.md)
- [Migration Guide](./docs/migration.md)

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

The Next.js example is deployed at: [Your Deployment URL]

Live contracts:
- Sepolia: `0xYourContractAddress`
- Zama Devnet: `0xYourContractAddress`

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built for the Zama FHEVM SDK Competition. Based on the official fhevm-react-template and enhanced with community feedback.

## 📬 Support

- GitHub Issues: [Report issues](https://github.com/your-repo/issues)
- Documentation: [Full docs](https://your-docs-url.com)
- Discord: [Join community](https://discord.gg/your-invite)

---

**Built with ❤️ for the FHEVM community**
