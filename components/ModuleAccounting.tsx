import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, FileText, 
  Plus, X, Trash2, Download, Calendar, Building, Globe, CheckCircle,
  ArrowUpRight, ArrowDownRight, Wallet, Filter, Search, AlertTriangle
} from 'lucide-react';
import { FinancialMetric, Transaction } from '../types';
import SmartAssistant from './SmartAssistant';

// --- Helper: Currency Formatter (IDR) ---
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// --- Mock Data: Aligned with System Settings & Other Modules ---

// Monthly Financial Trend (in Billions IDR) - Fiscal Year 2024
const trendData = [
  { month: 'Jan', revenue: 4500000000, expenses: 2100000000 },
  { month: 'Feb', revenue: 3800000000, expenses: 1900000000 },
  { month: 'Mar', revenue: 3200000000, expenses: 2200000000 },
  { month: 'Apr', revenue: 5100000000, expenses: 2800000000 }, // Tuition Fee Influx
  { month: 'May', revenue: 2900000000, expenses: 2100000000 },
  { month: 'Jun', revenue: 3100000000, expenses: 2400000000 },
  { month: 'Jul', revenue: 6500000000, expenses: 3100000000 }, // New Academic Year
  { month: 'Aug', revenue: 5800000000, expenses: 2900000000 },
  { month: 'Sep', revenue: 4200000000, expenses: 2500000000 },
  { month: 'Oct', revenue: 3900000000, expenses: 2800000000 },
];

// Transactions linked to Procurement (PO) and Payroll modules
const initialTransactions: Transaction[] = [
  { id: 'JE-2023-10-001', date: '2023-10-26', description: 'Tuition Payment Bulk - Batch A', amount: 1250000000, type: 'Credit', category: '4001 - Tuition Revenue', status: 'Posted' },
  { id: 'JE-2023-10-002', date: '2023-10-25', description: 'Vendor Payment: Tech Solutions Inc (PO-2023-001)', amount: 375000000, type: 'Debit', category: '2001 - Accounts Payable', status: 'Posted' },
  { id: 'JE-2023-10-24', date: '2023-10-24', description: 'Payroll Run: Oct 2023 (142 Employees)', amount: 2850000000, type: 'Debit', category: '5001 - Salary Expense', status: 'Pending' },
  { id: 'JE-2023-10-20', date: '2023-10-20', description: 'Research Grant: Govt Ministry', amount: 750000000, type: 'Credit', category: '4100 - Grant Income', status: 'Posted' },
  { id: 'JE-2023-10-18', date: '2023-10-18', description: 'Utility Payment: PLN & Internet', amount: 45000000, type: 'Debit', category: '5200 - Utilities', status: 'Posted' },
];

// Configuration from Settings Module
const chartOfAccounts = [
  { code: '1001', name: 'Kas Kecil / Petty Cash' },
  { code: '1002', name: 'Bank BCA - Operasional' },
  { code: '1003', name: 'Bank Mandiri - Yayasan' },
  { code: '2001', name: 'Hutang Usaha / Accounts Payable' },
  { code: '2100', name: 'Hutang PPh 21' },
  { code: '2101', name: 'Hutang PPN' },
  { code: '4001', name: 'Pendapatan SPP / Tuition' },
  { code: '4100', name: 'Pendapatan Hibah / Grants' },
  { code: '5001', name: 'Beban Gaji / Salaries' },
  { code: '5005', name: 'Beban Perlengkapan Lab' },
  { code: '5200', name: 'Beban Listrik & Air' },
];

const costCenters = [
  'CC-000 - General / Umum',
  'CC-100 - Fak. Teknik',
  'CC-200 - Fak. Kedokteran',
  'CC-300 - Admin & HR',
  'CC-400 - Yayasan',
];

const taxRules = [
  { code: 'PPN', rate: 0.11, name: 'PPN 11%' },
  { code: 'PPH23', rate: 0.02, name: 'PPh 23 (Jasa)' },
  { code: 'PPH21', rate: 0.05, name: 'PPh 21 (Tenaga Ahli)' },
  { code: 'NON', rate: 0, name: 'Non-Taxable' },
];

const reportCategories = [
  { id: 'fins', title: 'Laporan Keuangan', desc: 'Neraca, Laba Rugi, Arus Kas', icon: FileText },
  { id: 'gl', title: 'Buku Besar (GL)', desc: 'Detail transaksi per akun', icon: Calendar },
  { id: 'ap_ar', title: 'Hutang & Piutang', desc: 'Aging schedule, Invoice status', icon: DollarSign },
  { id: 'tax', title: 'Pajak & Kepatuhan', desc: 'SPT Masa PPN, Bukti Potong', icon: CheckCircle },
  { id: 'budget', title: 'Realisasi Anggaran', desc: 'Budget vs Actual per Prodi', icon: TrendingUp },
  { id: 'asset', title: 'Aset Tetap', desc: 'Penyusutan & Inventaris', icon: Building },
];

const ModuleAccounting = () => {
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  
  // Journal Entry State
  const [journalDate, setJournalDate] = useState(new Date().toISOString().split('T')[0]);
  const [journalRef, setJournalRef] = useState('');
  const [journalLines, setJournalLines] = useState([
    { id: 1, account: '', description: '', costCenter: '', taxCode: '', debit: 0, credit: 0 },
    { id: 2, account: '', description: '', costCenter: '', taxCode: '', debit: 0, credit: 0 },
  ]);

  // Derived Statistics
  const totalRevenue = useMemo(() => trendData.reduce((acc, curr) => acc + curr.revenue, 0), []);
  const totalExpenses = useMemo(() => trendData.reduce((acc, curr) => acc + curr.expenses, 0), []);
  const netIncome = totalRevenue - totalExpenses;
  const pendingInvoices = transactions.filter(t => t.status === 'Pending').length;

  const contextString = `
    Module: Accounting & Finance.
    Currency: IDR.
    Fiscal Year: 2024.
    Total Revenue YTD: ${formatIDR(totalRevenue)}.
    Net Income YTD: ${formatIDR(netIncome)}.
    Recent Transactions: ${transactions.length} records.
    Tax Rules: PPN 11%, PPh 23 2%.
  `;

  // --- Journal Logic ---

  const updateLine = (id: number, field: string, value: any) => {
    setJournalLines(prev => prev.map(line => {
      if (line.id !== id) return line;

      let updates: any = { [field]: value };
      
      // Auto-calculate Tax Logic
      if (field === 'taxCode' && value !== '') {
        const taxRule = taxRules.find(r => r.code === value);
        if (taxRule && line.debit > 0) {
           // If user selects tax on a debit line, maybe suggest a tax line? 
           // For simplicity, we just store the code. Real ERPs might add a new row.
        }
      }

      return { ...line, ...updates };
    }));
  };

  const addLine = () => {
    const newId = journalLines.length > 0 ? Math.max(...journalLines.map(l => l.id)) + 1 : 1;
    setJournalLines([...journalLines, { id: newId, account: '', description: '', costCenter: '', taxCode: '', debit: 0, credit: 0 }]);
  };

  const removeLine = (id: number) => {
    setJournalLines(prev => prev.filter(line => line.id !== id));
  };

  const totalDebit = journalLines.reduce((sum, line) => sum + Number(line.debit), 0);
  const totalCredit = journalLines.reduce((sum, line) => sum + Number(line.credit), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 1; // Tolerance for floating point

  const handlePostJournal = () => {
    if (!isBalanced) return;
    const newTrx: Transaction = {
      id: journalRef || `JE-${new Date().getTime()}`,
      date: journalDate,
      description: journalLines[0].description || 'Manual Journal Entry',
      amount: totalDebit,
      type: 'Debit', // Simplified
      category: 'Manual Adjustment',
      status: 'Posted'
    };
    setTransactions([newTrx, ...transactions]);
    setShowJournalModal(false);
    // Reset form
    setJournalLines([{ id: 1, account: '', description: '', costCenter: '', taxCode: '', debit: 0, credit: 0 }, { id: 2, account: '', description: '', costCenter: '', taxCode: '', debit: 0, credit: 0 }]);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Accounting & Finance</h2>
           <p className="text-sm text-slate-500">Manage GL, Cashflow, Taxes, and Reporting.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowReportModal(true)}
             className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-700"
           >
             <Download size={16} /> Reports
           </button>
           <button 
             onClick={() => setShowJournalModal(true)}
             className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm shadow-indigo-200"
           >
             <Plus size={16} /> New Journal Entry
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={48} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Revenue (YTD)</p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{formatIDR(totalRevenue)}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-4 bg-emerald-50 w-fit px-2 py-1 rounded">
            <ArrowUpRight size={14} /> +12% vs last year
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={48} className="text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Expenses (YTD)</p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{formatIDR(totalExpenses)}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-4 bg-rose-50 w-fit px-2 py-1 rounded">
             <ArrowUpRight size={14} /> +5% vs budget
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={48} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Net Income</p>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-700 mt-1">{formatIDR(netIncome)}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-4 bg-emerald-50 w-fit px-2 py-1 rounded">
             Healthy Margin
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText size={48} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Postings</p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{pendingInvoices}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-4 bg-amber-50 w-fit px-2 py-1 rounded">
             Needs Approval
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-semibold text-slate-800">Revenue vs Expenses (Real-time)</h3>
             <select className="text-sm border-slate-200 border rounded-lg px-2 py-1 bg-slate-50">
                <option>Fiscal Year 2024</option>
                <option>Fiscal Year 2023</option>
             </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fontSize: 12, fill: '#64748b'}} 
                   tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}M`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  formatter={(value: number) => formatIDR(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" name="Expenses" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown / Mini Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Breakdown</h3>
          <div className="space-y-6">
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-600">Tuition Fees</span>
                   <span className="font-semibold text-slate-900">65%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-indigo-600 h-2 rounded-full w-[65%]"></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-600">Salaries (Payroll)</span>
                   <span className="font-semibold text-slate-900">45%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-rose-500 h-2 rounded-full w-[45%]"></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-600">Research Grants</span>
                   <span className="font-semibold text-slate-900">15%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-emerald-500 h-2 rounded-full w-[15%]"></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-600">Infrastructure</span>
                   <span className="font-semibold text-slate-900">20%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-amber-500 h-2 rounded-full w-[20%]"></div>
                </div>
             </div>
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
             <h4 className="text-sm font-bold text-indigo-900 mb-1">System Insight</h4>
             <p className="text-xs text-indigo-700">
               Based on <b>Payroll</b> data, salary expenses will increase by 5% next month due to new hires in the Medical Faculty.
             </p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Recent General Ledger Entries</h3>
          <div className="flex gap-2">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input type="text" placeholder="Search entries..." className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
             </div>
             <button className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600"><Filter size={18} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Ref ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description / Account</th>
                <th className="px-4 py-3 text-right">Amount (IDR)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{trx.id}</td>
                  <td className="px-4 py-3 text-slate-600">{trx.date}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-900 font-medium">{trx.description}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="bg-slate-100 px-1.5 rounded">{trx.category}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${trx.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {trx.type === 'Credit' ? '+' : '-'}{formatIDR(trx.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trx.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: NEW JOURNAL ENTRY */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">New Journal Entry</h3>
                  <p className="text-xs text-slate-500">Record transaction in General Ledger</p>
                </div>
              </div>
              <button onClick={() => setShowJournalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* General Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Entry Date (Fiscal Year 2024)</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" 
                    value={journalDate}
                    onChange={(e) => setJournalDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Reference # (Auto)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-100 text-slate-500" 
                    placeholder="JE-2024-XXXX" 
                    disabled
                  />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1"><Globe size={12}/> Currency</label>
                   <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                      <option value="IDR">IDR - Indonesian Rupiah</option>
                      <option value="USD">USD - US Dollar</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1"><Building size={12}/> Entity Scope</label>
                   <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500">
                      <option>UniCore University Ltd.</option>
                      <option>UniCore Foundation</option>
                   </select>
                </div>
              </div>

              {/* Journal Lines */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-100 px-4 py-2 border-b grid grid-cols-12 gap-2 text-xs font-semibold text-slate-600">
                  <div className="col-span-3">GL Account (CoA)</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2">Cost Center</div>
                  <div className="col-span-1">Tax Code</div>
                  <div className="col-span-1 text-right">Debit (Rp)</div>
                  <div className="col-span-1 text-right">Credit (Rp)</div>
                  <div className="col-span-1 text-center"></div>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto bg-white">
                  {journalLines.map((line) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 px-4 py-2 items-start hover:bg-slate-50 transition-colors">
                      <div className="col-span-3">
                        <select 
                          className="w-full text-sm border-slate-200 border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500"
                          value={line.account}
                          onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                        >
                          <option value="">Select Account...</option>
                          {chartOfAccounts.map(acc => <option key={acc.code} value={acc.code}>{acc.code} - {acc.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input 
                          type="text" 
                          className="w-full text-sm border-slate-200 border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Line description"
                          value={line.description}
                          onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <select 
                          className="w-full text-sm border-slate-200 border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500"
                          value={line.costCenter}
                          onChange={(e) => updateLine(line.id, 'costCenter', e.target.value)}
                        >
                          <option value="">None</option>
                          {costCenters.map(cc => <option key={cc} value={cc}>{cc}</option>)}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <select 
                          className="w-full text-sm border-slate-200 border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500"
                          value={line.taxCode}
                          onChange={(e) => updateLine(line.id, 'taxCode', e.target.value)}
                        >
                           <option value="">-</option>
                           {taxRules.map(tax => <option key={tax.code} value={tax.code}>{tax.code}</option>)}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <input 
                          type="number" 
                          className="w-full text-sm border-slate-200 border rounded px-2 py-1.5 text-right focus:ring-1 focus:ring-indigo-500"
                          value={line.debit}
                          onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                          onFocus={(e) => e.target.select()}
                        />
                      </div>
                      <div className="col-span-1">
                        <input 
                          type="number" 
                          className="w-full text-sm border-slate-200 border rounded px-2 py-1.5 text-right focus:ring-1 focus:ring-indigo-500"
                          value={line.credit}
                          onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                          onFocus={(e) => e.target.select()}
                        />
                      </div>
                      <div className="col-span-1 text-center flex justify-center">
                        <button 
                          onClick={() => removeLine(line.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  <button onClick={addLine} className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 px-2">
                    <Plus size={16} /> Add Debit/Credit Line
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end gap-8 text-sm pt-2 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                <div className="text-right">
                  <p className="text-slate-500 mb-1">Total Debit</p>
                  <p className="font-bold text-lg text-slate-800">{formatIDR(totalDebit)}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 mb-1">Total Credit</p>
                  <p className="font-bold text-lg text-slate-800">{formatIDR(totalCredit)}</p>
                </div>
                <div className="text-right relative">
                  <p className="text-slate-500 mb-1">Difference</p>
                  <p className={`font-bold text-lg ${isBalanced ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatIDR(Math.abs(totalDebit - totalCredit))}
                  </p>
                  {!isBalanced && (
                    <span className="absolute -right-2 top-0 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center">
              <div className={`flex items-center gap-2 text-sm font-medium ${isBalanced ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isBalanced ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                {isBalanced ? 'Entry Balanced. Ready to Post.' : 'Journal Entry is not balanced.'}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowJournalModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-white text-slate-700 transition-colors">Cancel</button>
                <button 
                  onClick={handlePostJournal}
                  disabled={!isBalanced || totalDebit === 0}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                >
                  Post to Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DOWNLOAD REPORT */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col animate-in fade-in zoom-in duration-200">
             <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
               <h3 className="text-lg font-bold text-slate-800">Export Accounting Reports</h3>
               <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={24} />
               </button>
             </div>
             
             <div className="p-6">
                 <div className="grid grid-cols-2 gap-3 mb-6">
                    {reportCategories.map(cat => (
                      <button
                        key={cat.id}
                        className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                      >
                         <div className="flex items-center gap-2 mb-1 text-slate-700 group-hover:text-indigo-700 font-semibold">
                           <cat.icon size={16} /> {cat.title}
                         </div>
                         <div className="text-xs text-slate-500">{cat.desc}</div>
                      </button>
                    ))}
                 </div>

                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Period</label>
                      <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                          <option>This Month (Oct 2023)</option>
                          <option>Last Quarter (Q3 2023)</option>
                          <option>Year to Date (YTD)</option>
                          <option>Fiscal Year 2024 (Projected)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Format</label>
                      <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                          <option>PDF (Print Ready)</option>
                          <option>Excel (.xlsx)</option>
                          <option>CSV (Raw Data)</option>
                      </select>
                    </div>
                 </div>
             </div>

             <div className="px-6 py-4 border-t border-slate-200 rounded-b-xl flex justify-end gap-2 bg-slate-50">
                <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm">Close</button>
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Download size={16} /> Download
                </button>
             </div>
          </div>
        </div>
      )}

      <SmartAssistant contextData={contextString} />
    </div>
  );
};

export default ModuleAccounting;