import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

/**
 * Client-side FHE operations
 * Wrapper functions for SDK client operations
 */

export async function createFhevmClient(provider: BrowserProvider): Promise<FhevmClient> {
  const client = new FhevmClient({ provider });
  await client.init();
  return client;
}

export async function encryptValue(
  client: FhevmClient,
  value: bigint,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bytes'
): Promise<string> {
  return await client.encrypt(value, type);
}

export async function getPublicKey(client: FhevmClient): Promise<string> {
  return await client.getPublicKey();
}

export function validateEncryptedInput(input: string): boolean {
  // Basic validation for encrypted input format
  return typeof input === 'string' && input.length > 0;
}
