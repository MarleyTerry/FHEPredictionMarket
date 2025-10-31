'use client';

import { useState } from 'react';
import { useFhevmClient, useEncryption } from '@fhevm/sdk/react';

interface EncryptionDemoProps {
  address: string;
}

export default function EncryptionDemo({ address }: EncryptionDemoProps) {
  const { isReady, error: clientError } = useFhevmClient();
  const { encrypt, isEncrypting, error: encryptError } = useEncryption();

  const [inputValue, setInputValue] = useState('');
  const [encryptionType, setEncryptionType] = useState<
    'bool' | 'uint8' | 'uint16' | 'uint32'
  >('uint32');
  const [result, setResult] = useState<string>('');

  const handleEncrypt = async () => {
    if (!inputValue) {
      alert('Please enter a value to encrypt');
      return;
    }

    setResult('');

    try {
      let value: any;

      if (encryptionType === 'bool') {
        value = inputValue.toLowerCase() === 'true' || inputValue === '1';
      } else {
        value = parseInt(inputValue, 10);
        if (isNaN(value)) {
          alert('Please enter a valid number');
          return;
        }
      }

      const encrypted = await encrypt(encryptionType, value);

      if (encrypted) {
        // Convert encrypted data to hex string for display
        const hexData = Array.from(encrypted.data)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        setResult(`0x${hexData.slice(0, 64)}...`);
      }
    } catch (err: any) {
      console.error('Encryption error:', err);
      alert(err.message || 'Failed to encrypt value');
    }
  };

  if (clientError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error initializing FHEVM: {clientError.message}
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Initializing FHEVM client...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Encryption Demo</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encryption Type
          </label>
          <select
            value={encryptionType}
            onChange={(e) =>
              setEncryptionType(e.target.value as 'bool' | 'uint8' | 'uint16' | 'uint32')
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="bool">Boolean (true/false)</option>
            <option value="uint8">Uint8 (0-255)</option>
            <option value="uint16">Uint16 (0-65535)</option>
            <option value="uint32">Uint32 (0-4294967295)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value to Encrypt
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              encryptionType === 'bool'
                ? 'Enter true or false'
                : 'Enter a number'
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={isEncrypting || !inputValue}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </button>

        {encryptError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {encryptError.message}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-2 font-semibold">
              Encrypted Result:
            </p>
            <p className="font-mono text-sm text-green-900 break-all">{result}</p>
            <p className="text-xs text-green-600 mt-2">
              This encrypted value can be sent to smart contracts for confidential
              computation
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Values are encrypted using FHEVM homomorphic encryption</li>
          <li>Encrypted data can be computed on without decryption</li>
          <li>Only authorized parties can decrypt the results</li>
          <li>Perfect for confidential smart contract operations</li>
        </ul>
      </div>
    </div>
  );
}
