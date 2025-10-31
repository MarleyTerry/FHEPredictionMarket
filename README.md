# Confidential Prediction Market - Monorepo

A comprehensive repository containing multiple implementations of decentralized prediction markets built with Solidity, Hardhat, React, and Fully Homomorphic Encryption (FHE) technology. Users can create markets, place confidential bets, and claim winnings while maintaining complete privacy.

## 📦 Repository Contents

This monorepo contains three distinct projects:

1. **Root Prediction Market** - Main implementation with full FHE integration
2. **Standalone Prediction Market** (`prediction-market/`) - Independent React + Vite application
3. **FHEVM SDK & Templates** (`fhevm-react-template/`) - Reusable SDK with Next.js and React examples

Each project can be developed, deployed, and maintained independently while sharing common smart contract patterns and best practices.

## Features

- **Confidential Betting**: Place bets with encrypted amounts and predictions using FHE
- **Market Creation**: Anyone can create prediction markets with custom questions and durations
- **Decentralized Resolution**: Market creators resolve outcomes after the market ends
- **Fair Payouts**: Automated payout calculation based on winning pool distribution
- **Emergency Recovery**: Built-in emergency withdrawal mechanism for stuck funds
- **Gas Optimized**: Efficient smart contract design with optimized storage patterns

## 🔗 Smart Contract

**Contract Address (Sepolia)**: `0xdd3e74ad708CF61B14c83cF1826b5e3816e0de69`

The smart contract handles all prediction market logic including market creation, bet placement, outcome resolution, and winnings distribution. All operations are secured through battle-tested cryptographic protocols.

## 🎬 Demo & Documentation

### Live Demos

This repository hosts multiple live deployments:

#### 1. Main Prediction Market
🌐 **Website**: [https://fhe-prediction-market.vercel.app/](https://fhe-prediction-market.vercel.app/)
- Full-featured prediction market with FHEVM encryption
- Deployed on Vercel
- Connected to Sepolia testnet

#### 2. Standalone Prediction Market
🌐 **Website**: [https://prediction-market-sepia.vercel.app/](https://prediction-market-sepia.vercel.app/)
- Independent implementation
- React + Vite + Hardhat stack
- Real-time market interactions

#### 3. FHEVM SDK Examples
See the [fhevm-react-template README](./fhevm-react-template/README.md) for SDK examples and documentation.

### Video Demonstrations
📹 **Demo Videos**: Comprehensive walkthroughs available showing:
- **Main App**: Connect Web3 wallet, browse markets, place encrypted bets
- **Prediction Market**: Create markets, place bets, claim winnings
- **SDK Usage**: Integration examples with Next.js and React
- **Transaction Examples**: On-chain operations and gas optimization

### Documentation Files
- **DEPLOYMENT.md**: Comprehensive deployment guide
- **TESTING.md**: Testing strategies and test coverage
- **SECURITY.md**: Security considerations and best practices
- **CICD.md**: CI/CD pipeline setup and automation
- **CONTRACT_INFORMATION.md**: Smart contract details and addresses

## Technology Stack

### Backend & Smart Contracts
- **Smart Contracts**: Solidity ^0.8.25 with Cancun EVM
- **Development Framework**: Hardhat 2.24.3
- **Encryption**: FHEVM (Fully Homomorphic Encryption Virtual Machine)
- **FHE Library**: @fhevm/solidity ^0.8.0
- **Testing Framework**: Hardhat + Chai + Mocha
- **Deployment Tools**: Hardhat Ethers Plugin, Hardhat Toolbox
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Compiler Optimization**: Enabled (800 runs)

### Frontend & UI
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Language**: TypeScript 5.8.3
- **Web3 Library**: ethers.js 6.13.4
- **Linting**: ESLint 9.33.0 with TypeScript ESLint 8.39.1
- **React Plugins**:
  - @vitejs/plugin-react 5.0.0
  - eslint-plugin-react-hooks 5.2.0
  - eslint-plugin-react-refresh 0.4.20

### Development & Tooling
- **Package Manager**: npm
- **Environment Management**: dotenv 17.2.2
- **Build Polyfills**: buffer 6.0.3, process 0.11.10
- **Type Definitions**:
  - @types/react 19.1.10
  - @types/react-dom 19.1.7
  - @types/node (via Hardhat)
  - @types/minimatch 5.1.2

### Deployment & Infrastructure
- **RPC Endpoint**: Sepolia RPC (https://rpc.sepolia.org)
- **Block Explorer**: Etherscan (Sepolia)
- **Gas Limit**: 30,000,000 (local), Standard (Sepolia)
- **Chain Support**: Hardhat local network, Sepolia testnet

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git
- MetaMask or compatible Web3 wallet

## 🚀 Quick Start Guide

Choose the project you want to work with:

### Option 1: Root Prediction Market (Recommended for beginners)

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Start development server
npm run dev
```

### Option 2: Standalone Prediction Market

```bash
# Navigate to subdirectory
cd prediction-market

# Install and run
npm install
npm run dev
```

### Option 3: FHEVM SDK Development

```bash
# Navigate to SDK project
cd fhevm-react-template

# Build SDK
npm install
npm run build:sdk

# Run Next.js example
cd examples/nextjs && npm install && npm run dev

# Or run React Vite example
cd examples/react-vite && npm install && npm run dev
```

## 📋 Detailed Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd confidential-prediction-market
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

### 5. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

### 6. Verify Contract

```bash
npm run verify:sepolia
```

## Project Structure

This repository contains multiple projects:

### Root Level (Main Prediction Market)
```
confidential-prediction-market/
├── contracts/              # Solidity smart contracts
│   ├── PredictionMarket.sol           # Main contract
│   └── PredictionMarketSimple.sol     # Simplified version
├── scripts/               # Deployment and interaction scripts
│   ├── deploy.js         # Main deployment script
│   ├── verify.js         # Contract verification script
│   ├── interact.js       # Contract interaction examples
│   └── simulate.js       # Full lifecycle simulation
├── test/                  # Test suite
│   └── PredictionMarket.test.js
├── src/                   # Frontend source code
│   ├── components/       # React components
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript definitions
│   └── App.tsx           # Main application
├── artifacts/             # Compiled contracts (generated)
├── cache/                 # Hardhat cache (generated)
├── dist/                  # Build output (generated)
├── hardhat.config.cjs    # Hardhat configuration
├── vite.config.ts        # Vite configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

### Prediction Market Subdirectory
```
prediction-market/         # Standalone prediction market implementation
├── contracts/            # FHEVM smart contracts
│   └── PredictionMarket.sol
├── scripts/              # Deployment scripts
│   ├── deploy.ts
│   └── initialize-demo.ts
├── src/                  # React frontend
│   ├── components/
│   ├── utils/
│   ├── types/
│   └── App.tsx
├── artifacts/            # Compiled contracts
├── hardhat.config.cjs
├── vite.config.ts
├── package.json
└── README.md

fhevm-react-template/     # FHEVM SDK and examples
├── packages/
│   └── fhevm-sdk/       # Universal FHEVM SDK
├── examples/
│   ├── nextjs/          # Next.js example
│   ├── react-vite/      # React + Vite example
│   └── prediction-market/ # Prediction market example
├── templates/           # Project templates
└── README.md
```

## Smart Contract Overview

### Key Components

**PredictionMarket.sol** - Main contract implementing:

- Market creation with customizable duration
- Encrypted bet placement using FHE
- Market resolution by creators
- Automated winnings distribution
- Emergency fund recovery mechanism

### Contract Parameters

- **MIN_BET**: 0.001 ETH
- **MAX_BET**: 10 ETH
- **Emergency Withdrawal Period**: 30 days after market end

### Main Functions

#### For All Users

```solidity
// Create a new prediction market
function createMarket(string memory _question, uint256 _duration) external returns (uint256)

// Place a bet on a market
function placeBet(uint256 _marketId, bool _prediction) external payable

// Claim winnings after market resolution
function claimWinnings(uint256 _marketId) external

// View market information
function getMarket(uint256 _marketId) external view returns (...)
```

#### For Market Creators

```solidity
// Resolve a market with outcome
function resolveMarket(uint256 _marketId, bool _outcome) external

// Emergency withdrawal after 30 days
function emergencyWithdraw(uint256 _marketId) external
```

## Development Workflow

### Running Local Node

```bash
npm run node
```

This starts a local Hardhat network on `localhost:8545`.

### Local Deployment

```bash
npm run deploy:localhost
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
npm run test:gas

# Run tests with coverage
npm run test:coverage
```

### Interacting with Contracts

```bash
# Interact with deployed contract
npm run interact:sepolia

# Run full simulation
npm run simulate:sepolia
```

## Working with Multiple Projects

This repository contains three distinct projects that can be worked on independently:

### 1. Root Prediction Market (Main Project)
```bash
# From root directory
npm install
npm run compile
npm test
npm run dev
```

### 2. Standalone Prediction Market
```bash
# Navigate to subdirectory
cd prediction-market
npm install
npm run compile
npm run dev
```

### 3. FHEVM React Template & SDK
```bash
# Navigate to SDK project
cd fhevm-react-template

# Build SDK
npm install
npm run build:sdk

# Run Next.js example
cd examples/nextjs
npm install
npm run dev

# Run React Vite example
cd examples/react-vite
npm install
npm run dev
```

## Available Scripts

### Root Project Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run test suite |
| `npm run test:gas` | Run tests with gas reporting |
| `npm run test:coverage` | Generate test coverage report |
| `npm run deploy` | Deploy to configured network |
| `npm run deploy:localhost` | Deploy to local Hardhat network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |
| `npm run interact:sepolia` | Interact with deployed contract |
| `npm run simulate:sepolia` | Run full lifecycle simulation |
| `npm run node` | Start local Hardhat node |
| `npm run clean` | Clean artifacts and cache |
| `npm run dev` | Start frontend development server |
| `npm run build` | Build frontend for production |

### Prediction Market Subdirectory Scripts

```bash
cd prediction-market
npm run dev              # Start development server
npm run build            # Build for production
npm run compile          # Compile contracts
npm run deploy:localhost # Deploy to local network
npm run deploy:sepolia   # Deploy to Sepolia
npm run init-demo        # Initialize demo data
npm run test             # Run contract tests
```

### FHEVM Template Scripts

```bash
cd fhevm-react-template
npm run build:sdk        # Build the SDK package
npm run lint:sdk         # Lint SDK code
npm run test             # Run tests

# For examples
cd examples/nextjs       # or react-vite
npm run dev              # Start development
npm run build            # Build for production
```

## Testing

The project includes comprehensive tests covering:

- ✅ Contract deployment
- ✅ Market creation and validation
- ✅ Bet placement with various scenarios
- ✅ Market resolution mechanisms
- ✅ Winnings claim process
- ✅ Emergency withdrawal functionality
- ✅ Edge cases and error handling

Run tests with:

```bash
npm test
```

Example output:
```
PredictionMarket
  Deployment
    ✓ Should deploy with zero markets initially
    ✓ Should set correct MIN_BET and MAX_BET constants
  Market Creation
    ✓ Should create a market successfully
    ✓ Should create market with correct properties
    ...
  47 passing (2s)
```

## Deployment

### Prerequisites for Deployment

1. **Sepolia ETH**: Get testnet ETH from faucets:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. **Etherscan API Key**: Register at https://etherscan.io/myapikey

### Deployment Steps

1. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Compile Contracts**
   ```bash
   npm run compile
   ```

3. **Deploy to Sepolia**
   ```bash
   npm run deploy:sepolia
   ```

4. **Verify on Etherscan**
   ```bash
   npm run verify:sepolia
   ```

5. **Test Deployment**
   ```bash
   npm run interact:sepolia
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Usage Examples

### Creating a Market

```javascript
const { ethers } = require("hardhat");

async function createMarket() {
  const PredictionMarket = await ethers.getContractAt(
    "PredictionMarket",
    "DEPLOYED_ADDRESS"
  );

  const question = "Will ETH reach $5000 by next month?";
  const duration = 30 * 24 * 60 * 60; // 30 days

  const tx = await PredictionMarket.createMarket(question, duration);
  const receipt = await tx.wait();

  console.log("Market created! Transaction:", receipt.hash);
}
```

### Placing a Bet

```javascript
async function placeBet() {
  const PredictionMarket = await ethers.getContractAt(
    "PredictionMarket",
    "DEPLOYED_ADDRESS"
  );

  const marketId = 0;
  const prediction = true; // YES
  const betAmount = ethers.parseEther("0.01"); // 0.01 ETH

  const tx = await PredictionMarket.placeBet(marketId, prediction, {
    value: betAmount,
  });

  await tx.wait();
  console.log("Bet placed successfully!");
}
```

### Resolving a Market

```javascript
async function resolveMarket() {
  const PredictionMarket = await ethers.getContractAt(
    "PredictionMarket",
    "DEPLOYED_ADDRESS"
  );

  const marketId = 0;
  const outcome = true; // YES won

  const tx = await PredictionMarket.resolveMarket(marketId, outcome);
  await tx.wait();

  console.log("Market resolved!");
}
```

### Claiming Winnings

```javascript
async function claimWinnings() {
  const PredictionMarket = await ethers.getContractAt(
    "PredictionMarket",
    "DEPLOYED_ADDRESS"
  );

  const marketId = 0;

  const tx = await PredictionMarket.claimWinnings(marketId);
  await tx.wait();

  console.log("Winnings claimed!");
}
```

## Security Considerations

### Current Implementation

- ✅ Reentrancy protection on claim functions
- ✅ Access control for market resolution
- ✅ Input validation on all user inputs
- ✅ Safe math operations (Solidity 0.8+)
- ✅ Emergency withdrawal mechanism
- ⚠️ Simplified FHE implementation for demonstration

### Before Production Use

- [ ] Complete professional security audit
- [ ] Implement production-grade FHE encryption
- [ ] Add multi-signature controls for critical functions
- [ ] Implement circuit breakers and pause mechanisms
- [ ] Add comprehensive event monitoring
- [ ] Set up automated security scanning
- [ ] Implement gradual rollout strategy
- [ ] Establish bug bounty program

## Gas Optimization

The contract is optimized for gas efficiency:

- Minimal storage operations
- Efficient data packing
- Optimized loop structures
- Event-driven architecture
- Batch operations where possible

Run gas reports:

```bash
npm run test:gas
```

## Troubleshooting

### Common Issues

**Issue**: Deployment fails with "insufficient funds"
```bash
# Solution: Get more testnet ETH from faucets
```

**Issue**: Verification fails
```bash
# Solution: Ensure ETHERSCAN_API_KEY is set correctly
# Wait a few moments after deployment before verifying
```

**Issue**: Tests fail with timeout
```bash
# Solution: Increase timeout in hardhat.config.cjs
mocha: {
  timeout: 60000
}
```

For more troubleshooting help, see [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting).

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write comprehensive tests for new features
- Follow existing code style and conventions
- Update documentation for any changes
- Ensure all tests pass before submitting PR
- Add gas optimization considerations

## Roadmap

### Completed ✅
- [x] Core prediction market functionality
- [x] FHE integration for confidential betting
- [x] Comprehensive testing suite
- [x] Deployment scripts and documentation
- [x] Frontend interface with React + Vite
- [x] Multiple project implementations (Root, Standalone, SDK)
- [x] TypeScript integration throughout
- [x] CI/CD pipeline setup
- [x] Security audits and optimizations
- [x] Live deployments on Vercel
- [x] FHEVM SDK package with React hooks
- [x] Next.js and React Vite examples
- [x] Comprehensive documentation

### In Progress 🚧
- [ ] Advanced market types (multi-choice, ranges)
- [ ] Mobile-responsive UI improvements
- [ ] Enhanced analytics dashboard

### Planned 📋
- [ ] Liquidity pools for market making
- [ ] Decentralized oracle integration (Chainlink, Band Protocol)
- [ ] Subgraph for event indexing (The Graph)
- [ ] Governance token and DAO
- [ ] Cross-chain deployment (Polygon, Arbitrum, Optimism)
- [ ] Mobile native applications (iOS/Android)
- [ ] Advanced FHE computation features
- [ ] NFT-based market participation rewards
- [ ] Social features and reputation system

## Resources

### Documentation

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js v6 Documentation](https://docs.ethers.org/v6/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Solidity Documentation](https://docs.soliditylang.org)

### Networks

- [Sepolia Testnet Explorer](https://sepolia.etherscan.io)
- [Sepolia Faucet](https://sepoliafaucet.com)

### Tools

- [Hardhat](https://hardhat.org) - Development framework
- [OpenZeppelin](https://openzeppelin.com/contracts) - Secure contract libraries
- [Remix IDE](https://remix.ethereum.org) - Online Solidity IDE

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Zama for FHEVM technology
- OpenZeppelin for secure contract patterns
- Hardhat team for excellent development tools
- Ethereum community for continuous innovation

## Contact

For questions, issues, or suggestions:

- Open an issue in the repository
- Submit a pull request
- Check existing documentation

---

**Disclaimer**: This is experimental software. Use at your own risk. This project is for educational and demonstration purposes. Conduct thorough testing and security audits before any production use.

**Built with Hardhat** | **Powered by FHEVM** | **Deployed on Sepolia**