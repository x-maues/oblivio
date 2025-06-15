import { useState } from 'react';
import Layout from '../components/Layout';
import { Shield, Users, Plus, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  address: string;
  salary: string;
}

const PrivatePayroll = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const addEmployee = () => {
    if (newAddress && newSalary) {
      setEmployees([
        ...employees,
        {
          id: Math.random().toString(36).substr(2, 9),
          address: newAddress,
          salary: newSalary,
        },
      ]);
      setNewAddress('');
      setNewSalary('');
    }
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const processPayroll = async () => {
    setIsProcessing(true);
    // Simulate payroll processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 border border-shield-border shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-6 h-6 text-shield-primary" />
            <h1 className="text-2xl font-bold text-shield-text">Private Payroll</h1>
          </div>

          {/* Add Employee Form */}
          <div className="mb-8 p-4 border border-shield-border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add Employee</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="px-4 py-2 border border-shield-border rounded-lg focus:ring-2 focus:ring-shield-primary focus:border-transparent"
                placeholder="Employee Address"
              />
              <input
                type="number"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="px-4 py-2 border border-shield-border rounded-lg focus:ring-2 focus:ring-shield-primary focus:border-transparent"
                placeholder="Monthly Salary"
              />
            </div>
            <button
              onClick={addEmployee}
              className="mt-4 flex items-center space-x-2 bg-shield-primary text-white px-4 py-2 rounded-lg hover:bg-shield-primary-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Employee List */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Employee List</h2>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 border border-shield-border rounded-lg"
                >
                  <div>
                    <p className="font-mono text-sm text-shield-text-light">{employee.address}</p>
                    <p className="text-shield-text">{employee.salary} DOT/month</p>
                  </div>
                  <button
                    onClick={() => removeEmployee(employee.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Process Payroll Button */}
          <button
            onClick={processPayroll}
            disabled={isProcessing || employees.length === 0}
            className="w-full flex items-center justify-center space-x-2 bg-shield-primary text-white px-6 py-3 rounded-lg hover:bg-shield-primary-dark transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payroll...</span>
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                <span>Process Private Payroll</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PrivatePayroll; 