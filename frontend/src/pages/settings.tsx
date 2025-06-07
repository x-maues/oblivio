import Head from 'next/head';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { WIPBanner } from '../components/WIPBanner';
import { AlertCircle, Info, Settings as SettingsIcon, Shield, Bell, Lock } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Settings() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-shield-bg relative overflow-hidden">
      <WIPBanner />
      
      {/* SVG grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-13" />
      
      {/* Animated blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 1 }}
        className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-shield-accent rounded-full mix-blend-multiply filter blur-[40px] animate-blob"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#edead7] rounded-full mix-blend-multiply filter blur-[40px] animate-blob animation-delay-4000"
      />

      <Head>
        <title>Settings - Oblivio</title>
        <meta name="description" content="Configure your privacy settings" />
        <link rel="icon" href="/o2.png" />
      </Head>

      {/* Sticky navigation bar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-8 z-50 bg-shield-accent border-b-2 border-shield-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image src="/o2.png" alt="Oblivio Logo" width={64} height={64} className="w-16 h-16 object-contain" />
              </motion.div>
              <div className="flex space-x-8">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/privacy" className="nav-link">Privacy</Link>
                <Link href="/settings" className="nav-link active">Settings</Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card text-center p-8"
          >
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-shield-text mb-6">Please connect your wallet to access settings</p>
            <ConnectButton />
          </motion.div>
        ) : (
          <>
            {/* Settings Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-4">
                <SettingsIcon className="w-8 h-8 text-shield-accent" />
                <h1 className="text-4xl font-bold">Settings</h1>
              </div>
              <p className="text-shield-text mt-2">Configure your privacy preferences and account settings</p>
            </motion.div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Privacy Settings */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-shield-accent" />
                  <h2 className="text-2xl font-bold">Privacy Settings</h2>
                </div>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Default Mixing Time</h3>
                      <p className="text-sm text-shield-text">Set the default duration for mixing transactions</p>
                    </div>
                    <select className="bg-shield-accent border border-shield-border rounded px-3 py-2">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                    </select>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Privacy Level</h3>
                      <p className="text-sm text-shield-text">Configure default privacy settings</p>
                    </div>
                    <select className="bg-shield-accent border border-shield-border rounded px-3 py-2">
                      <option>Standard</option>
                      <option>Enhanced</option>
                      <option>Maximum</option>
                    </select>
                  </motion.div>
                </div>
              </motion.section>

              {/* Notification Settings */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-shield-accent" />
                  <h2 className="text-2xl font-bold">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Transaction Alerts</h3>
                      <p className="text-sm text-shield-text">Get notified about transaction status</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-shield-accent peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-shield-accent"></div>
                    </label>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Pool Updates</h3>
                      <p className="text-sm text-shield-text">Receive updates about the shielded pool</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-shield-accent peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-shield-accent"></div>
                    </label>
                  </motion.div>
                </div>
              </motion.section>

              {/* Security Settings */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="w-6 h-6 text-shield-accent" />
                  <h2 className="text-2xl font-bold">Security</h2>
                </div>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Auto-Lock</h3>
                      <p className="text-sm text-shield-text">Automatically lock after inactivity</p>
                    </div>
                    <select className="bg-shield-accent border border-shield-border rounded px-3 py-2">
                      <option>5 minutes</option>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Session Timeout</h3>
                      <p className="text-sm text-shield-text">Set maximum session duration</p>
                    </div>
                    <select className="bg-shield-accent border border-shield-border rounded px-3 py-2">
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                      <option>24 hours</option>
                    </select>
                  </motion.div>
                </div>
              </motion.section>

              {/* Network Settings */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Info className="w-6 h-6 text-shield-accent" />
                  <h2 className="text-2xl font-bold">Network</h2>
                </div>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">RPC Endpoint</h3>
                      <p className="text-sm text-shield-text">Configure network connection</p>
                    </div>
                    <select className="bg-shield-accent border border-shield-border rounded px-3 py-2">
                      <option>Polkadot AssetHub Testnet</option>
                      <option>Polkadot AssetHub Mainnet</option>
                    </select>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-shield-bg rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Gas Settings</h3>
                      <p className="text-sm text-shield-text">Configure transaction gas preferences</p>
                    </div>
                    <select className="bg-shield-accent border border-shield-border rounded px-3 py-2">
                      <option>Standard</option>
                      <option>Fast</option>
                      <option>Custom</option>
                    </select>
                  </motion.div>
                </div>
              </motion.section>
            </div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8"
              >
                Save Changes
              </motion.button>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-shield-accent border-t-2 border-shield-border py-8 mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <span className="text-shield-text">© {new Date().getFullYear()} Oblivio. All rights reserved.</span>
            <Link href="/settings" className="text-shield-text hover:text-shield-dark">Privacy Settings</Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
} 