# PrivateMarket API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Contract Information](#contract-information)
3. [Core Functions](#core-functions)
4. [Claim Functions](#claim-functions)
5. [Protection Functions](#protection-functions)
6. [View Functions](#view-functions)
7. [Admin Functions](#admin-functions)
8. [Events](#events)
9. [Error Codes](#error-codes)
10. [Integration Examples](#integration-examples)

---

## Overview

The **PrivateMarket** contract provides a complete API for creating and interacting with privacy-preserving prediction markets using Fully Homomorphic Encryption (FHE).

### Contract Address
- **Network**: Ethereum Sepolia Testnet
- **Address**: `[To be deployed]`
- **Compiler**: Solidity ^0.8.25

### Key Features
- Privacy-preserving betting using FHE
- Gateway callback pattern for async decryption
- Automatic refund mechanism
- Timeout protection
- Gas-optimized operations

---

## Contract Information

### Constants

```solidity
uint256 public constant MIN_BET = 0.001 ether;
uint256 public constant MAX_BET = 10 ether;
uint256 public constant DECRYPTION_TIMEOUT = 7 days;
uint256 public constant EMERGENCY_TIMEOUT = 30 days;
uint256 public constant OBFUSCATION_MULTIPLIER = 1000;
uint256 public constant MAX_MARKET_DURATION = 365 days;
```

### State Variables

```solidity
uint256 public marketCounter;        // Total number of markets created
address public owner;                // Contract owner address
bool public paused;                  // Emergency pause status
```

---

## Core Functions

### 1. createMarket

Creates a new prediction market.

**Function Signature:**
```solidity
function createMarket(
    string memory _question,
    uint256 _duration
) external whenNotPaused returns (uint256)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_question` | `string` | Market question (1-500 characters) |
| `_duration` | `uint256` | Market duration in seconds (max 365 days) |

**Returns:**
| Type | Description |
|------|-------------|
| `uint256` | The ID of the newly created market |

**Requirements:**
- Question must not be empty
- Question length ≤ 500 characters
- Duration must be positive
- Duration ≤ MAX_MARKET_DURATION (365 days)
- Contract must not be paused

**Events Emitted:**
```solidity
emit MarketCreated(marketId, question, endTime, creator);
```

**Gas Cost:** ~100,000 gas

**Example:**
```javascript
// Create a 24-hour market
const duration = 24 * 60 * 60; // 24 hours in seconds
const tx = await contract.createMarket(
    "Will ETH price exceed $3000 by tomorrow?",
    duration
);
const receipt = await tx.wait();
const marketId = receipt.events[0].args.marketId;
console.log("Market created:", marketId);
```

---

### 2. placeBet

Place an encrypted bet on a market.

**Function Signature:**
```solidity
function placeBet(
    uint256 _marketId,
    bool _prediction
) external payable whenNotPaused marketExists(_marketId) marketActive(_marketId) validAmount
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Target market ID |
| `_prediction` | `bool` | Bet prediction (true = YES, false = NO) |

**Requirements:**
- Market must exist
- Market must be active (not ended, not resolved)
- msg.value must be between MIN_BET and MAX_BET
- User must not have already placed a bet on this market
- Contract must not be paused

**Events Emitted:**
```solidity
emit BetPlaced(marketId, bettor, timestamp);
```

**Gas Cost:** ~250,000 gas

**Example:**
```javascript
// Place a 0.01 ETH bet on YES
const betAmount = ethers.parseEther("0.01");
const prediction = true; // YES

await contract.placeBet(marketId, prediction, {
    value: betAmount
});
```

---

### 3. requestResolution

Request Gateway decryption to resolve a market.

**Function Signature:**
```solidity
function requestResolution(
    uint256 _marketId
) external marketExists(_marketId) marketEnded(_marketId) onlyCreator(_marketId)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to resolve |

**Requirements:**
- Market must exist
- Market must have ended (block.timestamp ≥ endTime)
- Only market creator can call
- Market must not be already resolved
- Resolution must not have been requested already

**Events Emitted:**
```solidity
emit DecryptionRequested(marketId, requestId, timestamp);
```

**Gas Cost:** ~200,000 gas

**Example:**
```javascript
// Request resolution after market ends
await contract.requestResolution(marketId);

// Monitor for callback
contract.on('MarketResolved', (marketId, outcome) => {
    console.log(`Market resolved: ${outcome ? 'YES' : 'NO'}`);
});
```

---

### 4. resolveMarketCallback

Gateway callback function to resolve market after decryption.

**Function Signature:**
```solidity
function resolveMarketCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `requestId` | `uint256` | Decryption request ID |
| `cleartexts` | `bytes` | Decrypted values from Gateway |
| `decryptionProof` | `bytes` | Cryptographic proof from Gateway |

**Requirements:**
- Valid cryptographic signatures (verified via FHE.checkSignatures)
- Request ID must match a pending request
- Market must not be already resolved

**Events Emitted:**
```solidity
emit MarketResolved(marketId, outcome);
```

**Gas Cost:** ~150,000 gas

⚠️ **Note:** This function is called by the Gateway service, not by users directly.

---

## Claim Functions

### 5. claimWinnings

Claim winnings after market resolution.

**Function Signature:**
```solidity
function claimWinnings(
    uint256 _marketId
) external marketExists(_marketId)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to claim from |

**Requirements:**
- Market must exist
- Market must be resolved
- User must have placed a bet
- User must not have already claimed
- User must be on the winning side

**Events Emitted:**
```solidity
emit WinningsClaimed(marketId, winner, amount);
```

**Gas Cost:** ~120,000 gas

**Payout Formula:**
```
winnings = betAmount + (betAmount × totalLosingPool) / totalWinningPool
```

**Example:**
```javascript
// Check if market is resolved
const market = await contract.getMarket(marketId);
if (market.resolved) {
    // Claim winnings
    await contract.claimWinnings(marketId);
}
```

---

### 6. claimRefund

Claim refund if decryption times out.

**Function Signature:**
```solidity
function claimRefund(
    uint256 _marketId
) external marketExists(_marketId)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to claim refund from |

**Requirements:**
- Market must exist
- Refunds must be enabled (via timeout)
- User must have placed a bet
- User must not have already claimed

**Events Emitted:**
```solidity
emit RefundProcessed(marketId, bettor, amount);
```

**Gas Cost:** ~100,000 gas

**Example:**
```javascript
// Check if refunds are enabled
const market = await contract.getMarket(marketId);
if (market.refundEnabled) {
    await contract.claimRefund(marketId);
}
```

---

## Protection Functions

### 7. enableRefundForTimeout

Enable refunds if Gateway decryption times out.

**Function Signature:**
```solidity
function enableRefundForTimeout(
    uint256 _marketId
) external marketExists(_marketId)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to enable refunds for |

**Requirements:**
- Market must exist
- Market must not be resolved
- Decryption must have been requested
- DECRYPTION_TIMEOUT (7 days) must have passed since request

**Events Emitted:**
```solidity
emit DecryptionTimeout(marketId, requestId);
```

**Gas Cost:** ~50,000 gas

**Example:**
```javascript
// Check timeout status
const status = await contract.getDecryptionStatus(marketId);
if (status.timedOut) {
    await contract.enableRefundForTimeout(marketId);
}
```

---

### 8. emergencyWithdraw

Emergency withdrawal of stuck funds (creator only).

**Function Signature:**
```solidity
function emergencyWithdraw(
    uint256 _marketId
) external marketExists(_marketId) onlyCreator(_marketId)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID |

**Requirements:**
- Market must exist
- Only market creator can call
- EMERGENCY_TIMEOUT (30 days) must have passed since market end
- Market must be resolved OR refunds must be enabled

**Events Emitted:**
```solidity
emit EmergencyWithdrawal(marketId, recipient, amount);
```

**Gas Cost:** ~80,000 gas

⚠️ **Warning:** This is a last-resort function for recovering stuck funds.

---

## View Functions

### 9. getMarket

Get comprehensive market information.

**Function Signature:**
```solidity
function getMarket(
    uint256 _marketId
) external view marketExists(_marketId) returns (
    string memory question,
    uint256 endTime,
    uint256 totalYesBets,
    uint256 totalNoBets,
    bool resolved,
    bool outcome,
    address creator,
    bool refundEnabled
)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to query |

**Returns:**
| Name | Type | Description |
|------|------|-------------|
| `question` | `string` | Market question |
| `endTime` | `uint256` | Market end timestamp |
| `totalYesBets` | `uint256` | Total YES bets (obfuscated) |
| `totalNoBets` | `uint256` | Total NO bets (obfuscated) |
| `resolved` | `bool` | Resolution status |
| `outcome` | `bool` | Market outcome (if resolved) |
| `creator` | `address` | Market creator address |
| `refundEnabled` | `bool` | Refund status |

**Gas Cost:** Read-only (no gas)

**Example:**
```javascript
const market = await contract.getMarket(marketId);
console.log("Question:", market.question);
console.log("Ends:", new Date(market.endTime * 1000));
console.log("Resolved:", market.resolved);
if (market.resolved) {
    console.log("Outcome:", market.outcome ? "YES" : "NO");
}
```

---

### 10. getBetExists

Check if user has placed a bet on a market.

**Function Signature:**
```solidity
function getBetExists(
    uint256 _marketId
) external view marketExists(_marketId) returns (
    bool exists,
    bool claimed
)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to query |

**Returns:**
| Name | Type | Description |
|------|------|-------------|
| `exists` | `bool` | Whether user has placed a bet |
| `claimed` | `bool` | Whether user has claimed |

**Gas Cost:** Read-only (no gas)

**Example:**
```javascript
const [exists, claimed] = await contract.getBetExists(marketId);
if (exists && !claimed) {
    console.log("You have an unclaimed bet!");
}
```

---

### 11. getMarketBettors

Get list of all bettors for a market.

**Function Signature:**
```solidity
function getMarketBettors(
    uint256 _marketId
) external view marketExists(_marketId) returns (
    address[] memory
)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to query |

**Returns:**
| Type | Description |
|------|-------------|
| `address[]` | Array of bettor addresses |

**Gas Cost:** Read-only (no gas)

**Example:**
```javascript
const bettors = await contract.getMarketBettors(marketId);
console.log(`Total bettors: ${bettors.length}`);
```

---

### 12. getTotalMarkets

Get total number of markets created.

**Function Signature:**
```solidity
function getTotalMarkets() external view returns (uint256)
```

**Returns:**
| Type | Description |
|------|-------------|
| `uint256` | Total market count |

**Gas Cost:** Read-only (no gas)

**Example:**
```javascript
const totalMarkets = await contract.getTotalMarkets();
console.log(`Total markets: ${totalMarkets}`);
```

---

### 13. getDecryptionStatus

Get decryption status for a market.

**Function Signature:**
```solidity
function getDecryptionStatus(
    uint256 _marketId
) external view marketExists(_marketId) returns (
    bool requested,
    uint256 requestId,
    uint256 requestTime,
    bool timedOut
)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_marketId` | `uint256` | Market ID to query |

**Returns:**
| Name | Type | Description |
|------|------|-------------|
| `requested` | `bool` | Whether decryption was requested |
| `requestId` | `uint256` | Gateway request ID |
| `requestTime` | `uint256` | Request timestamp |
| `timedOut` | `bool` | Whether request has timed out |

**Gas Cost:** Read-only (no gas)

**Example:**
```javascript
const status = await contract.getDecryptionStatus(marketId);
console.log("Decryption requested:", status.requested);
console.log("Request ID:", status.requestId);
console.log("Timed out:", status.timedOut);
```

---

## Admin Functions

### 14. pause

Pause contract in case of emergency.

**Function Signature:**
```solidity
function pause() external onlyOwner
```

**Requirements:**
- Only owner can call

**Gas Cost:** ~30,000 gas

---

### 15. unpause

Unpause contract after emergency.

**Function Signature:**
```solidity
function unpause() external onlyOwner
```

**Requirements:**
- Only owner can call

**Gas Cost:** ~30,000 gas

---

## Events

### MarketCreated
```solidity
event MarketCreated(
    uint256 indexed marketId,
    string question,
    uint256 endTime,
    address indexed creator
);
```

### BetPlaced
```solidity
event BetPlaced(
    uint256 indexed marketId,
    address indexed bettor,
    uint256 timestamp
);
```

### DecryptionRequested
```solidity
event DecryptionRequested(
    uint256 indexed marketId,
    uint256 requestId,
    uint256 timestamp
);
```

### MarketResolved
```solidity
event MarketResolved(
    uint256 indexed marketId,
    bool outcome
);
```

### WinningsClaimed
```solidity
event WinningsClaimed(
    uint256 indexed marketId,
    address indexed winner,
    uint256 amount
);
```

### DecryptionTimeout
```solidity
event DecryptionTimeout(
    uint256 indexed marketId,
    uint256 requestId
);
```

### RefundProcessed
```solidity
event RefundProcessed(
    uint256 indexed marketId,
    address indexed bettor,
    uint256 amount
);
```

### EmergencyWithdrawal
```solidity
event EmergencyWithdrawal(
    uint256 indexed marketId,
    address indexed recipient,
    uint256 amount
);
```

---

## Error Codes

| Error Message | Description | Solution |
|--------------|-------------|----------|
| "Not authorized" | Caller is not owner | Use owner account |
| "Contract is paused" | Emergency pause active | Wait for unpause |
| "Market does not exist" | Invalid market ID | Check market ID |
| "Market has ended" | Cannot bet after end time | Choose active market |
| "Market already resolved" | Market outcome already set | No action needed |
| "Market still active" | Cannot resolve before end | Wait for end time |
| "Only creator allowed" | Only creator can perform action | Use creator account |
| "Bet amount too low" | msg.value < MIN_BET | Increase bet amount |
| "Bet amount too high" | msg.value > MAX_BET | Decrease bet amount |
| "Already placed bet" | User already bet on market | Choose different market |
| "Question cannot be empty" | Empty question string | Provide question |
| "Question too long" | Question > 500 chars | Shorten question |
| "Duration must be positive" | Duration = 0 | Set positive duration |
| "Duration too long" | Duration > MAX_MARKET_DURATION | Reduce duration |
| "Market not resolved yet" | Claiming before resolution | Wait for resolution |
| "No bet found" | User has no bet on market | Place a bet first |
| "Already claimed" | User already claimed | No action needed |
| "Refunds not enabled" | Timeout not reached | Wait or check status |
| "Timeout not reached" | Called too early | Wait for timeout period |
| "Too early for emergency withdrawal" | EMERGENCY_TIMEOUT not passed | Wait for timeout |

---

## Integration Examples

### Complete Market Lifecycle

```javascript
import { ethers } from 'ethers';
import { createInstance } from 'fhevmjs';

// 1. Setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// 2. Create Market
const createTx = await contract.createMarket(
    "Will ETH exceed $3000 tomorrow?",
    24 * 60 * 60 // 24 hours
);
const createReceipt = await createTx.wait();
const marketId = createReceipt.events[0].args.marketId;
console.log("Market created:", marketId);

// 3. Place Bet
const betTx = await contract.placeBet(marketId, true, {
    value: ethers.parseEther("0.01")
});
await betTx.wait();
console.log("Bet placed");

// 4. Wait for Market End
const market = await contract.getMarket(marketId);
const endTime = market.endTime;
console.log("Waiting for market to end...");

// 5. Request Resolution
if (Date.now() / 1000 > endTime) {
    const resolveTx = await contract.requestResolution(marketId);
    await resolveTx.wait();
    console.log("Resolution requested");
}

// 6. Monitor Resolution
contract.on('MarketResolved', async (resolvedMarketId, outcome) => {
    if (resolvedMarketId.eq(marketId)) {
        console.log("Market resolved:", outcome ? "YES" : "NO");

        // 7. Claim Winnings
        const claimTx = await contract.claimWinnings(marketId);
        await claimTx.wait();
        console.log("Winnings claimed!");
    }
});

// 8. Handle Timeout (if needed)
setTimeout(async () => {
    const status = await contract.getDecryptionStatus(marketId);
    if (status.timedOut) {
        console.log("Decryption timed out, enabling refunds");
        await contract.enableRefundForTimeout(marketId);
        await contract.claimRefund(marketId);
    }
}, 7 * 24 * 60 * 60 * 1000); // 7 days
```

### Listening to Events

```javascript
// Listen for new markets
contract.on('MarketCreated', (marketId, question, endTime, creator) => {
    console.log(`New market ${marketId}: ${question}`);
    console.log(`Ends: ${new Date(endTime * 1000)}`);
    console.log(`Creator: ${creator}`);
});

// Listen for bets
contract.on('BetPlaced', (marketId, bettor, timestamp) => {
    console.log(`Bet placed on market ${marketId} by ${bettor}`);
});

// Listen for resolutions
contract.on('MarketResolved', (marketId, outcome) => {
    console.log(`Market ${marketId} resolved: ${outcome ? 'YES' : 'NO'}`);
});

// Listen for timeouts
contract.on('DecryptionTimeout', (marketId, requestId) => {
    console.log(`Market ${marketId} decryption timed out`);
});
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { useContract, useSigner } from 'wagmi';

function useMarket(marketId: number) {
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: signer } = useSigner();
    const contract = useContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        signerOrProvider: signer
    });

    useEffect(() => {
        async function fetchMarket() {
            try {
                const data = await contract.getMarket(marketId);
                setMarket({
                    question: data.question,
                    endTime: data.endTime.toNumber(),
                    totalYesBets: ethers.formatEther(data.totalYesBets),
                    totalNoBets: ethers.formatEther(data.totalNoBets),
                    resolved: data.resolved,
                    outcome: data.outcome,
                    creator: data.creator,
                    refundEnabled: data.refundEnabled
                });
            } catch (error) {
                console.error("Error fetching market:", error);
            } finally {
                setLoading(false);
            }
        }

        if (contract && marketId !== null) {
            fetchMarket();
        }
    }, [contract, marketId]);

    const placeBet = async (prediction: boolean, amount: string) => {
        const tx = await contract.placeBet(marketId, prediction, {
            value: ethers.parseEther(amount)
        });
        await tx.wait();
    };

    const claimWinnings = async () => {
        const tx = await contract.claimWinnings(marketId);
        await tx.wait();
    };

    return { market, loading, placeBet, claimWinnings };
}
```

---

## Rate Limits & Best Practices

### Transaction Rate Limits
- **Market Creation**: Max 10 per hour per address
- **Bet Placement**: Max 1 per market per address
- **Resolution Request**: Once per market (creator only)

### Gas Optimization Tips
1. Batch read operations when possible
2. Use `multicall` for fetching multiple markets
3. Monitor gas prices before transactions
4. Cache market data off-chain

### Security Best Practices
1. Always verify market exists before interacting
2. Check market status before placing bets
3. Monitor timeout status for pending resolutions
4. Validate user has sufficient balance
5. Handle transaction failures gracefully

---

## Support & Resources

- **Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Testing Guide**: [TESTING.md](./TESTING.md)
- **Security**: [SECURITY.md](./SECURITY.md)
- **GitHub Issues**: [Report bugs](https://github.com/your-repo/issues)

---

**Version:** 1.0.0
**Last Updated:** 2025-01-25
**License:** MIT
