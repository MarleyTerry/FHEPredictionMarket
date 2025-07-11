const fs = require("fs");
const path = require("path");

/**
 * Security Check Script
 * Performs automated security checks before deployment
 */

console.log("========================================");
console.log("Running Security Checks");
console.log("========================================\n");

let errors = 0;
let warnings = 0;

// Check 1: Verify .env file is not in git
console.log("1. Checking .env file security...");
if (fs.existsSync(path.join(__dirname, "..", ".env"))) {
  try {
    const gitignore = fs.readFileSync(
      path.join(__dirname, "..", ".gitignore"),
      "utf8"
    );
    if (!gitignore.includes(".env")) {
      console.log("   ❌ ERROR: .env is not in .gitignore!");
      errors++;
    } else {
      console.log("   ✓ .env properly ignored");
    }
  } catch (e) {
    console.log("   ⚠ WARNING: Could not read .gitignore");
    warnings++;
  }
} else {
  console.log("   ℹ No .env file found (using environment variables)");
}

// Check 2: Verify no hardcoded private keys
console.log("\n2. Checking for hardcoded secrets...");
const sensitivePatterns = [
  /private.*key.*=.*0x[a-fA-F0-9]{64}/i,
  /mnemonic.*=.*\b\w+\s+\w+\s+\w+/i,
  /password.*=.*[^\s]{8,}/i,
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  let found = false;

  sensitivePatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      console.log(`   ❌ ERROR: Potential secret found in ${filePath}`);
      errors++;
      found = true;
    }
  });

  return found;
}

function scanDirectory(dir, extensions = [".js", ".cjs", ".ts", ".sol"]) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!["node_modules", ".git", "artifacts", "cache"].includes(file)) {
        scanDirectory(filePath, extensions);
      }
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      scanFile(filePath);
    }
  });
}

try {
  scanDirectory(path.join(__dirname, ".."));
  if (errors === 0) {
    console.log("   ✓ No hardcoded secrets found");
  }
} catch (e) {
  console.log("   ⚠ WARNING: Could not complete secret scan");
  warnings++;
}

// Check 3: Verify contract size limits
console.log("\n3. Checking contract size...");
const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");
if (fs.existsSync(artifactsDir)) {
  try {
    function checkContractSize(dir) {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          checkContractSize(filePath);
        } else if (file.endsWith(".json") && !file.endsWith(".dbg.json")) {
          const artifact = JSON.parse(fs.readFileSync(filePath, "utf8"));
          if (artifact.bytecode) {
            const size = (artifact.bytecode.length - 2) / 2;
            const maxSize = 24576; // 24 KB limit

            if (size > maxSize) {
              console.log(
                `   ❌ ERROR: Contract ${file} exceeds size limit (${size} > ${maxSize} bytes)`
              );
              errors++;
            } else if (size > maxSize * 0.9) {
              console.log(
                `   ⚠ WARNING: Contract ${file} is close to size limit (${size}/${maxSize} bytes)`
              );
              warnings++;
            }
          }
        }
      });
    }

    checkContractSize(artifactsDir);
    if (errors === 0) {
      console.log("   ✓ All contracts within size limits");
    }
  } catch (e) {
    console.log("   ⚠ WARNING: Could not check contract sizes");
    warnings++;
  }
} else {
  console.log("   ℹ No compiled contracts found (run compile first)");
}

// Check 4: Verify security dependencies
console.log("\n4. Checking security dependencies...");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);

const requiredDevDeps = [
  "solhint",
  "prettier",
  "hardhat-gas-reporter",
  "solidity-coverage",
];

requiredDevDeps.forEach((dep) => {
  if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
    console.log(`   ⚠ WARNING: Missing recommended dependency: ${dep}`);
    warnings++;
  }
});

console.log("   ✓ Security dependencies check complete");

// Check 5: Verify Solidity version
console.log("\n5. Checking Solidity version...");
try {
  const hardhatConfig = require(path.join(__dirname, "..", "hardhat.config.cjs"));
  const solVersion = hardhatConfig.solidity.version;

  if (solVersion.startsWith("0.8.")) {
    console.log(`   ✓ Using secure Solidity version: ${solVersion}`);
  } else {
    console.log(
      `   ⚠ WARNING: Consider using Solidity 0.8.x (current: ${solVersion})`
    );
    warnings++;
  }
} catch (e) {
  console.log("   ⚠ WARNING: Could not verify Solidity version");
  warnings++;
}

// Check 6: Verify optimizer settings
console.log("\n6. Checking optimizer settings...");
try {
  const hardhatConfig = require(path.join(__dirname, "..", "hardhat.config.cjs"));
  const optimizer = hardhatConfig.solidity.settings.optimizer;

  if (optimizer.enabled) {
    const runs = optimizer.runs;
    if (runs >= 200 && runs <= 1000) {
      console.log(`   ✓ Optimizer enabled with ${runs} runs (balanced)`);
    } else if (runs < 200) {
      console.log(
        `   ⚠ WARNING: Low optimization runs (${runs}) - higher deployment cost`
      );
      warnings++;
    } else {
      console.log(
        `   ⚠ WARNING: High optimization runs (${runs}) - higher execution cost`
      );
      warnings++;
    }
  } else {
    console.log("   ⚠ WARNING: Optimizer disabled - higher gas costs");
    warnings++;
  }
} catch (e) {
  console.log("   ⚠ WARNING: Could not verify optimizer settings");
  warnings++;
}

// Summary
console.log("\n========================================");
console.log("Security Check Summary");
console.log("========================================");
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.log("\n❌ FAILED: Security checks found critical issues");
  console.log("Please fix all errors before proceeding with deployment.\n");
  process.exit(1);
} else if (warnings > 0) {
  console.log("\n⚠ PASSED WITH WARNINGS: Security checks found some issues");
  console.log("Review warnings and consider addressing them.\n");
  process.exit(0);
} else {
  console.log("\n✓ PASSED: All security checks passed successfully\n");
  process.exit(0);
}
