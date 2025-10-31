/**
 * Server-side FHE operations
 * Note: Most FHE operations should be performed on the client side
 * Server operations are limited to validation and contract interaction
 */

export interface FHEServerConfig {
  gatewayUrl: string;
  networkUrl: string;
}

export const networks: Record<string, FHEServerConfig> = {
  sepolia: {
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
    networkUrl: 'https://devnet.zama.ai'
  },
  localfhevm: {
    gatewayUrl: 'http://localhost:7077',
    networkUrl: 'http://localhost:8545'
  }
};

export function getNetworkConfig(network: string): FHEServerConfig {
  return networks[network] || networks.localfhevm;
}

export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}
