const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Verify contract on Etherscan
 * Usage: node scripts/verify.js [network]
 */
async function main() {
  // Get network from command line or use default
  const networkName = process.argv[2] || hre.network.name;

  console.log("========================================");
  console.log("Contract Verification Tool");
  console.log("========================================\n");
  console.log("Network:", networkName);

  // Load deployment information
  const deploymentPath = path.join(__dirname, "..", "deployments", `${networkName}.json`);

  if (!fs.existsSync(deploymentPath)) {
    console.error(`❌ No deployment found for network: ${networkName}`);
    console.error(`Looking for: ${deploymentPath}`);
    console.log("\nAvailable deployments:");
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (fs.existsSync(deploymentsDir)) {
      const files = fs.readdirSync(deploymentsDir);
      files.forEach(file => console.log(`  - ${file.replace('.json', '')}`));
    } else {
      console.log("  No deployments found");
    }
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("Contract Address:", deployment.address);
  console.log("Deployer:", deployment.deployer);
  console.log("Deployed At:", deployment.deployedAt);

  // Verify the contract on Etherscan
  console.log("\nVerifying contract on Etherscan...");

  try {
    await run("verify:verify", {
      address: deployment.address,
      constructorArguments: deployment.constructorArgs || [],
    });

    console.log("\n✓ Contract verified successfully!");
    console.log(`\nView on Etherscan:`);

    if (deployment.chainId === "11155111") {
      console.log(`https://sepolia.etherscan.io/address/${deployment.address}#code`);
    } else if (deployment.chainId === "1") {
      console.log(`https://etherscan.io/address/${deployment.address}#code`);
    } else {
      console.log(`Chain ID ${deployment.chainId} - check appropriate explorer`);
    }

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✓ Contract is already verified!");

      if (deployment.chainId === "11155111") {
        console.log(`\nView on Etherscan:`);
        console.log(`https://sepolia.etherscan.io/address/${deployment.address}#code`);
      }
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error.message);

      console.log("\nTroubleshooting:");
      console.log("1. Ensure ETHERSCAN_API_KEY is set in .env");
      console.log("2. Wait a few moments after deployment before verifying");
      console.log("3. Check that the contract address is correct");
      console.log("4. Verify constructor arguments match deployment");

      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
