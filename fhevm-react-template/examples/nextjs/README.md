# Next.js FHEVM SDK Example

This example demonstrates how to integrate the FHEVM SDK with Next.js App Router.

## Features

- ✅ Wallet connection with MetaMask
- ✅ Real-time value encryption
- ✅ Multiple encryption types (bool, uint8, uint16, uint32)
- ✅ Clean, modern UI with Tailwind CSS
- ✅ TypeScript support
- ✅ FHEVM SDK React hooks

## Getting Started

### Prerequisites

- Node.js 18 or later
- MetaMask or another Web3 wallet
- Access to a FHEVM-compatible network

### Installation

From the example directory:

```bash
npm install
```

Or from the root:

```bash
npm install
cd examples/nextjs
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Connect Wallet" to connect your MetaMask wallet
2. Once connected, you'll see the encryption demo
3. Select an encryption type (bool, uint8, uint16, uint32)
4. Enter a value to encrypt
5. Click "Encrypt Value" to see the encrypted result
6. The encrypted value can be used in smart contract calls

## Project Structure

```
nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   └── components/
│       ├── WalletConnection.tsx   # Wallet connection component
│       └── EncryptionDemo.tsx     # Encryption demo component
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

## Key Components

### FhevmProvider

Wraps the application and provides FHEVM client context:

```tsx
<FhevmProvider provider={provider}>
  <YourComponents />
</FhevmProvider>
```

### useEncryption Hook

Provides encryption functionality:

```tsx
const { encrypt, encryptBatch, isEncrypting, error } = useEncryption();
```

### useFhevmClient Hook

Access to the FHEVM client state:

```tsx
const { client, isReady, error } = useFhevmClient();
```

## Deployment

Build for production:

```bash
npm run build
npm start
```

Or deploy to Vercel:

```bash
vercel
```

## Learn More

- [FHEVM SDK Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
