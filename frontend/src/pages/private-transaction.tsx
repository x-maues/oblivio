import { useState } from 'react';
import Layout from '../components/Layout';
import { Shield, ArrowRight, Lock, Unlock } from 'lucide-react';

const PrivateTransaction = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      // Reset form
      setAmount('');
      setRecipient('');
    }, 2000);
  };

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Content */}
        <div className="relative max-w-6xl mx-auto p-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-shield-primary to-shield-secondary">
              Private Transaction
            </h1>
            <p className="mt-4 text-shield-text-light">
              Securely deposit and withdraw tokens with enhanced privacy
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-shield-background p-1">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'deposit'
                    ? 'bg-white shadow-sm text-shield-primary'
                    : 'text-shield-text-light hover:text-shield-text'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Deposit</span>
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'withdraw'
                    ? 'bg-white shadow-sm text-shield-primary'
                    : 'text-shield-text-light hover:text-shield-text'
                }`}
              >
                <Unlock className="w-4 h-4" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction Form */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-shield-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-shield-text-light mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-shield-border focus:ring-2 focus:ring-shield-primary focus:border-transparent transition-all"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  {activeTab === 'withdraw' && (
                    <div>
                      <label className="block text-sm font-medium text-shield-text-light mb-1">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-shield-border focus:ring-2 focus:ring-shield-primary focus:border-transparent transition-all"
                        placeholder="Enter recipient address"
                        required
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-shield-primary to-shield-secondary text-white py-3 px-6 rounded-lg hover:from-shield-primary-dark hover:to-shield-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shield-primary transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Transaction Info */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-shield-border">
              <h2 className="text-2xl font-semibold mb-6 text-shield-text">Transaction Information</h2>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-shield-background to-shield-background-light rounded-xl">
                  <p className="text-sm text-shield-text-light mb-1">Transaction Type</p>
                  <p className="text-2xl font-bold text-shield-primary">
                    {activeTab === 'deposit' ? 'Private Deposit' : 'Private Withdrawal'}
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-shield-background to-shield-background-light rounded-xl">
                  <p className="text-sm text-shield-text-light mb-1">Privacy Level</p>
                  <p className="text-2xl font-bold text-shield-primary">Enhanced</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-shield-background to-shield-background-light rounded-xl">
                  <p className="text-sm text-shield-text-light mb-1">Status</p>
                  <p className="text-2xl font-bold text-shield-primary">
                    {isProcessing ? 'Processing' : 'Ready'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivateTransaction; 