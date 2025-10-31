'use client';

import React from 'react';
import { FhevmProvider as SDKFhevmProvider } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';

interface FHEProviderProps {
  provider: BrowserProvider;
  children: React.ReactNode;
}

/**
 * Wrapper component for the FHEVM SDK Provider
 * Provides FHE context to all child components
 */
const FHEProvider: React.FC<FHEProviderProps> = ({ provider, children }) => {
  return (
    <SDKFhevmProvider provider={provider}>
      {children}
    </SDKFhevmProvider>
  );
};

export default FHEProvider;
