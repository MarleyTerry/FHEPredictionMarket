import { useState } from 'react'
import { BrowserProvider } from 'ethers'
import { FhevmProvider } from '@fhevm/sdk/react'
import WalletConnect from './components/WalletConnect'
import EncryptionDemo from './components/EncryptionDemo'

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>('')

  const handleConnect = async (
    connectedProvider: BrowserProvider,
    connectedAddress: string
  ) => {
    setProvider(connectedProvider)
    setAddress(connectedAddress)
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setProvider(null)
    setAddress('')
    setIsConnected(false)
  }

  return (
    <div className="app">
      <h1>React + Vite + FHEVM SDK</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '2rem', opacity: 0.9 }}>
        Confidential smart contract interactions made simple
      </p>

      <div className="card">
        <WalletConnect
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
          address={address}
        />
      </div>

      {isConnected && provider ? (
        <FhevmProvider provider={provider}>
          <div className="card">
            <EncryptionDemo address={address} />
          </div>
        </FhevmProvider>
      ) : (
        <div className="card">
          <p style={{ opacity: 0.7 }}>
            Connect your wallet to start using encrypted operations
          </p>
        </div>
      )}

      <div style={{ marginTop: '3rem', opacity: 0.6, fontSize: '0.9em' }}>
        <p>
          This example demonstrates the FHEVM SDK integration in a React + Vite application.
        </p>
        <p>
          Learn more in the{' '}
          <a
            href="https://github.com/zama-ai/fhevm"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#646cff' }}
          >
            FHEVM Documentation
          </a>
        </p>
      </div>
    </div>
  )
}

export default App
