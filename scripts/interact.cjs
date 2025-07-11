const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Interactive script to interact with deployed PredictionMarket contract
 * Usage: node scripts/interact.js [network]
 */
async function main() {
  const networkName = process.argv[2] || hre.network.name;

  console.log("========================================");
  console.log("Prediction Market Interaction Tool");
  console.log("========================================\n");

  // Load deployment information
  const deploymentPath = path.join(__dirname, "..", "deployments", `${networkName}.json`);

  if (!fs.existsSync(deploymentPath)) {
    console.error(`❌ No deployment found for network: ${networkName}`);
    console.error("Please deploy the contract first using: npm run deploy");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const contractAddress = deployment.address;

  console.log("Network:", networkName);
  console.log("Contract Address:", contractAddress);

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Interacting as:", signer.address);

  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  // Connect to the contract
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = PredictionMarket.attach(contractAddress);

  console.log("========================================");
  console.log("Contract Information");
  console.log("========================================\n");

  // Get total markets
  const totalMarkets = await predictionMarket.getTotalMarkets();
  console.log("Total Markets:", totalMarkets.toString());

  // Display all markets if any exist
  if (totalMarkets > 0) {
    console.log("\n--- Active Markets ---\n");

    for (let i = 0; i < totalMarkets; i++) {
      try {
        const market = await predictionMarket.getMarket(i);
        const currentTime = Math.floor(Date.now() / 1000);
        const endTime = Number(market.endTime);
        const isActive = currentTime < endTime && !market.resolved;

        console.log(`Market #${i}:`);
        console.log(`  Question: ${market.question}`);
        console.log(`  Creator: ${market.creator}`);
        console.log(`  End Time: ${new Date(endTime * 1000).toLocaleString()}`);
        console.log(`  Status: ${isActive ? "Active" : market.resolved ? "Resolved" : "Ended"}`);
        console.log(`  Total YES Bets: ${ethers.formatEther(market.totalYesBets)} ETH`);
        console.log(`  Total NO Bets: ${ethers.formatEther(market.totalNoBets)} ETH`);

        if (market.resolved) {
          console.log(`  Outcome: ${market.outcome ? "YES" : "NO"}`);
        }

        // Check if current user has placed a bet
        const betInfo = await predictionMarket.getBetExists(i);
        if (betInfo.exists) {
          console.log(`  Your Bet: Placed ${betInfo.claimed ? "(Claimed)" : "(Not Claimed)"}`);
        }

        console.log("");
      } catch (error) {
        console.log(`  Error fetching market ${i}:`, error.message);
      }
    }
  }

  console.log("========================================");
  console.log("Available Actions");
  console.log("========================================\n");
  console.log("To create a market:");
  console.log("  marketId = await predictionMarket.createMarket(question, duration)");
  console.log("\nTo place a bet:");
  console.log("  await predictionMarket.placeBet(marketId, prediction, { value: amount })");
  console.log("\nTo resolve a market (creator only):");
  console.log("  await predictionMarket.resolveMarket(marketId, outcome)");
  console.log("\nTo claim winnings:");
  console.log("  await predictionMarket.claimWinnings(marketId)");
  console.log("\nTo get market bettors:");
  console.log("  bettors = await predictionMarket.getMarketBettors(marketId)");

  console.log("\n========================================");
  console.log("Example Usage");
  console.log("========================================\n");

  // Example: Create a sample market (commented out)
  console.log("// Create a market (24 hour duration)");
  console.log('// const question = "Will ETH price exceed $5000 by tomorrow?";');
  console.log("// const duration = 24 * 60 * 60; // 24 hours in seconds");
  console.log("// const tx = await predictionMarket.createMarket(question, duration);");
  console.log("// await tx.wait();");
  console.log("// console.log('Market created successfully!');\n");

  console.log("// Place a bet (0.01 ETH on YES)");
  console.log("// const betAmount = ethers.parseEther('0.01');");
  console.log("// const prediction = true; // true for YES, false for NO");
  console.log("// const tx2 = await predictionMarket.placeBet(0, prediction, { value: betAmount });");
  console.log("// await tx2.wait();");
  console.log("// console.log('Bet placed successfully!');\n");

  console.log("\nContract instance is available as 'predictionMarket'");
  console.log("Use this script in a REPL environment for interactive testing.\n");
}

main()
  .then(() => {
    console.log("Interaction complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Interaction failed:");
    console.error(error);
    process.exit(1);
  });
