import { useState, useCallback, useEffect } from 'react';
import type { Signer } from 'ethers';
import { ContractService } from '../core/ContractService';
import type { ContractConfig } from '../types';

/**
 * Hook for interacting with FHEVM contracts
 *
 * Usage:
 * ```tsx
 * const { contract, read, write, isLoading, error } = useContract({
 *   address: '0x...',
 *   abi: [...],
 *   signer
 * });
 *
 * const result = await read('balanceOf', [address]);
 * const tx = await write('transfer', [to, amount]);
 * ```
 */
export function useContract(config: ContractConfig) {
  const [contract, setContract] = useState<ContractService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const contractService = new ContractService(config);
      setContract(contractService);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create contract');
      setError(error);
      setContract(null);
    }
  }, [config.address, config.abi, config.signer]);

  const read = useCallback(
    async <T = any>(method: string, args: any[] = []): Promise<T | null> => {
      if (!contract) {
        setError(new Error('Contract not initialized'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await contract.read<T>(method, args);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Contract read failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  const write = useCallback(
    async (method: string, args: any[] = [], overrides?: any) => {
      if (!contract) {
        setError(new Error('Contract not initialized'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await contract.write(method, args, overrides);
        return tx;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Transaction failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  const estimateGas = useCallback(
    async (method: string, args: any[] = []): Promise<bigint | null> => {
      if (!contract) {
        setError(new Error('Contract not initialized'));
        return null;
      }

      try {
        const gas = await contract.estimateGas(method, args);
        return gas;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Gas estimation failed');
        setError(error);
        return null;
      }
    },
    [contract]
  );

  const on = useCallback(
    (event: string, listener: (...args: any[]) => void) => {
      if (contract) {
        contract.on(event, listener);
      }
    },
    [contract]
  );

  const off = useCallback(
    (event: string, listener: (...args: any[]) => void) => {
      if (contract) {
        contract.off(event, listener);
      }
    },
    [contract]
  );

  return {
    contract,
    read,
    write,
    estimateGas,
    on,
    off,
    isLoading,
    error,
  };
}
