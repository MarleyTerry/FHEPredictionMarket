# 合约信息文档

## 钱包地址
**地址**: `0xaDEd6Ca4230dEA690EDf96e126f8e67b7e72Dd3b`

---

## 合约 1: PredictionMarket
**合约地址**: `0xE4634843d7De4f4276e0da53F591B4584647BB0b`

### 状态
⚠️ **注意**: 此合约地址在现有项目中未找到源码。可能需要从 Etherscan 手动获取。

### 手动获取方法
1. 访问 Etherscan 或 Sepolia Etherscan
2. 输入合约地址: `0xE4634843d7De4f4276e0da53F591B4584647BB0b`
3. 点击 "Contract" 标签页
4. 查看并复制源代码

**Etherscan 链接**:
- 主网: https://etherscan.io/address/0xE4634843d7De4f4276e0da53F591B4584647BB0b#code
- Sepolia: https://sepolia.etherscan.io/address/0xE4634843d7De4f4276e0da53F591B4584647BB0b#code

---

## 合约 2: PredictionMarket (已部署)
**合约地址**: `0x4709622271c332cb51a009bA3a950322c5207668`
**网络**: Sepolia Testnet

### 合约描述
🔐 **FHE Secret Prediction Market** - 基于全同态加密的预测市场智能合约

这是一个使用 Zama FHEVM 技术实现的隐私保护预测市场，允许用户在保持完全隐私的情况下进行加密投注和预测。

### 核心功能

#### 1. 市场创建
```solidity
function createMarket(
    string memory _question,
    string memory _category,
    uint256 _duration
) external returns (uint256)
```
- 创建新的预测市场
- 支持多种类别（加密货币、技术、空间、环境等）
- 可设置市场持续时间（最长1年）

#### 2. 加密投注
```solidity
function placeSecretBet(uint256 _marketId, bool _prediction)
    external payable
```
- 使用 FHE 加密投注金额
- 支持 YES/NO 两种预测选项
- 最小投注金额: 0.0001 ETH
- 所有投注数据完全加密，其他参与者无法查看

#### 3. 市场解决
```solidity
function resolveMarket(uint256 _marketId, Outcome _outcome)
    external onlyCreator
```
- 仅市场创建者可以解决市场
- 必须在截止时间后才能解决
- 设置最终结果（YES 或 NO）

#### 4. 提取奖金
```solidity
function withdrawWinnings(uint256 _marketId)
    external
```
- 市场解决后，获胜者可以提取奖金
- 按投注比例分配奖池
- 防止重复提取

### 技术特性

#### FHE 加密功能
- **加密投注金额**: 使用 `euint64` 类型存储加密的投注金额
- **隐私保护**: 投注金额和总池子都是加密的
- **访问控制**: 使用 `FHE.allow()` 和 `FHE.allowThis()` 管理访问权限
- **安全聚合**: 在不泄露个人投注的情况下计算结果

#### 合约架构
```solidity
// 市场状态枚举
enum MarketState { Active, Resolved, Cancelled }

// 结果枚举
enum Outcome { None, Yes, No }

// 市场结构
struct Market {
    string question;           // 预测问题
    string category;           // 市场类别
    uint256 deadline;          // 截止时间
    MarketState state;         // 市场状态
    Outcome outcome;           // 最终结果
    euint64 totalYesBets;      // 加密的 YES 投注总额
    euint64 totalNoBets;       // 加密的 NO 投注总额
    euint64 totalPool;         // 加密的总池子
    mapping(address => euint64) yesBets;    // 用户的 YES 投注
    mapping(address => euint64) noBets;     // 用户的 NO 投注
    mapping(address => bool) hasVoted;      // 投票状态
    address[] participants;                 // 参与者列表
    address creator;                        // 创建者
    uint256 createdAt;                     // 创建时间
}
```

### 常量配置
- `MIN_BET_AMOUNT`: 0.0001 ETH（最小投注金额）
- `MARKET_DURATION`: 365 天（最长市场持续时间）

### 事件
```solidity
event MarketCreated(uint256 indexed marketId, address indexed creator,
                   string question, string category, uint256 deadline);
event SecretBetPlaced(uint256 indexed marketId, address indexed user,
                     bool prediction);
event MarketResolved(uint256 indexed marketId, Outcome outcome);
event WinningsWithdrawn(uint256 indexed marketId, address indexed user,
                       uint256 amount);
```

### 查询功能

#### getMarketInfo
获取市场的公开信息（不包括加密金额）
```solidity
function getMarketInfo(uint256 _marketId)
    external view returns (
        string memory question,
        string memory category,
        uint256 deadline,
        MarketState state,
        Outcome outcome,
        uint256 participantCount,
        address creator,
        uint256 createdAt
    )
```

#### getUserEncryptedBets
获取用户的加密投注（只有用户本人可以解密）
```solidity
function getUserEncryptedBets(uint256 _marketId, address _user)
    external view returns (euint64 yesBet, euint64 noBet)
```

#### hasUserVoted
检查用户是否已在市场中投票
```solidity
function hasUserVoted(uint256 _marketId, address _user)
    external view returns (bool)
```

### 安全机制
1. **访问控制**:
   - `onlyCreator` 修饰符限制创建者权限
   - `validMarket` 修饰符验证市场存在
   - `marketActive` 修饰符确保市场处于活跃状态

2. **防作弊机制**:
   - 每个用户只能投注一次
   - 市场必须过期后才能解决
   - 防止重复提取奖金

3. **输入验证**:
   - 最小投注金额限制
   - 市场持续时间验证
   - 问题内容非空验证

### 已部署信息
- **网络**: Sepolia Testnet
- **合约地址**: `0x4709622271c332cb51a009bA3a950322c5207668`
- **部署者钱包**: `0xaDEd6Ca4230dEA690EDf96e126f8e67b7e72Dd3b`
- **在线演示**: https://fhe-prediction-market-qzhw.vercel.app/
- **GitHub**: https://github.com/FloydMarvin/PredictionMarket

### 使用场景
1. **加密货币预测**: BTC/ETH 价格预测
2. **技术预测**: 新技术发布、项目里程碑
3. **空间探索**: 太空任务成功预测
4. **环境**: 气候目标达成预测
5. **2026 预测市场**: 长期预测场景

### 依赖项
```solidity
import { FHE, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
```

### Solidity 版本
```solidity
pragma solidity ^0.8.24;
```

### 许可证
MIT License

---

## 简化版合约: PredictionMarketSimple

同一目录下还包含了简化版本的合约 `PredictionMarketSimple.sol`，主要区别：

### 简化特性
1. **单一投注映射**: 只使用一个 `userBets` 映射存储加密金额
2. **预测存储**: 使用 `userPrediction` 布尔值存储 YES/NO 选择
3. **简化奖金计算**: 获胜者平分奖池（演示用途）
4. **提取追踪**: 使用 `hasWithdrawn` 防止重复提取

### 适用场景
- 学习和演示 FHE 技术
- 更简单的集成测试
- 降低 gas 成本的场景

---

## 文件清单

### 已保存文件
1. ✅ `PredictionMarket.sol` - 完整版预测市场合约
2. ✅ `PredictionMarketSimple.sol` - 简化版预测市场合约
3. ✅ `README.md` - 项目说明文档
4. ✅ `CONTRACT_INFORMATION.md` - 本文档

### 待获取文件
- ⚠️ 合约地址 `0xE4634843d7De4f4276e0da53F591B4584647BB0b` 的源代码

---

## 快速开始

### 与合约交互

#### 1. 连接钱包
使用 MetaMask 连接到 Sepolia Testnet

#### 2. 创建市场
```javascript
const tx = await contract.createMarket(
    "Will BTC reach $100k in 2026?",
    "Cryptocurrency",
    365 * 24 * 60 * 60  // 1 year duration
);
```

#### 3. 投注
```javascript
const tx = await contract.placeSecretBet(
    marketId,
    true,  // YES prediction
    { value: ethers.parseEther("0.0001") }
);
```

#### 4. 查询市场
```javascript
const info = await contract.getMarketInfo(marketId);
console.log("Question:", info.question);
console.log("Participants:", info.participantCount);
```

#### 5. 解决市场（仅创建者）
```javascript
const tx = await contract.resolveMarket(marketId, 1); // 1 = Yes, 2 = No
```

#### 6. 提取奖金
```javascript
const tx = await contract.withdrawWinnings(marketId);
```

---

## 技术支持

### 文档资源
- [Zama FHEVM 文档](https://docs.zama.ai/)
- [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [Solidity 文档](https://docs.soliditylang.org/)

### 测试网水龙头
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

---

## 更新日志

### 2024年9月
- ✅ 部署合约到 Sepolia: `0x4709622271c332cb51a009bA3a950322c5207668`
- ✅ 创建前端演示应用
- ✅ 上线 Vercel 演示站点

---

## 注意事项

⚠️ **重要提醒**:
1. 这是测试网合约，仅用于演示和学习
2. 不要在主网使用真实资金测试
3. FHE 解密操作需要特殊的密钥管理
4. Gas 费用可能较高，因为 FHE 操作计算密集

---

**文档生成时间**: 2025-10-11
**合约版本**: v1.0
**Solidity**: ^0.8.24
**License**: MIT
