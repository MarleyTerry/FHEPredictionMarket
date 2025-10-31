'use client';

import React, { useState } from 'react';
import { useFhevmClient, useEncryption } from '@fhevm/sdk/react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

/**
 * Banking Example: Confidential balance transfers
 * Demonstrates encrypted balance management
 */
const BankingExample: React.FC = () => {
  const [balance, setBalance] = useState('1000');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [encryptedBalance, setEncryptedBalance] = useState<string>('');

  const { client, isInitialized } = useFhevmClient();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncryptBalance = async () => {
    if (!balance || !client) return;

    try {
      const encrypted = await encrypt(BigInt(balance), 'uint64');
      setEncryptedBalance(encrypted);
    } catch (error) {
      console.error('Balance encryption failed:', error);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !recipient || !client) return;

    try {
      const encryptedAmount = await encrypt(BigInt(transferAmount), 'uint64');
      alert(`Transfer prepared:\nRecipient: ${recipient}\nEncrypted Amount: ${encryptedAmount.substring(0, 50)}...`);
    } catch (error) {
      console.error('Transfer preparation failed:', error);
    }
  };

  return (
    <Card
      title="Confidential Banking"
      subtitle="Private balance management and transfers"
      variant="elevated"
    >
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Account Balance</p>
          <p className="text-3xl font-bold">${balance}</p>
          {encryptedBalance && (
            <p className="text-xs mt-2 opacity-75">Encrypted on-chain</p>
          )}
        </div>

        <Button
          onClick={handleEncryptBalance}
          disabled={!isInitialized}
          isLoading={isEncrypting}
          variant="primary"
          className="w-full"
        >
          Encrypt Balance
        </Button>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-3">Make Transfer</h4>
          <div className="space-y-3">
            <Input
              label="Recipient Address"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
            />
            <Input
              label="Amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <Button
              onClick={handleTransfer}
              disabled={!recipient || !transferAmount || !isInitialized}
              variant="success"
              className="w-full"
            >
              Prepare Encrypted Transfer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BankingExample;
