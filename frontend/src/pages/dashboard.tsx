import Head from 'next/head';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { WIPBanner } from '../components/WIPBanner';
import { AlertCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Dashboard() {
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
        <title>Dashboard - Oblivio</title>
        <meta name="description" content="Manage your private token transactions" />
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
                <Link href="/dashboard" className="nav-link active">Dashboard</Link>
                <Link href="/privacy" className="nav-link">Privacy</Link>
                <Link href="/settings" className="nav-link">Settings</Link>
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
            <p className="text-shield-text mb-6">Please connect your wallet to view your private transactions</p>
            <ConnectButton />
          </motion.div>
        ) : (
          <>
            {/* Network Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="card p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-800">Connected to Polkadot AssetHub Testnet</h3>
                    <p className="text-sm text-blue-600">This is a test network. No real funds are at risk.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overview Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-6">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="card"
                >
                  <h3 className="text-xl font-bold mb-2">Shielded Balance</h3>
                  <p className="text-3xl font-bold text-shield-accent">0 SHLD</p>
                  <p className="text-sm text-yellow-700 mt-2">Shielding Token (Testnet)</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="card"
                >
                  <h3 className="text-xl font-bold mb-2">Active Commitments</h3>
                  <p className="text-3xl font-bold text-shield-accent">0</p>
                  <p className="text-sm text-yellow-700 mt-2">Poseidon commitments</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="card"
                >
                  <h3 className="text-xl font-bold mb-2">Network</h3>
                  <p className="text-shield-text">Polkadot AssetHub</p>
                  <p className="text-sm text-yellow-700 mt-2">Testnet environment</p>
                </motion.div>
              </div>
            </motion.section>

            {/* Recent Activity */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-6">Recent Activity</h2>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="card"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-shield-border">
                        <th className="text-left py-4 px-6">Type</th>
                        <th className="text-left py-4 px-6">Amount</th>
                        <th className="text-left py-4 px-6">Status</th>
                        <th className="text-left py-4 px-6">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-shield-border">
                        <td className="py-4 px-6">No recent activity</td>
                        <td className="py-4 px-6">-</td>
                        <td className="py-4 px-6">-</td>
                        <td className="py-4 px-6">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.section>

            {/* Quick Actions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Deposit to Shielded Pool</h3>
                  <p className="text-shield-text mb-6">Create a new Poseidon commitment and deposit tokens to the shielded pool</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary w-full"
                  >
                    Start Deposit
                  </motion.button>
                  <p className="text-sm text-yellow-700 mt-2 text-center">Coming soon</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Private Transfer</h3>
                  <p className="text-shield-text mb-6">Send tokens privately using the shielded pool</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary w-full"
                  >
                    Send Privately
                  </motion.button>
                  <p className="text-sm text-yellow-700 mt-2 text-center">Coming soon</p>
                </motion.div>
              </div>
            </motion.section>
          </>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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