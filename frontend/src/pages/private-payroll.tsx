import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { Shield, ArrowRight, Upload, FileText, Users, Settings, History, Info } from 'lucide-react';
import Image from 'next/image';

const PrivatePayroll = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
        setCsvData(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/grid.svg"
            alt="Grid Background"
            fill
            className="opacity-10"
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-shield-primary to-shield-secondary">
              Private Payroll
            </h1>
            <p className="mt-4 text-shield-text-light">
              Process private payroll transactions with enhanced privacy
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-shield-border hover:bg-white transition-all flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Options</span>
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-shield-border hover:bg-white transition-all flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>Payroll History</span>
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105">
              <ArrowRight className="w-4 h-4" />
              <span>Transact</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-shield-background p-1">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'single'
                    ? 'bg-white shadow-sm text-shield-primary'
                    : 'text-shield-text-light hover:text-shield-text'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Single Payment</span>
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'batch'
                    ? 'bg-white shadow-sm text-shield-primary'
                    : 'text-shield-text-light hover:text-shield-text'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Batch Payment</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-shield-border">
              {activeTab === 'single' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-shield-text-light mb-1">
                        Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-shield-border focus:ring-2 focus:ring-shield-primary focus:border-transparent transition-all"
                          placeholder="Enter amount"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-shield-text-light">
                          TST
                        </div>
                      </div>
                    </div>
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
                        <span>Process Payment</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-shield-border rounded-lg p-8 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-12 flex flex-col items-center justify-center space-y-4 text-shield-text-light hover:text-shield-text transition-colors"
                    >
                      <Upload className="w-12 h-12" />
                      <div>
                        <p className="font-medium">Click to upload CSV file</p>
                        <p className="text-sm">or drag and drop</p>
                      </div>
                    </button>
                  </div>
                  {csvData.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-shield-text">Preview ({csvData.length} entries)</h3>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {csvData.slice(0, 5).map((row, index) => (
                          <div key={index} className="p-3 bg-gradient-to-br from-shield-background to-shield-background-light rounded-lg">
                            <p className="text-sm text-shield-text-light">Address: {row.address}</p>
                            <p className="text-sm text-shield-text-light">Amount: {row.amount} TST</p>
                          </div>
                        ))}
                        {csvData.length > 5 && (
                          <p className="text-sm text-shield-text-light text-center">+ {csvData.length - 5} more entries</p>
                        )}
                      </div>
                      <button
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
                            <span>Process Batch Payment</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Info */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-shield-border">
                <h2 className="text-2xl font-semibold mb-6 text-shield-text">Payment Information</h2>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-shield-background to-shield-background-light rounded-xl">
                    <p className="text-sm text-shield-text-light mb-1">Payment Type</p>
                    <p className="text-2xl font-bold text-shield-primary">
                      {activeTab === 'single' ? 'Single Payment' : 'Batch Payment'}
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

              {/* Recent Payments */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-shield-border">
                <h2 className="text-2xl font-semibold mb-6 text-shield-text">Recent Payments</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-shield-background to-shield-background-light rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm text-shield-text-light">Single Payment</p>
                      <p className="text-lg font-semibold text-shield-text">100 TST</p>
                    </div>
                    <div className="text-sm text-shield-text-light">2h ago</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-shield-background to-shield-background-light rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm text-shield-text-light">Batch Payment</p>
                      <p className="text-lg font-semibold text-shield-text">500 TST</p>
                    </div>
                    <div className="text-sm text-shield-text-light">5h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivatePayroll; 