import { useState } from 'react'
import { BrowserProvider } from 'ethers'

interface WalletConnectProps {
  onConnect: (provider: BrowserProvider, address: string) => void
  onDisconnect: () => void
  isConnected: boolean
  address: string
}

export default function WalletConnect({
  onConnect,
  onDisconnect,
  isConnected,
  address,
}: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleConnect = async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected. Please install MetaMask.')
      return
    }

    try {
      setIsConnecting(true)
      setError('')

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const provider = new BrowserProvider(window.ethereum)
      onConnect(provider, accounts[0])
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
    setError('')
  }

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <div>
      <h2>Wallet Connection</h2>

      {error && (
        <div className="status error" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {!isConnected ? (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <span className="spinner"></span> Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="address">{formatAddress(address)}</div>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  )
}
