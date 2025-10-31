# React + Vite + FHEVM SDK Example

This example demonstrates how to use the FHEVM SDK in a React application built with Vite.

## Features

- React 19 with TypeScript
- Vite for fast development
- FHEVM SDK integration for encrypted smart contract interactions
- Wallet connection with MetaMask
- Encryption and decryption demonstrations
- Clean and modern UI

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Access to an FHEVM-compatible network

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── WalletConnect.tsx
│   ├── EncryptionDemo.tsx
│   └── DecryptionDemo.tsx
├── hooks/           # Custom React hooks
│   └── useWallet.ts
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Usage

### 1. Connect Wallet

Click the "Connect Wallet" button to connect your MetaMask wallet.

### 2. Encrypt Values

Use the encryption demo to encrypt values using FHEVM:

```typescript
import { FhevmProvider, useEncryption } from '@fhevm/sdk/react';

function EncryptionDemo() {
  const { encryptUint32, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encryptUint32(42);
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

### 3. Interact with Contracts

Use the SDK to interact with encrypted smart contracts:

```typescript
import { useContract } from '@fhevm/sdk/react';

function ContractDemo() {
  const { write, read } = useContract({
    address: '0x...',
    abi: [...],
    signer
  });

  const handleWrite = async () => {
    await write('submitValue', [encryptedValue]);
  };

  return <button onClick={handleWrite}>Submit</button>;
}
```

## SDK Integration

This example uses the `@fhevm/sdk` package which provides:

- **Framework-agnostic core**: Works with any JavaScript/TypeScript environment
- **React hooks**: Convenient hooks like `useEncryption()`, `useDecryption()`, `useContract()`
- **TypeScript support**: Full type definitions for better development experience
- **Simple API**: Minimal setup required to get started

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Example](../nextjs/README.md)
- [Prediction Market Example](../prediction-market/README.md)

## License

MIT
