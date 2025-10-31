'use client';

import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { FhevmProvider } from '@fhevm/sdk/react';
import EncryptionDemo from '@/components/EncryptionDemo';
import WalletConnection from '@/components/WalletConnection';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  const handleConnect = async (
    connectedProvider: BrowserProvider,
    connectedAddress: string
  ) => {
    setProvider(connectedProvider);
    setAddress(connectedAddress);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setProvider(null);
    setAddress('');
    setIsConnected(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            FHEVM SDK - Next.js Example
          </h1>
          <p className="text-lg text-gray-700">
            Confidential smart contract interactions made simple
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <WalletConnection
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            address={address}
          />
        </div>

        {isConnected && provider && (
          <FhevmProvider provider={provider}>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <EncryptionDemo address={address} />
            </div>
          </FhevmProvider>
        )}

        {!isConnected && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600 text-lg">
              Connect your wallet to start using encrypted operations
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
