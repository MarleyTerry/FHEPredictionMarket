import { useFhevmContext } from './FhevmProvider';

/**
 * Hook to access FHEVM client instance
 *
 * Usage:
 * ```tsx
 * const { client, isInitialized, error } = useFhevmClient();
 * ```
 */
export function useFhevmClient() {
  const { client, isInitialized, error } = useFhevmContext();

  return {
    client,
    isInitialized,
    error,
    isReady: isInitialized && !error,
  };
}
