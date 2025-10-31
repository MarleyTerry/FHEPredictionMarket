'use client';

import React, { useState } from 'react';
import { useFhevmClient } from '@fhevm/sdk/react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface ComputationDemoProps {
  contractAddress?: string;
}

const ComputationDemo: React.FC<ComputationDemoProps> = ({ contractAddress }) => {
  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul'>('add');
  const [result, setResult] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);

  const { client, isInitialized } = useFhevmClient();

  const handleCompute = async () => {
    if (!valueA || !valueB || !client) return;

    setIsComputing(true);
    try {
      // Simulate encrypted computation
      const encryptedA = await client.encrypt(BigInt(valueA), 'uint32');
      const encryptedB = await client.encrypt(BigInt(valueB), 'uint32');

      setResult(`Encrypted ${operation} operation prepared. Deploy to contract at: ${contractAddress || 'N/A'}`);
    } catch (error) {
      console.error('Computation failed:', error);
      setResult('Computation failed');
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card
      title="Homomorphic Computation"
      subtitle="Perform computations on encrypted data"
      variant="elevated"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Value A"
            type="number"
            value={valueA}
            onChange={(e) => setValueA(e.target.value)}
            placeholder="First number"
          />
          <Input
            label="Value B"
            type="number"
            value={valueB}
            onChange={(e) => setValueB(e.target.value)}
            placeholder="Second number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as 'add' | 'sub' | 'mul')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (×)</option>
          </select>
        </div>

        <Button
          onClick={handleCompute}
          disabled={!valueA || !valueB || !isInitialized}
          isLoading={isComputing}
          variant="success"
          className="w-full"
        >
          Compute Encrypted Operation
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-900 mb-2">Result</h4>
            <p className="text-sm text-indigo-700">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ComputationDemo;
