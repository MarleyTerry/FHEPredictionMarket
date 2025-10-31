# @fhevm/sdk

Universal SDK for building confidential dApps with FHEVM (Fully Homomorphic Encryption Virtual Machine).

## Installation

```bash
npm install @fhevm/sdk ethers
```

## Quick Start

### Basic Usage (Node.js / JavaScript)

```typescript
import { createFhevmClient, EncryptionService } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Create client
const provider = new BrowserProvider(window.ethereum);
const client = await createFhevmClient(provider);

// Encrypt values
const encryptionService = new EncryptionService(client);
const encrypted = await encryptionService.encryptUint32(42);
```

### React Usage

```tsx
import { FhevmProvider, useEncryption } from '@fhevm/sdk/react';

function App() {
  return (
    <FhevmProvider provider={provider}>
      <YourComponent />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { encryptUint32 } = useEncryption();

  const handleEncrypt = async () => {
    const result = await encryptUint32(100);
    console.log('Encrypted:', result);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## Features

- ✅ Framework agnostic core
- ✅ React hooks for easy integration
- ✅ Full TypeScript support
- ✅ Complete FHEVM functionality
- ✅ Wagmi-like API design
- ✅ EIP-712 signature support

## Documentation

See the [main README](../../README.md) for complete documentation.

## License

MIT
