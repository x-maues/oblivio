import Head from 'next/head';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { WIPBanner } from '../components/WIPBanner';
import { AlertCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-shield-bg relative overflow-hidden">
      <WIPBanner />
      
      {/* SVG grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-13" />
      
      {/* Animated blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-shield-accent rounded-full mix-blend-multiply filter blur-[40px] opacity-28 animate-blob" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#edead7] rounded-full mix-blend-multiply filter blur-[40px] opacity-28 animate-blob animation-delay-4000" />

      <Head>
        <title>Settings - Oblivio</title>
        <meta name="description" content="Configure your privacy settings for Oblivio" />
        <link rel="icon" href="/o2.png" />
      </Head>

      {/* Sticky navigation bar */}
      <nav className="sticky top-8 z-50 bg-shield-accent border-b-2 border-shield-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Image src="/o2.png" alt="Oblivio Logo" width={64} height={64} className="w-16 h-16 object-contain" />
              <div className="flex space-x-8">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/settings" className="nav-link active">Settings</Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="card p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-800">Connected to Polkadot AssetHub Testnet</h3>
                <p className="text-sm text-blue-600">This is a test network. No real funds are at risk.</p>
              </div>
            </div>
          </div>
        </div>

        {isMounted && (
          <>
            {!isConnected ? (
              <div className="card text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-shield-text mb-6">Please connect your wallet to access settings</p>
                <ConnectButton />
              </div>
            ) : (
              <>
                {/* Privacy Settings */}
                <section className="mb-8">
                  <h2 className="text-3xl font-bold mb-6">Privacy Settings</h2>
                  <div className="card p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Default Privacy Mode</h3>
                          <p className="text-shield-text">Use Poseidon commitments by default for all transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-shield-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-shield-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-shield-accent"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Commitment History</h3>
                          <p className="text-shield-text">Show Poseidon commitment history in dashboard</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-shield-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-shield-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-shield-accent"></div>
                        </label>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-yellow-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Some settings may not be fully functional in the current beta version.</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Network Settings */}
                <section className="mb-8">
                  <h2 className="text-3xl font-bold mb-6">Network Settings</h2>
                  <div className="card p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Current Network</h3>
                        <p className="text-shield-text">Polkadot AssetHub (Testnet)</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">RPC Endpoint</h3>
                        <p className="text-shield-text">wss://westend-asset-hub-rpc.polkadot.io</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Block Explorer</h3>
                        <a href="https://westend-assets.subscan.io" target="_blank" rel="noopener noreferrer" className="text-shield-accent hover:text-shield-dark">
                          westend-assets.subscan.io
                        </a>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Advanced Settings */}
                <section>
                  <h2 className="text-3xl font-bold mb-6">Advanced Settings</h2>
                  <div className="card p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Debug Mode</h3>
                          <p className="text-shield-text">Enable Poseidon hash debugging and detailed transaction logs</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-shield-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-shield-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-shield-accent"></div>
                        </label>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Reset Settings</h3>
                        <p className="text-shield-text mb-4">Reset all settings to their default values</p>
                        <button className="btn-primary">Reset All Settings</button>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-yellow-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Advanced features are still under development.</span>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-shield-accent border-t-2 border-shield-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <span className="text-shield-text">© {new Date().getFullYear()} Oblivio. All rights reserved.</span>
            <Link href="/settings" className="text-shield-text hover:text-shield-dark">Privacy Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 