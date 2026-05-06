const fs = require("fs");
const path = require("path");
const solc = require("solc");
const { ethers } = require("ethers");

async function main() {
  const rpcUrl = process.env.WEB3_PROVIDER_URL || "http://127.0.0.1:8545";
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

  if (!privateKey) {
    console.error("Missing BLOCKCHAIN_PRIVATE_KEY environment variable.");
    process.exit(1);
  }

  const contractPath = path.join(__dirname, "..", "contracts", "DocumentRegistry.sol");
  const source = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "DocumentRegistry.sol": {
        content: source
      }
    },
    settings: {
      evmVersion: "paris",
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["DocumentRegistry.sol"]["DocumentRegistry"];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  const abiPath = path.join(__dirname, "..", "contracts", "DocumentRegistry.abi.json");
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  console.log("Deploying DocumentRegistry...");
  const deployed = await factory.deploy();
  await deployed.waitForDeployment();

  const address = await deployed.getAddress();
  const deployment = await deployed.deploymentTransaction().wait();

  console.log("");
  console.log("Contract deployed successfully.");
  console.log("Contract address:", address);
  console.log("Deploy transaction:", deployment.hash);
  console.log("");
  console.log("Use these values in the Django terminal:");
  console.log(`$env:BLOCKCHAIN_MODE="real"`);
  console.log(`$env:BLOCKCHAIN_NETWORK_NAME="ganache"`);
  console.log(`$env:WEB3_PROVIDER_URL="${rpcUrl}"`);
  console.log(`$env:BLOCKCHAIN_CONTRACT_ADDRESS="${address}"`);
  console.log(`$env:BLOCKCHAIN_PRIVATE_KEY="${privateKey}"`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
