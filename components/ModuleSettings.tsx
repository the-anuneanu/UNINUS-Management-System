import React, { useState } from 'react';
import { 
  Building, 
  Globe, 
  Calculator, 
  Calendar, 
  FileText, 
  Truck, 
  Mail, 
  Database, 
  Save, 
  ToggleLeft, 
  ToggleRight,
  CreditCard,
  Wifi,
  Briefcase,
  UploadCloud,
  DownloadCloud,
  HardDrive,
  RefreshCw,
  Table,
  Type,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import SmartAssistant from './SmartAssistant';

type SettingsSection = 'general' | 'finance' | 'documents' | 'hr' | 'operations' | 'communication' | 'data' | 'integrations';
type DataTab = 'backup' | 'migration' | 'customization' | 'reset';

const ModuleSettings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [activeDataTab, setActiveDataTab] = useState<DataTab>('backup');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Mock state for Custom Fields
  const [customFields, setCustomFields] = useState([
    { id: 1, module: 'Assets', name: 'Serial Number', type: 'Text', mandatory: true },
    { id: 2, module: 'Student', name: 'Guardian Phone', type: 'Phone', mandatory: false },
    { id: 3, module: 'Employee', name: 'Uniform Size', type: 'Select', mandatory: false },
  ]);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const navItems = [
    { id: 'general', label: 'General & Company', icon: Building, desc: 'Profile, Localization, Whitelabeling' },
    { id: 'finance', label: 'Accounting & Tax', icon: Calculator, desc: 'Fiscal Year, CoA, Tax Rules' },
    { id: 'documents', label: 'Naming Series', icon: FileText, desc: 'Document Numbering, Prefixes' },
    { id: 'hr', label: 'HR & Payroll', icon: Briefcase, desc: 'Holidays, Salary Components' },
    { id: 'operations', label: 'Procurement & Stock', icon: Truck, desc: 'UoM, Valuation Methods' },
    { id: 'communication', label: 'Email & Notif.', icon: Mail, desc: 'SMTP, Print Formats' },
    { id: 'data', label: 'Data Management', icon: Database, desc: 'Custom Fields, Backup' },
    { id: 'integrations', label: 'Integrations', icon: Wifi, desc: 'Payment Gateway, Devices' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Building size={18} className="text-indigo-600"/> Company Profile
                </h3>
                <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-medium text-slate-600 mb-1">Company Name (Legal)</label>
                     <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" defaultValue="UniCore University Ltd." />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-600 mb-1">Tax ID / NPWP</label>
                     <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" defaultValue="99.999.999.9-999.000" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-600 mb-1">Registered Address</label>
                     <textarea className="w-full px-3 py-2 border rounded-lg text-sm h-20" defaultValue="Jalan Edukasi No. 1, Jakarta Selatan, 12345" />
                   </div>
                   <div className="flex items-center gap-2">
                     <button className="text-xs bg-slate-100 px-3 py-2 rounded-lg text-slate-600 font-medium">Upload Logo</button>
                     <span className="text-xs text-slate-400">Recommended: 200x50px PNG</span>
                   </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-indigo-600"/> Localization & Domain
                </h3>
                <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-medium text-slate-600 mb-1">System Domain</label>
                     <div className="flex">
                       <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">https://</span>
                       <input type="text" className="flex-1 px-3 py-2 border rounded-r-lg text-sm" defaultValue="erp.unicore.edu" />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Timezone</label>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                           <option>Asia/Jakarta (GMT+7)</option>
                           <option>Asia/Makassar (GMT+8)</option>
                           <option>Asia/Jayapura (GMT+9)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Date Format</label>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                           <option>DD/MM/YYYY</option>
                           <option>MM/DD/YYYY</option>
                           <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'finance':
        return (
           <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calendar size={18} className="text-emerald-600"/> Fiscal Year & Locking
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Period Locked</span>
                    <ToggleRight size={24} className="text-emerald-600 cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-xs font-medium text-slate-600 mb-1">Fiscal Year Name</label>
                     <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" defaultValue="FY-2024" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                     <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" defaultValue="2024-01-01" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                     <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" defaultValue="2024-12-31" />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4">Multi-Currency</h3>
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Base Currency</label>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                           <option>IDR - Indonesian Rupiah</option>
                           <option>USD - US Dollar</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                         <div>
                           <p className="text-sm font-semibold text-slate-700">Auto-Fetch Exchange Rates</p>
                           <p className="text-xs text-slate-500">Updates daily via OpenExchange API</p>
                         </div>
                         <ToggleRight size={24} className="text-emerald-600 cursor-pointer" />
                      </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4">Tax Rules Engine</h3>
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500">
                       <tr>
                         <th className="px-3 py-2">Tax Name</th>
                         <th className="px-3 py-2">Rate (%)</th>
                         <th className="px-3 py-2">Type</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-3 py-2">PPN (VAT)</td>
                          <td className="px-3 py-2">11%</td>
                          <td className="px-3 py-2">Sales/Purchase</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2">PPh 23</td>
                          <td className="px-3 py-2">2%</td>
                          <td className="px-3 py-2">Withholding</td>
                        </tr>
                     </tbody>
                   </table>
                   <button className="mt-4 text-xs text-indigo-600 font-medium">+ Add Tax Rule</button>
                </div>
             </div>
           </div>
        );

      case 'documents':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <FileText size={18} className="text-indigo-600"/> Document Naming Series
                </h3>
                <p className="text-sm text-slate-500 mb-6">Configure how the system generates automatic IDs for transactions and records.</p>
                
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Document Type</th>
                      <th className="px-4 py-3">Prefix</th>
                      <th className="px-4 py-3">Separator</th>
                      <th className="px-4 py-3">Digits</th>
                      <th className="px-4 py-3">Current Value</th>
                      <th className="px-4 py-3 rounded-r-lg">Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {[
                       { name: 'Purchase Order', prefix: 'PO', sep: '/', digits: 4, curr: 1024, preview: 'PO/2023/1024' },
                       { name: 'Sales Invoice', prefix: 'INV', sep: '-', digits: 5, curr: 45, preview: 'INV-2023-00045' },
                       { name: 'Journal Entry', prefix: 'JE', sep: '-', digits: 6, curr: 890, preview: 'JE-2023-000890' },
                       { name: 'Employee', prefix: 'EMP', sep: '', digits: 3, curr: 142, preview: 'EMP142' },
                     ].map((doc, idx) => (
                       <tr key={idx}>
                         <td className="px-4 py-3 font-medium text-slate-700">{doc.name}</td>
                         <td className="px-4 py-3"><input className="w-16 border rounded px-1" defaultValue={doc.prefix}/></td>
                         <td className="px-4 py-3"><input className="w-10 border rounded px-1" defaultValue={doc.sep}/></td>
                         <td className="px-4 py-3"><input type="number" className="w-12 border rounded px-1" defaultValue={doc.digits}/></td>
                         <td className="px-4 py-3 text-slate-500">{doc.curr}</td>
                         <td className="px-4 py-3 font-mono text-slate-600 bg-slate-50 rounded">{doc.preview}</td>
                       </tr>
                     ))}
                  </tbody>
                </table>
             </div>
          </div>
        );
      
      case 'hr':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Payroll & Tax Slabs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Income Tax Slabs (PPh 21 - 2024 Update)</h4>
                      <table className="w-full text-sm border rounded-lg overflow-hidden">
                        <thead className="bg-slate-100 text-slate-600">
                          <tr>
                            <th className="px-3 py-2 text-left">Annual Income Range</th>
                            <th className="px-3 py-2 text-right">Tax Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           <tr><td className="px-3 py-2">0 - 60,000,000</td><td className="px-3 py-2 text-right">5%</td></tr>
                           <tr><td className="px-3 py-2">60,000,001 - 250,000,000</td><td className="px-3 py-2 text-right">15%</td></tr>
                           <tr><td className="px-3 py-2">250,000,001 - 500,000,000</td><td className="px-3 py-2 text-right">25%</td></tr>
                           <tr><td className="px-3 py-2">500,000,001 - 5,000,000,000</td><td className="px-3 py-2 text-right">30%</td></tr>
                           <tr><td className="px-3 py-2">&gt; 5,000,000,000</td><td className="px-3 py-2 text-right">35%</td></tr>
                        </tbody>
                      </table>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Global Components</h4>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">PTKP (Non-Taxable Income) - TK/0</label>
                        <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" defaultValue="54000000" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">BPJS Kesehatan Limit</label>
                        <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" defaultValue="12000000" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Data Sub-navigation */}
            <div className="flex gap-4 border-b border-slate-200 pb-2">
              <button 
                onClick={() => setActiveDataTab('backup')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeDataTab === 'backup' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <HardDrive size={16} /> Backup & Restore
              </button>
              <button 
                onClick={() => setActiveDataTab('migration')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeDataTab === 'migration' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <RefreshCw size={16} /> Import / Export
              </button>
              <button 
                onClick={() => setActiveDataTab('customization')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeDataTab === 'customization' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Table size={16} /> Custom Fields
              </button>
              <button 
                onClick={() => setActiveDataTab('reset')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeDataTab === 'reset' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:text-red-600'}`}
              >
                <AlertTriangle size={16} /> System Reset
              </button>
            </div>

            {/* BACKUP CONTENT */}
            {activeDataTab === 'backup' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-indigo-600"/> Automated Schedule
                  </h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm font-medium text-slate-700">Daily Backup</p>
                         <p className="text-xs text-slate-500">Run every night at 00:00</p>
                       </div>
                       <ToggleRight size={24} className="text-emerald-600 cursor-pointer" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Retention Policy</label>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                           <option>Keep last 7 days</option>
                           <option>Keep last 30 days</option>
                           <option>Keep last 365 days</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Storage Location</label>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                           <option>Local Server (/var/backups)</option>
                           <option>AWS S3 Bucket (cloud-erp-backup)</option>
                           <option>Google Drive</option>
                        </select>
                     </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <HardDrive size={18} className="text-indigo-600"/> Manual Operations
                   </h3>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-medium text-slate-700">Last Successful Backup</span>
                         <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">Oct 26, 00:00</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                         <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                      </div>
                      <p className="text-xs text-slate-500">Size: 450 MB</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex justify-center items-center gap-2">
                         <UploadCloud size={16} /> Backup Now
                      </button>
                      <button className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex justify-center items-center gap-2">
                         <DownloadCloud size={16} /> Restore
                      </button>
                   </div>
                </div>
              </div>
            )}

            {/* MIGRATION CONTENT (Import/Export) */}
            {activeDataTab === 'migration' && (
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">Bulk Data Import/Export</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Use this tool to migrate data from legacy systems. 
                    1. Select entity type. 
                    2. Download the template. 
                    3. Upload the filled CSV/Excel file.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="col-span-1 border-r border-slate-100 pr-6">
                        <label className="block text-xs font-medium text-slate-600 mb-2">Select Entity (DocType)</label>
                        <div className="space-y-1">
                           {['Students', 'Employees', 'Assets', 'Chart of Accounts', 'Items/Product'].map(item => (
                             <button key={item} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors">
                               {item}
                             </button>
                           ))}
                        </div>
                     </div>
                     
                     <div className="col-span-2 space-y-6">
                        <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center h-48 group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                           <UploadCloud size={32} className="text-slate-400 group-hover:text-indigo-500 mb-2" />
                           <p className="text-sm font-medium text-slate-600 group-hover:text-indigo-700">Drag and drop CSV/XLSX file here</p>
                           <p className="text-xs text-slate-400 mt-1">or click to browse</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                           <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                             <FileText size={16} /> Download CSV Template
                           </button>
                           <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                             Start Import
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* CUSTOMIZATION CONTENT */}
            {activeDataTab === 'customization' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <h3 className="font-bold text-slate-800">Custom Field Manager</h3>
                      <p className="text-sm text-slate-500">Extend database schemas without coding.</p>
                   </div>
                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                      <Table size={16} /> Add New Field
                   </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500">
                       <tr>
                         <th className="px-6 py-3 font-medium">Module / Form</th>
                         <th className="px-6 py-3 font-medium">Field Label</th>
                         <th className="px-6 py-3 font-medium">Data Type</th>
                         <th className="px-6 py-3 font-medium">Mandatory</th>
                         <th className="px-6 py-3 font-medium text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {customFields.map(field => (
                          <tr key={field.id} className="hover:bg-slate-50">
                             <td className="px-6 py-3 font-medium text-slate-900">{field.module}</td>
                             <td className="px-6 py-3 text-slate-600">{field.name}</td>
                             <td className="px-6 py-3">
                               <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-xs font-mono text-slate-600">
                                 <Type size={10} /> {field.type}
                               </span>
                             </td>
                             <td className="px-6 py-3">
                                {field.mandatory ? (
                                  <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded">Yes</span>
                                ) : (
                                  <span className="text-slate-400 text-xs">No</span>
                                )}
                             </td>
                             <td className="px-6 py-3 text-right">
                                <button className="text-slate-400 hover:text-red-600">
                                   <Trash2 size={16} />
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
              </div>
            )}

            {/* RESET CONTENT */}
            {activeDataTab === 'reset' && (
               <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm bg-red-50/50">
                  <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20}/> Danger Zone
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    These actions are destructive and cannot be undone. Please proceed with caution.
                  </p>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm">
                        <div>
                           <h4 className="font-bold text-slate-800 text-sm">Purge Transaction Data</h4>
                           <p className="text-xs text-slate-500">Deletes all Journals, Invoices, POs, but keeps Master Data (Accounts, Items).</p>
                        </div>
                        <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">
                           Purge Transactions
                        </button>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm">
                        <div>
                           <h4 className="font-bold text-slate-800 text-sm">Factory Reset</h4>
                           <p className="text-xs text-slate-500">Wipes ALL data including Company settings and Users.</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                           Reset Everything
                        </button>
                     </div>
                  </div>
               </div>
            )}
          </div>
        );

      case 'integrations':
        return (
           <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4">Payment Gateways</h3>
                 <div className="space-y-4">
                    <div className="border rounded-lg p-4 flex items-start justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                          <div>
                            <h4 className="text-sm font-bold">Stripe</h4>
                            <p className="text-xs text-slate-500">Credit Card Processing</p>
                          </div>
                       </div>
                       <ToggleRight size={24} className="text-emerald-600 cursor-pointer" />
                    </div>
                    <div className="border rounded-lg p-4 flex items-start justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                          <div>
                            <h4 className="text-sm font-bold">Midtrans</h4>
                            <p className="text-xs text-slate-500">Local Indonesia Payments (QRIS, VA)</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <ToggleRight size={24} className="text-emerald-600 cursor-pointer" />
                          <input type="password" placeholder="Server Key" className="px-2 py-1 border rounded text-xs w-48" value="SB-Mid-server-xxxx" readOnly/>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4">Attendance Devices</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg bg-slate-50">
                       <h4 className="text-sm font-medium mb-2">Main Lobby Fingerprint</h4>
                       <div className="grid grid-cols-2 gap-2 text-xs">
                          <input placeholder="IP Address" defaultValue="192.168.1.200" className="border rounded px-2 py-1"/>
                          <input placeholder="Port" defaultValue="4370" className="border rounded px-2 py-1"/>
                       </div>
                    </div>
                    <div className="p-3 border rounded-lg bg-slate-50 opacity-50">
                       <h4 className="text-sm font-medium mb-2">New Device</h4>
                       <button className="w-full h-8 border border-dashed border-slate-300 rounded text-slate-500 text-xs hover:bg-white">
                         + Add Device IP
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        );

      default:
        return <div className="p-10 text-center text-slate-500">Select a category to view settings</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-800">System Settings</h2>
            <p className="text-xs text-slate-500">Global configuration</p>
          </div>
          <nav className="flex flex-col p-2 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingsSection)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight hidden md:block">{item.desc}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-end mb-4">
           <button 
             onClick={handleSave}
             disabled={saveStatus !== 'idle'}
             className={`px-6 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all ${
               saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'
             }`}
           >
             <Save size={16} />
             {saveStatus === 'idle' ? 'Save Changes' : saveStatus === 'saving' ? 'Saving...' : 'Saved Successfully!'}
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
           {renderContent()}
        </div>
      </div>
      
      <SmartAssistant contextData={`Settings Module. Active Section: ${activeSection}. Data Tab: ${activeDataTab}`} />
    </div>
  );
};

export default ModuleSettings;