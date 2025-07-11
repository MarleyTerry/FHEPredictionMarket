const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("========================================");
  console.log("Starting Confidential Prediction Market Deployment");
  console.log("========================================\n");

  // Get deployment account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "(Chain ID:", network.chainId, ")\n");

  // Deploy the PredictionMarket contract
  console.log("Deploying PredictionMarket contract...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");

  const predictionMarket = await PredictionMarket.deploy();
  await predictionMarket.waitForDeployment();

  const contractAddress = await predictionMarket.getAddress();
  console.log("✓ PredictionMarket deployed successfully!");
  console.log("Contract address:", contractAddress);

  // Verify deployment by calling a view function
  try {
    const totalMarkets = await predictionMarket.getTotalMarkets();
    console.log("Initial market count:", totalMarkets.toString());
  } catch (error) {
    console.log("Warning: Could not verify deployment:", error.message);
  }

  // Prepare deployment information
  const deploymentInfo = {
    contractName: "PredictionMarket",
    address: contractAddress,
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    constructorArgs: [],
  };

  // Save deployment information
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentPath = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✓ Deployment info saved to:", deploymentPath);

  // Save contract address for frontend
  const frontendDeploymentsDir = path.join(__dirname, "..", "src", "deployments");
  if (!fs.existsSync(frontendDeploymentsDir)) {
    fs.mkdirSync(frontendDeploymentsDir, { recursive: true });
  }

  const frontendPath = path.join(frontendDeploymentsDir, "PredictionMarket.json");
  fs.writeFileSync(frontendPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("✓ Contract info saved for frontend:", frontendPath);

  // Display next steps
  console.log("\n========================================");
  console.log("Deployment Complete!");
  console.log("========================================");
  console.log("\nNext steps:");
  console.log("1. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network ${network.name} ${contractAddress}`);
  console.log("\n2. Interact with the contract:");
  console.log("   node scripts/interact.js");
  console.log("\n3. Run simulation:");
  console.log("   node scripts/simulate.js");

  if (network.chainId === 11155111n) {
    console.log("\n4. View on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  }

  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
