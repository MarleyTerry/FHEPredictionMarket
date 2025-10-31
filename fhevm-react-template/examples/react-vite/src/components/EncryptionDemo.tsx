import { useState } from 'react'
import { useFhevmClient, useEncryption } from '@fhevm/sdk/react'

interface EncryptionDemoProps {
  address: string
}

export default function EncryptionDemo({ address }: EncryptionDemoProps) {
  const { client, isReady, error: clientError } = useFhevmClient()
  const { encryptUint32, isEncrypting, error: encryptError } = useEncryption()

  const [value, setValue] = useState<string>('42')
  const [encryptedValue, setEncryptedValue] = useState<string>('')

  const handleEncrypt = async () => {
    if (!client || !isReady) {
      return
    }

    try {
      const numValue = parseInt(value)
      if (isNaN(numValue) || numValue < 0) {
        alert('Please enter a valid positive number')
        return
      }

      const encrypted = await encryptUint32(numValue)
      setEncryptedValue(encrypted.data)
    } catch (err: any) {
      console.error('Encryption failed:', err)
      alert('Encryption failed: ' + (err.message || 'Unknown error'))
    }
  }

  const handleClear = () => {
    setEncryptedValue('')
    setValue('42')
  }

  return (
    <div>
      <h2>Encryption Demo</h2>

      {clientError && (
        <div className="status error" style={{ marginTop: '1rem' }}>
          Client Error: {clientError.message}
        </div>
      )}

      {encryptError && (
        <div className="status error" style={{ marginTop: '1rem' }}>
          Encryption Error: {encryptError.message}
        </div>
      )}

      {!isReady ? (
        <div className="status info" style={{ marginTop: '1rem' }}>
          <span className="spinner"></span> Initializing FHEVM client...
        </div>
      ) : (
        <div className="status success" style={{ marginTop: '1rem' }}>
          FHEVM client ready
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <div>
          <label htmlFor="value-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Enter a number to encrypt (uint32):
          </label>
          <input
            id="value-input"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isReady || isEncrypting}
            min="0"
            placeholder="Enter a positive number"
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleEncrypt} disabled={!isReady || isEncrypting}>
            {isEncrypting ? (
              <>
                <span className="spinner"></span> Encrypting...
              </>
            ) : (
              'Encrypt Value'
            )}
          </button>

          {encryptedValue && (
            <button onClick={handleClear}>
              Clear
            </button>
          )}
        </div>

        {encryptedValue && (
          <div className="status info" style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Encrypted Value:
            </div>
            <div
              style={{
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.85em',
                padding: '0.5rem',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
              }}
            >
              {encryptedValue}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.9em', opacity: 0.8 }}>
              This encrypted value can now be used in smart contract transactions
              to maintain confidentiality on-chain.
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9em', opacity: 0.7 }}>
        <p>
          This demo shows how to encrypt a uint32 value using the FHEVM SDK.
          The encrypted value can be used with smart contracts that support
          Fully Homomorphic Encryption (FHE).
        </p>
      </div>
    </div>
  )
}
