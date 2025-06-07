'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { WIPBanner } from '../components/WIPBanner';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Settings,
  Zap,
  History,
  Wallet,
  Key,
  Hash,
  QrCode,
  Copy,
  Download
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'private' | 'shielded' | 'commitment' | 'nullifier';
  amount: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'mixing' | 'committed' | 'nullified';
  commitment?: string;
  nullifier?: string;
  proof?: string;
  recipient?: string;
  sender?: string;
}

interface PoolStats {
  totalShielded: number;
  activeMixing: number;
  averageMixTime: number;
  commitmentCount: number;
  nullifierCount: number;
  poolSize: number;
}

export default function Privacy() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTab, setSelectedTab] = useState<'send' | 'receive' | 'pool' | 'history'>('send');
  const [poolStats, setPoolStats] = useState<PoolStats>({
    totalShielded: 0,
    activeMixing: 0,
    averageMixTime: 0,
    commitmentCount: 0,
    nullifierCount: 0,
    poolSize: 0
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mixingTime, setMixingTime] = useState(30);
  const [selectedToken, setSelectedToken] = useState('DOT');
  const [transactionStep, setTransactionStep] = useState<'input' | 'confirm' | 'processing' | 'complete'>('input');

  // Simulate real-time pool updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPoolStats(prev => ({
        ...prev,
        totalShielded: prev.totalShielded + Math.random() * 10,
        activeMixing: Math.floor(Math.random() * 5),
        averageMixTime: Math.floor(Math.random() * 60),
        commitmentCount: prev.commitmentCount + Math.floor(Math.random() * 2),
        nullifierCount: prev.nullifierCount + Math.floor(Math.random() * 1),
        poolSize: prev.poolSize + Math.random() * 100
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateCommitment = () => {
    return '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generateNullifier = () => {
    return '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generateProof = () => {
    return '0x' + Array(128).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const handlePrivateTransfer = () => {
    const commitment = generateCommitment();
    const nullifier = generateNullifier();
    const proof = generateProof();

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'private',
      amount,
      timestamp: new Date().toISOString(),
      status: 'pending',
      commitment,
      nullifier,
      proof,
      recipient,
      sender: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Simulate Poseidon hash computation
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'committed' }
            : tx
        )
      );
    }, 2000);

    // Simulate nullifier generation
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'nullified' }
            : tx
        )
      );
    }, 4000);

    // Simulate final completion
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'completed' }
            : tx
        )
      );
    }, 6000);
  };

  const handleShieldedTransfer = () => {
    const commitment = generateCommitment();
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'shielded',
      amount,
      timestamp: new Date().toISOString(),
      status: 'mixing',
      commitment,
      sender: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Simulate mixing process
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'completed' }
            : tx
        )
      );
    }, mixingTime * 1000);
  };

  return (
    <div className="min-h-screen bg-shield-bg relative overflow-hidden">
      <WIPBanner />
      
      {/* SVG grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-13" />
      
      {/* Animated blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-shield-accent rounded-full mix-blend-multiply filter blur-[40px] opacity-28 animate-blob" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#edead7] rounded-full mix-blend-multiply filter blur-[40px] opacity-28 animate-blob animation-delay-4000" />

      <Head>
        <title>Privacy Interface - Oblivio</title>
        <meta name="description" content="Privacy-preserving token system built on Polkadot AssetHub using Poseidon hash function." />
        <link rel="icon" href="/o2.png" />
      </Head>

      {/* Sticky navigation bar */}
      <nav className="sticky top-8 z-50 bg-shield-accent border-b-2 border-shield-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Image src="/o2.png" alt="Oblivio Logo" width={64} height={64} className="w-20 h-20 object-contain" />
              <div className="flex space-x-8">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>

                <Link href="/privacy" className="nav-link active">Privacy</Link>
                <Link href="/settings" className="nav-link">Settings</Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Pool Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-shield-border shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-shield-text">Pool Statistics</h3>
              <RefreshCw className="w-5 h-5 text-shield-text-light animate-spin" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Total Shielded</span>
                <span className="font-mono text-shield-text">{poolStats.totalShielded.toFixed(4)} DOT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Active Mixing</span>
                <span className="font-mono text-shield-text">{poolStats.activeMixing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Avg. Mix Time</span>
                <span className="font-mono text-shield-text">{poolStats.averageMixTime}m</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-shield-border shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-shield-text">Commitments</h3>
              <Hash className="w-5 h-5 text-shield-text-light" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Active</span>
                <span className="font-mono text-shield-text">{poolStats.commitmentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Nullified</span>
                <span className="font-mono text-shield-text">{poolStats.nullifierCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Pool Size</span>
                <span className="font-mono text-shield-text">{poolStats.poolSize.toFixed(2)} DOT</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-shield-border shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-shield-text">Privacy Status</h3>
              <Shield className="w-5 h-5 text-shield-text-light" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Anonymity Set</span>
                <span className="font-mono text-shield-text">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Mix Depth</span>
                <span className="font-mono text-shield-text">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-shield-text-light">Security Level</span>
                <span className="font-mono text-shield-text">128-bit</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Transaction Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 border border-shield-border shadow-lg mb-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-shield-text">Private Transactions</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-4 py-2 rounded bg-shield-accent text-shield-text hover:bg-shield-accent-dark transition-colors duration-200"
              >
                {showAdvanced ? 'Basic Mode' : 'Advanced Mode'}
              </button>
            </div>
          </div>
          
          {/* Main Action Tabs */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setSelectedTab('send')}
              className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                selectedTab === 'send' 
                  ? 'bg-shield-primary text-white' 
                  : 'bg-shield-accent text-shield-text hover:bg-shield-accent-dark'
              }`}
            >
              <ArrowRight className="w-6 h-6" />
              <span>Send Privately</span>
            </button>
            <button
              onClick={() => setSelectedTab('receive')}
              className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                selectedTab === 'receive' 
                  ? 'bg-shield-primary text-white' 
                  : 'bg-shield-accent text-shield-text hover:bg-shield-accent-dark'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Receive Privately</span>
            </button>
            <button
              onClick={() => setSelectedTab('pool')}
              className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                selectedTab === 'pool' 
                  ? 'bg-shield-primary text-white' 
                  : 'bg-shield-accent text-shield-text hover:bg-shield-accent-dark'
              }`}
            >
              <Shield className="w-6 h-6" />
              <span>Shielded Pool</span>
            </button>
            <button
              onClick={() => setSelectedTab('history')}
              className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                selectedTab === 'history' 
                  ? 'bg-shield-primary text-white' 
                  : 'bg-shield-accent text-shield-text hover:bg-shield-accent-dark'
              }`}
            >
              <History className="w-6 h-6" />
              <span>History</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Send Private Transaction */}
            {selectedTab === 'send' && (
              <motion.div
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-shield-accent p-6 rounded-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-shield-text">Send Private Transaction</h2>
                
                {transactionStep === 'input' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 text-shield-text">Amount</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 rounded bg-white border border-shield-border text-shield-text pr-20"
                            placeholder="Enter amount"
                          />
                          <div className="absolute right-3 top-3">
                            <select
                              value={selectedToken}
                              onChange={(e) => setSelectedToken(e.target.value)}
                              className="bg-transparent text-shield-text"
                            >
                              <option value="DOT">DOT</option>
                              <option value="USDT">USDT</option>
                              <option value="WETH">WETH</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 text-shield-text">Recipient Address</label>
                        <input
                          type="text"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          className="w-full p-3 rounded bg-white border border-shield-border text-shield-text"
                          placeholder="Enter recipient address"
                        />
                      </div>
                    </div>

                    {showAdvanced && (
                      <div className="p-4 bg-white rounded border border-shield-border">
                        <h3 className="font-semibold mb-4 text-shield-text">Advanced Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-shield-text">Privacy Level</label>
                            <select
                              className="w-full p-3 rounded bg-white border border-shield-border text-shield-text"
                            >
                              <option value="high">High (3 hops)</option>
                              <option value="medium">Medium (2 hops)</option>
                              <option value="low">Low (1 hop)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block mb-2 text-shield-text">Mixing Time</label>
                            <select
                              value={mixingTime}
                              onChange={(e) => setMixingTime(Number(e.target.value))}
                              className="w-full p-3 rounded bg-white border border-shield-border text-shield-text"
                            >
                              <option value="30">30 minutes</option>
                              <option value="60">1 hour</option>
                              <option value="120">2 hours</option>
                              <option value="240">4 hours</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setTransactionStep('confirm')}
                      className="w-full bg-shield-primary hover:bg-shield-primary-light text-white p-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Continue to Confirm</span>
                    </button>
                  </div>
                )}

                {transactionStep === 'confirm' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-shield-border">
                      <h3 className="text-xl font-semibold mb-4 text-shield-text">Confirm Transaction</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-shield-text-light">Amount:</span>
                          <span className="font-mono text-shield-text">{amount} {selectedToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-shield-text-light">Recipient:</span>
                          <span className="font-mono text-shield-text">{recipient}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-shield-text-light">Privacy Level:</span>
                          <span className="text-shield-text">High (3 hops)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-shield-text-light">Estimated Time:</span>
                          <span className="text-shield-text">{mixingTime} minutes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setTransactionStep('input')}
                        className="flex-1 p-4 rounded-lg border border-shield-border text-shield-text hover:bg-shield-accent transition-colors duration-200"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setTransactionStep('processing');
                          handlePrivateTransfer();
                        }}
                        className="flex-1 bg-shield-primary hover:bg-shield-primary-light text-white p-4 rounded-lg transition-colors duration-200"
                      >
                        Confirm & Send
                      </button>
                    </div>
                  </div>
                )}

                {transactionStep === 'processing' && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-shield-primary mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold mb-2 text-shield-text">Processing Transaction</h3>
                    <p className="text-shield-text-light">Creating Poseidon commitment and generating nullifier...</p>
                  </div>
                )}

                {transactionStep === 'complete' && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-shield-text">Transaction Complete</h3>
                    <p className="text-shield-text-light mb-6">Your private transaction has been processed successfully.</p>
                    <button
                      onClick={() => setTransactionStep('input')}
                      className="bg-shield-primary hover:bg-shield-primary-light text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      New Transaction
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Receive Private Transaction */}
            {selectedTab === 'receive' && (
              <motion.div
                key="receive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-shield-accent p-6 rounded-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-shield-text">Receive Private Transaction</h2>
                <div className="bg-white p-6 rounded-lg border border-shield-border">
                  <div className="text-center mb-6">
                    <div className="w-48 h-48 bg-shield-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-shield-text" />
                    </div>
                    <p className="text-shield-text-light mb-2">Your Private Address</p>
                    <p className="font-mono text-sm text-shield-text break-all">
                      0x1234...5678
                    </p>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full p-3 rounded-lg border border-shield-border text-shield-text hover:bg-shield-accent transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Copy className="w-5 h-5" />
                      <span>Copy Address</span>
                    </button>
                    <button className="w-full p-3 rounded-lg border border-shield-border text-shield-text hover:bg-shield-accent transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Download QR Code</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shielded Pool Interface */}
            {selectedTab === 'pool' && (
              <motion.div
                key="pool"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-shield-accent p-6 rounded-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-shield-text">Shielded Pool</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-shield-border">
                    <h3 className="text-xl font-semibold mb-4 text-shield-text">Add to Pool</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-shield-text">Amount to Shield</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 rounded bg-white border border-shield-border text-shield-text pr-20"
                            placeholder="Enter amount"
                          />
                          <div className="absolute right-3 top-3">
                            <select
                              value={selectedToken}
                              onChange={(e) => setSelectedToken(e.target.value)}
                              className="bg-transparent text-shield-text"
                            >
                              <option value="DOT">DOT</option>
                              <option value="USDT">USDT</option>
                              <option value="WETH">WETH</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleShieldedTransfer}
                        className="w-full bg-shield-primary hover:bg-shield-primary-light text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Add to Shielded Pool</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-shield-border">
                    <h3 className="text-xl font-semibold mb-4 text-shield-text">Pool Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-shield-text-light">Total Shielded</span>
                        <span className="font-mono text-shield-text">{poolStats.totalShielded.toFixed(4)} DOT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-shield-text-light">Active Mixing</span>
                        <span className="font-mono text-shield-text">{poolStats.activeMixing}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-shield-text-light">Avg. Mix Time</span>
                        <span className="font-mono text-shield-text">{poolStats.averageMixTime}m</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-shield-text-light">Pool Size</span>
                        <span className="font-mono text-shield-text">{poolStats.poolSize.toFixed(2)} DOT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Transaction History */}
            {selectedTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-shield-accent p-6 rounded-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-shield-text">Transaction History</h2>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-lg border border-shield-border"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-shield-text-light">Type</p>
                          <p className="font-semibold text-shield-text">
                            {tx.type === 'private' ? 'Private Transfer' : 'Shielded Transfer'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-shield-text-light">Amount</p>
                          <p className="font-mono text-shield-text">{tx.amount} {selectedToken}</p>
                        </div>
                        <div>
                          <p className="text-sm text-shield-text-light">Time</p>
                          <p className="text-sm text-shield-text">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-shield-text-light">Status</p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              tx.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : tx.status === 'mixing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : tx.status === 'committed'
                                ? 'bg-blue-100 text-blue-800'
                                : tx.status === 'nullified'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                      </div>
                      {showAdvanced && tx.commitment && (
                        <div className="mt-4 pt-4 border-t border-shield-border">
                          <p className="text-sm text-shield-text-light">Commitment: <span className="font-mono">{tx.commitment}</span></p>
                          {tx.nullifier && (
                            <p className="text-sm text-shield-text-light">Nullifier: <span className="font-mono">{tx.nullifier}</span></p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Educational Section - Now at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-shield-border shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-shield-text">How Oblivio Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-shield-accent p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-shield-primary" />
                <h3 className="text-lg font-semibold text-shield-text">Commitment Scheme</h3>
              </div>
              <p className="text-shield-text-light text-sm">
                Your transaction details are hidden behind cryptographic commitments using the Poseidon hash function. 
                This ensures that amounts and recipients remain private while maintaining transaction validity.
              </p>
            </div>

            <div className="bg-shield-accent p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-shield-primary" />
                <h3 className="text-lg font-semibold text-shield-text">Shielded Pool</h3>
              </div>
              <p className="text-shield-text-light text-sm">
                Transactions are mixed in a shielded pool, breaking the link between senders and recipients. 
                The pool uses time-based mixing periods and configurable pool sizes for optimal privacy.
              </p>
            </div>

            <div className="bg-shield-accent p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Key className="w-6 h-6 text-shield-primary" />
                <h3 className="text-lg font-semibold text-shield-text">Nullifier System</h3>
              </div>
              <p className="text-shield-text-light text-sm">
                Each transaction generates a unique nullifier, preventing double-spending without revealing 
                transaction details. This is verified using zero-knowledge proofs for maximum privacy.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-shield-accent rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-shield-text">Privacy Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border border-shield-border">
                <h4 className="font-semibold mb-2 text-shield-text">High Privacy (3 Hops)</h4>
                <p className="text-sm text-shield-text-light">
                  Maximum privacy with three mixing rounds. Recommended for large transactions.
                </p>
                <div className="mt-2 text-xs text-shield-text-light">
                  Mixing Time: 2-4 hours
                </div>
              </div>
              <div className="bg-white p-4 rounded border border-shield-border">
                <h4 className="font-semibold mb-2 text-shield-text">Medium Privacy (2 Hops)</h4>
                <p className="text-sm text-shield-text-light">
                  Balanced privacy and speed with two mixing rounds. Good for regular transactions.
                </p>
                <div className="mt-2 text-xs text-shield-text-light">
                  Mixing Time: 1-2 hours
                </div>
              </div>
              <div className="bg-white p-4 rounded border border-shield-border">
                <h4 className="font-semibold mb-2 text-shield-text">Low Privacy (1 Hop)</h4>
                <p className="text-sm text-shield-text-light">
                  Basic privacy with one mixing round. Suitable for small, frequent transactions.
                </p>
                <div className="mt-2 text-xs text-shield-text-light">
                  Mixing Time: 30-60 minutes
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-shield-accent rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-shield-text">Technical Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-shield-text">Poseidon Hash Function</h4>
                <p className="text-sm text-shield-text-light">
                  Our implementation of the Poseidon hash function is specifically optimized for zero-knowledge proof systems,
                  providing efficient and secure privacy-preserving operations on Polkadot AssetHub.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-shield-text">Security Features</h4>
                <ul className="list-disc list-inside text-sm text-shield-text-light space-y-1">
                  <li>Collision-resistant commitment scheme</li>
                  <li>ZK-optimized cryptographic primitives</li>
                  <li>Preimage-secure hash function</li>
                  <li>Constant-time operations for timing attack resistance</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 