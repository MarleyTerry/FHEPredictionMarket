'use client';

import React, { useState } from 'react';
import { useFhevmClient, useEncryption } from '@fhevm/sdk/react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const EncryptionDemo: React.FC = () => {
  const [value, setValue] = useState('');
  const [encryptedValue, setEncryptedValue] = useState<string>('');
  const { client, isInitialized } = useFhevmClient();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncrypt = async () => {
    if (!value || !client) return;

    try {
      const encrypted = await encrypt(BigInt(value), 'uint32');
      setEncryptedValue(encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  return (
    <Card
      title="Encryption Demo"
      subtitle="Encrypt values using FHEVM"
      variant="bordered"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm font-medium">
            FHE Client: {isInitialized ? 'Ready' : 'Initializing...'}
          </span>
        </div>

        <Input
          label="Value to Encrypt"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
          helperText="Enter a positive integer to encrypt"
        />

        <Button
          onClick={handleEncrypt}
          disabled={!value || !isInitialized}
          isLoading={isEncrypting}
          variant="primary"
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {encryptedValue && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Encrypted Result</h4>
            <p className="text-sm text-green-700 font-mono break-all">
              {encryptedValue}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EncryptionDemo;
