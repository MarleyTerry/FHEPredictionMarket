/**
 * Utility functions for FHEVM SDK
 */

import { BrowserProvider, JsonRpcProvider, type Signer } from 'ethers';
import { FhevmClient } from '../core/FhevmClient';
import { EncryptionService } from '../core/EncryptionService';
import { DecryptionService } from '../core/DecryptionService';
import { ContractService } from '../core/ContractService';
import type { FhevmConfig, ContractConfig } from '../types';

/**
 * Create a new FHEVM client instance
 */
export async function createFhevmClient(
  provider: BrowserProvider | JsonRpcProvider,
  options?: Partial<FhevmConfig>
): Promise<FhevmClient> {
  const config: FhevmConfig = {
    provider,
    ...options,
  };

  const client = new FhevmClient(config);
  await client.init();

  return client;
}

/**
 * Quick encrypt value utility
 */
export async function encryptValue(
  client: FhevmClient,
  type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64',
  value: boolean | number | bigint
) {
  const service = new EncryptionService(client);

  switch (type) {
    case 'bool':
      return service.encryptBool(value as boolean);
    case 'uint8':
      return service.encryptUint8(value as number);
    case 'uint16':
      return service.encryptUint16(value as number);
    case 'uint32':
      return service.encryptUint32(value as number);
    case 'uint64':
      return service.encryptUint64(value as bigint);
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Quick decrypt value utility
 */
export async function decryptValue(
  signer: Signer,
  type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64',
  contractAddress: string,
  ciphertext: bigint | string,
  userAddress: string,
  gatewayUrl?: string
) {
  const service = new DecryptionService(signer, gatewayUrl);

  const params = {
    contractAddress,
    ciphertext,
    userAddress,
  };

  switch (type) {
    case 'bool':
      return service.decryptBool(params);
    case 'uint8':
      return service.decryptUint8(params);
    case 'uint16':
      return service.decryptUint16(params);
    case 'uint32':
      return service.decryptUint32(params);
    case 'uint64':
      return service.decryptUint64(params);
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Create contract instance
 */
export function getContractInstance(config: ContractConfig): ContractService {
  return new ContractService(config);
}

/**
 * Format Ethereum address
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Parse encrypted input proof
 */
export function parseEncryptedInput(inputProof: string) {
  try {
    return JSON.parse(inputProof);
  } catch (error) {
    console.error('Failed to parse encrypted input:', error);
    return null;
  }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert Wei to Ether
 */
export function fromWei(wei: bigint | string, decimals: number = 18): string {
  const value = typeof wei === 'string' ? BigInt(wei) : wei;
  const divisor = 10n ** BigInt(decimals);
  const quotient = value / divisor;
  const remainder = value % divisor;
  return `${quotient}.${remainder.toString().padStart(decimals, '0')}`;
}

/**
 * Convert Ether to Wei
 */
export function toWei(ether: string | number, decimals: number = 18): bigint {
  const [whole, fraction = ''] = ether.toString().split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction);
}
