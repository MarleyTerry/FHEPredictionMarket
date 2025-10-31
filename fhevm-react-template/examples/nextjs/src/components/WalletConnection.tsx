'use client';

import { useState } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletConnectionProps {
  onConnect: (provider: BrowserProvider, address: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  address: string;
}

export default function WalletConnection({
  onConnect,
  onDisconnect,
  isConnected,
  address,
}: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      onConnect(provider, address);
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Connection</h2>

      {!isConnected ? (
        <div className="space-y-4">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">Connected Address:</p>
            <p className="font-mono text-lg text-green-900">{formatAddress(address)}</p>
          </div>

          <button
            onClick={onDisconnect}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
