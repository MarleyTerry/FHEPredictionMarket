'use client';

import React, { useState } from 'react';
import { useFhevmClient, useEncryption } from '@fhevm/sdk/react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

/**
 * Medical Example: Confidential health data management
 * Demonstrates encrypted medical record storage
 */
const MedicalExample: React.FC = () => {
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [glucose, setGlucose] = useState('');
  const [encryptedRecords, setEncryptedRecords] = useState<Record<string, string>>({});

  const { client, isInitialized } = useFhevmClient();
  const { encrypt, isEncrypting } = useEncryption();

  const handleEncryptRecords = async () => {
    if (!client) return;

    try {
      const records: Record<string, string> = {};

      if (bloodPressure) {
        records.bloodPressure = await encrypt(BigInt(bloodPressure), 'uint32');
      }
      if (heartRate) {
        records.heartRate = await encrypt(BigInt(heartRate), 'uint32');
      }
      if (glucose) {
        records.glucose = await encrypt(BigInt(glucose), 'uint32');
      }

      setEncryptedRecords(records);
    } catch (error) {
      console.error('Medical record encryption failed:', error);
    }
  };

  return (
    <Card
      title="Confidential Medical Records"
      subtitle="Private health data management"
      variant="elevated"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Blood Pressure (mmHg)"
            type="number"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="120"
            helperText="Systolic value"
          />
          <Input
            label="Heart Rate (bpm)"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="72"
            helperText="Beats per minute"
          />
          <Input
            label="Glucose (mg/dL)"
            type="number"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            placeholder="90"
            helperText="Blood sugar level"
          />
        </div>

        <Button
          onClick={handleEncryptRecords}
          disabled={!isInitialized || (!bloodPressure && !heartRate && !glucose)}
          isLoading={isEncrypting}
          variant="primary"
          className="w-full"
        >
          Encrypt Medical Records
        </Button>

        {Object.keys(encryptedRecords).length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg space-y-2">
            <h4 className="font-semibold text-green-900 mb-2">Encrypted Records</h4>
            {encryptedRecords.bloodPressure && (
              <div className="text-sm">
                <span className="font-medium text-green-800">Blood Pressure:</span>
                <span className="text-green-600 ml-2 font-mono text-xs">Encrypted ✓</span>
              </div>
            )}
            {encryptedRecords.heartRate && (
              <div className="text-sm">
                <span className="font-medium text-green-800">Heart Rate:</span>
                <span className="text-green-600 ml-2 font-mono text-xs">Encrypted ✓</span>
              </div>
            )}
            {encryptedRecords.glucose && (
              <div className="text-sm">
                <span className="font-medium text-green-800">Glucose:</span>
                <span className="text-green-600 ml-2 font-mono text-xs">Encrypted ✓</span>
              </div>
            )}
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            These medical records are encrypted on-chain and only accessible with proper authorization.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MedicalExample;
