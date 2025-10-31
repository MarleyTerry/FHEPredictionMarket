'use client';

import { useState, useCallback } from 'react';
import { useFhevmClient } from '@fhevm/sdk/react';

type ComputationOperation = 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';

interface ComputationResult {
  operation: ComputationOperation;
  timestamp: number;
  status: 'success' | 'failed';
}

/**
 * Hook for FHE computation operations
 * Handles encrypted arithmetic and comparison operations
 */
export function useComputation() {
  const { client, isInitialized } = useFhevmClient();
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [history, setHistory] = useState<ComputationResult[]>([]);

  const prepareComputation = useCallback(async (
    operation: ComputationOperation,
    operands: bigint[]
  ) => {
    if (!client || !isInitialized) {
      throw new Error('FHE client not initialized');
    }

    setIsComputing(true);
    setError(null);

    try {
      // Encrypt operands for on-chain computation
      const encryptedOperands = await Promise.all(
        operands.map(value => client.encrypt(value, 'uint32'))
      );

      const result: ComputationResult = {
        operation,
        timestamp: Date.now(),
        status: 'success'
      };

      setHistory(prev => [...prev, result]);

      return {
        operation,
        encryptedOperands,
        message: 'Computation prepared for on-chain execution'
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Computation failed');
      setError(error);
      setHistory(prev => [...prev, {
        operation,
        timestamp: Date.now(),
        status: 'failed'
      }]);
      throw error;
    } finally {
      setIsComputing(false);
    }
  }, [client, isInitialized]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    prepareComputation,
    isComputing,
    error,
    history,
    clearHistory,
    isReady: isInitialized
  };
}
