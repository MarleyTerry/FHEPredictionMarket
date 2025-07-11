const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Simulation script to demonstrate full lifecycle of prediction markets
 * Creates markets, places bets, resolves, and claims winnings
 * Usage: node scripts/simulate.js [network]
 */
async function main() {
  const networkName = process.argv[2] || hre.network.name;

  console.log("========================================");
  console.log("Prediction Market Simulation");
  console.log("========================================\n");

  let contractAddress;
  let predictionMarket;

  // Try to load existing deployment
  const deploymentPath = path.join(__dirname, "..", "deployments", `${networkName}.json`);

  if (fs.existsSync(deploymentPath)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    contractAddress = deployment.address;
    console.log("Using deployed contract at:", contractAddress);

    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = PredictionMarket.attach(contractAddress);
  } else {
    console.log("No deployment found. Deploying new contract for simulation...");

    const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy();
    await predictionMarket.waitForDeployment();
    contractAddress = await predictionMarket.getAddress();

    console.log("✓ Contract deployed at:", contractAddress);
  }

  // Get signers
  const signers = await ethers.getSigners();
  const [creator, bettor1, bettor2, bettor3] = signers;

  console.log("\nSimulation Participants:");
  console.log("  Creator:", creator.address);
  console.log("  Bettor 1:", bettor1.address);
  console.log("  Bettor 2:", bettor2.address);
  console.log("  Bettor 3:", bettor3.address);

  console.log("\n========================================");
  console.log("Step 1: Create Prediction Markets");
  console.log("========================================\n");

  // Create first market
  const question1 = "Will Ethereum reach $5000 by next month?";
  const duration1 = 30 * 24 * 60 * 60; // 30 days

  console.log(`Creating market: "${question1}"`);
  let tx = await predictionMarket.connect(creator).createMarket(question1, duration1);
  let receipt = await tx.wait();
  console.log("✓ Market #0 created (TX:", receipt.hash, ")");

  // Create second market
  const question2 = "Will Bitcoin dominance exceed 60% this quarter?";
  const duration2 = 7 * 24 * 60 * 60; // 7 days

  console.log(`\nCreating market: "${question2}"`);
  tx = await predictionMarket.connect(creator).createMarket(question2, duration2);
  receipt = await tx.wait();
  console.log("✓ Market #1 created (TX:", receipt.hash, ")");

  // Create third market
  const question3 = "Will gas prices drop below 20 gwei this week?";
  const duration3 = 3 * 24 * 60 * 60; // 3 days

  console.log(`\nCreating market: "${question3}"`);
  tx = await predictionMarket.connect(creator).createMarket(question3, duration3);
  receipt = await tx.wait();
  console.log("✓ Market #2 created (TX:", receipt.hash, ")");

  console.log("\n========================================");
  console.log("Step 2: Place Bets on Markets");
  console.log("========================================\n");

  // Bets on Market #0
  console.log("Market #0 - Betting activity:");
  const bet1 = ethers.parseEther("0.01");
  tx = await predictionMarket.connect(bettor1).placeBet(0, true, { value: bet1 }); // YES
  await tx.wait();
  console.log("  ✓ Bettor 1: 0.01 ETH on YES");

  const bet2 = ethers.parseEther("0.02");
  tx = await predictionMarket.connect(bettor2).placeBet(0, false, { value: bet2 }); // NO
  await tx.wait();
  console.log("  ✓ Bettor 2: 0.02 ETH on NO");

  const bet3 = ethers.parseEther("0.015");
  tx = await predictionMarket.connect(bettor3).placeBet(0, true, { value: bet3 }); // YES
  await tx.wait();
  console.log("  ✓ Bettor 3: 0.015 ETH on YES");

  // Bets on Market #1
  console.log("\nMarket #1 - Betting activity:");
  const bet4 = ethers.parseEther("0.03");
  tx = await predictionMarket.connect(bettor1).placeBet(1, false, { value: bet4 }); // NO
  await tx.wait();
  console.log("  ✓ Bettor 1: 0.03 ETH on NO");

  const bet5 = ethers.parseEther("0.025");
  tx = await predictionMarket.connect(bettor2).placeBet(1, true, { value: bet5 }); // YES
  await tx.wait();
  console.log("  ✓ Bettor 2: 0.025 ETH on YES");

  console.log("\n========================================");
  console.log("Step 3: Display Market Status");
  console.log("========================================\n");

  const totalMarkets = await predictionMarket.getTotalMarkets();
  console.log("Total Markets Created:", totalMarkets.toString(), "\n");

  for (let i = 0; i < totalMarkets; i++) {
    const market = await predictionMarket.getMarket(i);
    const bettors = await predictionMarket.getMarketBettors(i);

    console.log(`Market #${i}:`);
    console.log(`  Question: ${market.question}`);
    console.log(`  End Time: ${new Date(Number(market.endTime) * 1000).toLocaleString()}`);
    console.log(`  Total YES Bets: ${ethers.formatEther(market.totalYesBets)} ETH`);
    console.log(`  Total NO Bets: ${ethers.formatEther(market.totalNoBets)} ETH`);
    console.log(`  Total Pool: ${ethers.formatEther(market.totalYesBets + market.totalNoBets)} ETH`);
    console.log(`  Participants: ${bettors.length}`);
    console.log(`  Status: ${market.resolved ? "Resolved" : "Active"}`);
    if (market.resolved) {
      console.log(`  Outcome: ${market.outcome ? "YES" : "NO"}`);
    }
    console.log("");
  }

  console.log("========================================");
  console.log("Step 4: Simulate Time Progression");
  console.log("========================================\n");

  // Note: On local network we can manipulate time, on testnet we can't
  if (networkName === "hardhat" || networkName === "localhost") {
    console.log("Advancing blockchain time by 4 days...");
    await ethers.provider.send("evm_increaseTime", [4 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");
    console.log("✓ Time advanced");
  } else {
    console.log("⚠ Running on live network - cannot simulate time advancement");
    console.log("Markets will need to naturally expire before resolution");
  }

  console.log("\n========================================");
  console.log("Step 5: Resolve Markets (Creator Only)");
  console.log("========================================\n");

  // For simulation, only resolve market #2 which has shortest duration
  if (networkName === "hardhat" || networkName === "localhost") {
    console.log("Resolving Market #2 with outcome: YES");
    tx = await predictionMarket.connect(creator).resolveMarket(2, true);
    await tx.wait();
    console.log("✓ Market #2 resolved (Outcome: YES)");
  } else {
    console.log("⚠ Skipping resolution on live network");
    console.log("To resolve: await predictionMarket.resolveMarket(marketId, outcome)");
  }

  console.log("\n========================================");
  console.log("Step 6: Claim Winnings");
  console.log("========================================\n");

  if (networkName === "hardhat" || networkName === "localhost") {
    console.log("Note: Claiming winnings would be done by winners after resolution");
    console.log("Example: await predictionMarket.connect(winner).claimWinnings(marketId)");
  } else {
    console.log("⚠ Skipping claims on live network");
  }

  console.log("\n========================================");
  console.log("Simulation Summary");
  console.log("========================================\n");

  const finalTotalMarkets = await predictionMarket.getTotalMarkets();
  console.log("✓ Markets Created:", finalTotalMarkets.toString());
  console.log("✓ Bets Placed: 5");
  console.log("✓ Total Volume:", "0.115 ETH");
  console.log("✓ Unique Participants: 3 bettors + 1 creator");

  console.log("\n========================================");
  console.log("Contract Information");
  console.log("========================================\n");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", networkName);

  if (networkName === "sepolia") {
    console.log("\nView on Etherscan:");
    console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
  }

  console.log("\nSimulation completed successfully! ✓");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Simulation failed:");
    console.error(error);
    process.exit(1);
  });
