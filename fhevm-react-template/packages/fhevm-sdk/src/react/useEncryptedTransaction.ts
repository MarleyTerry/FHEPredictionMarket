import { useState, useCallback } from 'react';
import type { Signer } from 'ethers';
import { EncryptionService } from '../core/EncryptionService';
import { ContractService } from '../core/ContractService';
import { useFhevmClient } from './useFhevmClient';
import type { ContractConfig } from '../types';

interface EncryptedTransactionParams {
  method: string;
  encryptedInputs: Array<{
    type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';
    value: boolean | number | bigint | string;
  }>;
  additionalArgs?: any[];
  overrides?: any;
}

/**
 * Hook for sending encrypted transactions to FHEVM contracts
 *
 * Usage:
 * ```tsx
 * const { sendEncryptedTransaction, isLoading, error } = useEncryptedTransaction({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const tx = await sendEncryptedTransaction({
 *   method: 'placeBet',
 *   encryptedInputs: [
 *     { type: 'uint32', value: 100 },
 *     { type: 'bool', value: true }
 *   ],
 *   additionalArgs: [marketId]
 * });
 * ```
 */
export function useEncryptedTransaction(config: ContractConfig) {
  const { client, isReady } = useFhevmClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendEncryptedTransaction = useCallback(
    async (params: EncryptedTransactionParams) => {
      if (!client || !isReady) {
        const error = new Error('FHEVM client not ready');
        setError(error);
        return null;
      }

      if (!config.signer) {
        const error = new Error('Signer not provided');
        setError(error);
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get user address
        const userAddress = await (config.signer as Signer).getAddress();

        // Encrypt inputs
        const encryptionService = new EncryptionService(client);
        const encryptedData = await encryptionService.encryptBatch(
          config.address,
          userAddress,
          params.encryptedInputs
        );

        // Create contract service
        const contractService = new ContractService(config);

        // Prepare transaction arguments
        const txArgs = [
          ...encryptedData.handles,
          encryptedData.inputProof,
          ...(params.additionalArgs || []),
        ];

        // Send transaction
        const tx = await contractService.write(params.method, txArgs, params.overrides);

        return tx;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Transaction failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client, isReady, config]
  );

  return {
    sendEncryptedTransaction,
    isLoading,
    error,
  };
}
