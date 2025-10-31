import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { FhevmClient } from '../core/FhevmClient';
import type { FhevmConfig } from '../types';

interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

export interface FhevmProviderProps {
  children: ReactNode;
  provider?: BrowserProvider;
  config?: Partial<FhevmConfig>;
}

/**
 * Provider component for FHEVM SDK in React applications
 *
 * Usage:
 * ```tsx
 * <FhevmProvider provider={provider}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ children, provider, config }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!provider) {
      setClient(null);
      setIsInitialized(false);
      return;
    }

    const initClient = async () => {
      try {
        const fhevmClient = new FhevmClient({
          provider,
          ...config,
        });

        await fhevmClient.init();
        setClient(fhevmClient);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize FHEVM client:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsInitialized(false);
      }
    };

    initClient();
  }, [provider, config]);

  return (
    <FhevmContext.Provider value={{ client, isInitialized, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access FHEVM context
 */
export function useFhevmContext() {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}
