// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Simple FHE Prediction Market
 * @dev Simplified FHE prediction market with encrypted bets
 */
contract PredictionMarketSimple is SepoliaConfig {
    
    enum MarketState { Active, Resolved, Cancelled }
    enum Outcome { None, Yes, No }

    struct Market {
        string question;
        string category;
        uint256 deadline;
        MarketState state;
        Outcome outcome;
        euint64 totalPool;        // Encrypted total pool
        mapping(address => euint64) userBets;    // User's encrypted bets
        mapping(address => bool) userPrediction; // User's prediction (Yes/No)
        mapping(address => bool) hasVoted;       // Track if user voted
        mapping(address => bool) hasWithdrawn;   // Track withdrawals
        address[] participants;
        address creator;
        uint256 createdAt;
    }

    mapping(uint256 => Market) public markets;
    uint256 public marketCount;
    
    uint256 public constant MIN_BET_AMOUNT = 0.0001 ether;
    uint256 public constant MARKET_DURATION = 365 days;
    
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string question,
        string category,
        uint256 deadline
    );
    
    event SecretBetPlaced(
        uint256 indexed marketId,
        address indexed user,
        bool prediction
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        Outcome outcome
    );
    
    event WinningsWithdrawn(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );

    modifier validMarket(uint256 _marketId) {
        require(_marketId < marketCount, "Market does not exist");
        _;
    }

    modifier onlyCreator(uint256 _marketId) {
        require(markets[_marketId].creator == msg.sender, "Not market creator");
        _;
    }

    modifier marketActive(uint256 _marketId) {
        require(markets[_marketId].state == MarketState.Active, "Market not active");
        require(block.timestamp < markets[_marketId].deadline, "Market expired");
        _;
    }

    /**
     * @dev Create a new prediction market
     */
    function createMarket(
        string memory _question,
        string memory _category,
        uint256 _duration
    ) external returns (uint256) {
        require(bytes(_question).length > 0, "Question cannot be empty");
        require(_duration > 1 hours && _duration <= MARKET_DURATION, "Invalid duration");
        
        uint256 marketId = marketCount++;
        uint256 deadline = block.timestamp + _duration;
        
        Market storage market = markets[marketId];
        market.question = _question;
        market.category = _category;
        market.deadline = deadline;
        market.state = MarketState.Active;
        market.outcome = Outcome.None;
        market.creator = msg.sender;
        market.createdAt = block.timestamp;
        
        // Initialize encrypted total to 0
        market.totalPool = FHE.asEuint64(0);
        
        emit MarketCreated(marketId, msg.sender, _question, _category, deadline);
        return marketId;
    }

    /**
     * @dev Place an encrypted bet on a prediction market
     */
    function placeSecretBet(uint256 _marketId, bool _prediction)
        external
        payable
        validMarket(_marketId)
        marketActive(_marketId)
    {
        require(msg.value >= MIN_BET_AMOUNT, "Bet amount too small");
        require(!markets[_marketId].hasVoted[msg.sender], "Already voted");
        
        Market storage market = markets[_marketId];
        
        // Convert ETH amount to encrypted uint64
        euint64 betAmount = FHE.asEuint64(uint64(msg.value));
        
        // Store encrypted bet amount and prediction
        market.userBets[msg.sender] = betAmount;
        market.userPrediction[msg.sender] = _prediction;
        
        // Update encrypted total pool
        market.totalPool = FHE.add(market.totalPool, betAmount);
        
        // Grant access permissions for FHE operations
        FHE.allowThis(betAmount);
        FHE.allow(betAmount, msg.sender);
        FHE.allowThis(market.totalPool);
        
        market.hasVoted[msg.sender] = true;
        market.participants.push(msg.sender);
        
        emit SecretBetPlaced(_marketId, msg.sender, _prediction);
    }

    /**
     * @dev Resolve a market (only creator)
     */
    function resolveMarket(uint256 _marketId, Outcome _outcome)
        external
        validMarket(_marketId)
        onlyCreator(_marketId)
    {
        require(_outcome == Outcome.Yes || _outcome == Outcome.No, "Invalid outcome");
        Market storage market = markets[_marketId];
        require(market.state == MarketState.Active, "Market not active");
        require(block.timestamp >= market.deadline, "Market not ended yet");
        
        market.state = MarketState.Resolved;
        market.outcome = _outcome;
        
        emit MarketResolved(_marketId, _outcome);
    }

    /**
     * @dev Simplified winnings calculation for demo
     */
    function calculateWinnings(uint256 _marketId, address _user)
        public
        view
        validMarket(_marketId)
        returns (uint256)
    {
        Market storage market = markets[_marketId];
        if (market.state != MarketState.Resolved) {
            return 0;
        }
        
        if (!market.hasVoted[_user] || market.hasWithdrawn[_user]) {
            return 0;
        }
        
        // Check if user predicted correctly
        bool userWon = (market.outcome == Outcome.Yes && market.userPrediction[_user]) ||
                       (market.outcome == Outcome.No && !market.userPrediction[_user]);
        
        if (!userWon) {
            return 0;
        }
        
        // Simplified calculation: winners share the pool equally
        // In real FHE implementation, this would use proportional encrypted amounts
        uint256 winnerCount = 0;
        for (uint i = 0; i < market.participants.length; i++) {
            address participant = market.participants[i];
            bool participantWon = (market.outcome == Outcome.Yes && market.userPrediction[participant]) ||
                                 (market.outcome == Outcome.No && !market.userPrediction[participant]);
            if (participantWon && !market.hasWithdrawn[participant]) {
                winnerCount++;
            }
        }
        
        if (winnerCount == 0) {
            return 0;
        }
        
        // Equal distribution among winners for demo
        return address(this).balance / winnerCount;
    }

    /**
     * @dev Withdraw winnings after market resolution
     */
    function withdrawWinnings(uint256 _marketId)
        external
        validMarket(_marketId)
    {
        Market storage market = markets[_marketId];
        require(market.state == MarketState.Resolved, "Market not resolved");
        require(market.hasVoted[msg.sender], "Did not participate");
        require(!market.hasWithdrawn[msg.sender], "Already withdrawn");
        
        uint256 winnings = calculateWinnings(_marketId, msg.sender);
        require(winnings > 0, "No winnings to withdraw");
        
        market.hasWithdrawn[msg.sender] = true;
        
        // Transfer winnings
        (bool success, ) = payable(msg.sender).call{value: winnings}("");
        require(success, "Transfer failed");
        
        emit WinningsWithdrawn(_marketId, msg.sender, winnings);
    }

    /**
     * @dev Get market information
     */
    function getMarketInfo(uint256 _marketId)
        external
        view
        validMarket(_marketId)
        returns (
            string memory question,
            string memory category,
            uint256 deadline,
            MarketState state,
            Outcome outcome,
            uint256 participantCount,
            address creator,
            uint256 createdAt
        )
    {
        Market storage market = markets[_marketId];
        return (
            market.question,
            market.category,
            market.deadline,
            market.state,
            market.outcome,
            market.participants.length,
            market.creator,
            market.createdAt
        );
    }

    /**
     * @dev Check if user has voted
     */
    function hasUserVoted(uint256 _marketId, address _user)
        external
        view
        validMarket(_marketId)
        returns (bool)
    {
        return markets[_marketId].hasVoted[_user];
    }

    /**
     * @dev Get user's encrypted bet (only the user can decrypt)
     */
    function getUserEncryptedBet(uint256 _marketId, address _user)
        external
        view
        validMarket(_marketId)
        returns (euint64)
    {
        return markets[_marketId].userBets[_user];
    }

    /**
     * @dev Emergency cancel market (only creator, only if no bets)
     */
    function cancelMarket(uint256 _marketId)
        external
        validMarket(_marketId)
        onlyCreator(_marketId)
    {
        Market storage market = markets[_marketId];
        require(market.state == MarketState.Active, "Market not active");
        require(market.participants.length == 0, "Cannot cancel market with bets");
        
        market.state = MarketState.Cancelled;
    }

    // Allow contract to receive ETH
    receive() external payable {}
    fallback() external payable {}
}