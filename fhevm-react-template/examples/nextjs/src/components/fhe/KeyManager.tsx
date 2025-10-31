'use client';

import React, { useState, useEffect } from 'react';
import { useFhevmClient } from '@fhevm/sdk/react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const KeyManager: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { client, isInitialized } = useFhevmClient();

  useEffect(() => {
    const loadPublicKey = async () => {
      if (isInitialized && client) {
        setIsLoading(true);
        try {
          const key = await client.getPublicKey();
          setPublicKey(key);
        } catch (error) {
          console.error('Failed to load public key:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPublicKey();
  }, [client, isInitialized]);

  const handleRefreshKey = async () => {
    if (!client) return;

    setIsLoading(true);
    try {
      const key = await client.getPublicKey();
      setPublicKey(key);
    } catch (error) {
      console.error('Failed to refresh public key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      title="Key Manager"
      subtitle="Network public key management"
      variant="default"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : publicKey ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Network Public Key</h4>
            <p className="text-xs text-gray-600 font-mono break-all">
              {publicKey.substring(0, 100)}...
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Length: {publicKey.length} characters
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">No public key loaded</p>
          </div>
        )}

        <Button
          onClick={handleRefreshKey}
          disabled={!isInitialized || isLoading}
          variant="secondary"
          className="w-full"
        >
          Refresh Public Key
        </Button>
      </div>
    </Card>
  );
};

export default KeyManager;
