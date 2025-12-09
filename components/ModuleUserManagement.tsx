
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Activity, 
  Globe, 
  Key, 
  Smartphone, 
  AlertTriangle, 
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  X,
  Save,
  Ban,
  Trash2,
  RefreshCw,
  LogOut,
  Plus,
  Network,
  Briefcase,
  Landmark
} from 'lucide-react';
import SmartAssistant from './SmartAssistant';

type Tab = 'users' | 'roles' | 'security' | 'audit' | 'portals';

type EntityType = 'Yayasan' | 'Universitas' | 'Koperasi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  entity: EntityType; // Which main pillar they belong to
  department: string;
  mfaEnabled: boolean;
  lastLogin: string;
  status: 'Active' | 'Locked' | 'Inactive';
}

interface RoleNode {
  id: string;
  name: string;
  level: number; // 0=Yayasan, 1=Leaders(Rektor/Ketua Kop), 2=Management(Warek), 3=Ops
  entity: EntityType;
  description: string;
}

interface MockLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

// --- Specific Data for UNINUS Structure ---

const initialUsers: User[] = [
  // Yayasan (Red)
  { id: 'YYS-001', name: 'H. Ketua Yayasan', email: 'ketua@uninus.ac.id', role: 'Ketua Yayasan', entity: 'Yayasan', department: 'Pengurus Harian', mfaEnabled: true, lastLogin: '2023-10-26 09:00', status: 'Active' },
  { id: 'YYS-002', name: 'Bendahara Yayasan', email: 'finance@yayasan.uninus.ac.id', role: 'Pengurus Yayasan', entity: 'Yayasan', department: 'Keuangan Pusat', mfaEnabled: true, lastLogin: '2023-10-26 10:30', status: 'Active' },
  
  // Universitas (Blue)
  { id: 'UNI-001', name: 'Prof. Dr. Rektor', email: 'rektor@uninus.ac.id', role: 'Rektor', entity: 'Universitas', department: 'Rektorat', mfaEnabled: true, lastLogin: '2023-10-26 08:00', status: 'Active' },
  { id: 'UNI-002', name: 'Dr. Warek Satu', email: 'warek1@uninus.ac.id', role: 'Warek I (Akademik)', entity: 'Universitas', department: 'Akademik', mfaEnabled: false, lastLogin: '2023-10-25 14:00', status: 'Active' },
  { id: 'UNI-003', name: 'Dr. Warek Dua', email: 'warek2@uninus.ac.id', role: 'Warek II (Keuangan & SDM)', entity: 'Universitas', department: 'Keuangan', mfaEnabled: true, lastLogin: '2023-10-26 08:15', status: 'Active' },
  { id: 'UNI-004', name: 'Staff Admin Prodi', email: 'staff.fkip@uninus.ac.id', role: 'Staff Administrasi', entity: 'Universitas', department: 'FKIP', mfaEnabled: false, lastLogin: '2023-10-24 11:20', status: 'Active' },

  // Koperasi (Green)
  { id: 'KOP-001', name: 'Bpk. Ketua Koperasi', email: 'ketua@koperasi.uninus.ac.id', role: 'Ketua Koperasi', entity: 'Koperasi', department: 'Pengurus', mfaEnabled: true, lastLogin: '2023-10-26 09:45', status: 'Active' },
  { id: 'KOP-002', name: 'Manager Toko', email: 'store@koperasi.uninus.ac.id', role: 'Manajer Unit Usaha', entity: 'Koperasi', department: 'Retail', mfaEnabled: false, lastLogin: '2023-10-25 16:00', status: 'Active' },
];

const initialRoles: RoleNode[] = [
  // Level 0 - Yayasan Top
  { id: 'r1', name: 'Ketua Yayasan', level: 0, entity: 'Yayasan', description: 'Otoritas Tertinggi, Akses Penuh Lintas Entitas' },
  { id: 'r2', name: 'Dewan Pengurus', level: 0, entity: 'Yayasan', description: 'Monitoring Strategis & Keuangan' },
  
  // Level 1 - Entity Leaders
  { id: 'r3', name: 'Rektor', level: 1, entity: 'Universitas', description: 'CEO Universitas - Otoritas Akademik & Ops' },
  { id: 'r4', name: 'Ketua Koperasi', level: 1, entity: 'Koperasi', description: 'CEO Koperasi - Otonomi Usaha' },
  
  // Level 2 - Universitas Management
  { id: 'r5', name: 'Warek I (Akademik)', level: 2, entity: 'Universitas', description: 'Kurikulum, Mutu, Riset' },
  { id: 'r6', name: 'Warek II (Keuangan/SDM)', level: 2, entity: 'Universitas', description: 'Asset, Payroll, Finance' },
  { id: 'r7', name: 'Warek III (Kemahasiswaan)', level: 2, entity: 'Universitas', description: 'Alumni & Organisasi Mhs' },
  { id: 'r8', name: 'Warek IV (Kerjasama)', level: 2, entity: 'Universitas', description: 'Bisnis & Humas' },
  
  // Level 2 - Koperasi Management
  { id: 'r9', name: 'Manajer Simpan Pinjam', level: 2, entity: 'Koperasi', description: 'Pengelola Dana Anggota' },
  { id: 'r10', name: 'Manajer Unit Bisnis', level: 2, entity: 'Koperasi', description: 'Kantin, Toko, Fotocopy' },

  // Level 3 - Operational
  { id: 'r11', name: 'Dekan / Ka. Biro', level: 3, entity: 'Universitas', description: 'Pimpinan Unit/Fakultas' },
  { id: 'r12', name: 'Staff / Admin', level: 4, entity: 'Universitas', description: 'Pelaksana Harian' },
  { id: 'r13', name: 'Kasir / Staff Toko', level: 3, entity: 'Koperasi', description: 'Pelaksana Unit Usaha' },
];

const mockLogs: MockLog[] = [
  { id: 'LOG-992', timestamp: '2023-10-26 10:15:22', user: 'Dr. Warek Dua', action: 'Approve Budget', module: 'Finance', details: 'Approved RAPB FKIP 2024', severity: 'medium' },
  { id: 'LOG-991', timestamp: '2023-10-26 09:45:10', user: 'Manager Toko', action: 'Update Inventory', module: 'Koperasi Retail', details: 'Stock Opname ATK', severity: 'low' },
  { id: 'LOG-990', timestamp: '2023-10-26 09:00:01', user: 'H. Ketua Yayasan', action: 'View Report', module: 'Dashboard', details: 'Consolidated Financial Review', severity: 'low' },
  { id: 'LOG-989', timestamp: '2023-10-25 18:30:00', user: 'System', action: 'Auto-Backup', module: 'Data', details: 'Daily backup successful', severity: 'low' },
];

const ModuleUserManagement = () => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles, setRoles] = useState<RoleNode[]>(initialRoles);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    entity: 'Universitas',
    role: 'Staff / Admin',
    department: ''
  });

  // New Role Form State
  const [newRole, setNewRole] = useState({
    name: '',
    level: 2,
    entity: 'Universitas',
    description: ''
  });

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'Yayasan': return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'Universitas': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'Koperasi': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getEntityBadge = (entity: string) => {
    switch (entity) {
      case 'Yayasan': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200">Yayasan</span>;
      case 'Universitas': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 border border-blue-200">Universitas</span>;
      case 'Koperasi': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">Koperasi</span>;
      default: return null;
    }
  };

  const contextString = `
    Module: User Management & Organization Structure.
    Entities: Yayasan (Foundation), Universitas (Academic), Koperasi (Co-op).
    Total Users: ${users.length}.
    Roles defined: ${roles.length}.
    Structure: Yayasan oversees both Universitas and Koperasi.
  `;

  // --- Handlers ---

  const handleInviteUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const user: User = {
      id: `USR-${Math.floor(Math.random() * 1000)}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      entity: newUser.entity as EntityType,
      department: newUser.department || 'General',
      mfaEnabled: false,
      lastLogin: 'Never',
      status: 'Active',
    };

    setUsers([...users, user]);
    setShowInviteModal(false);
    setNewUser({ name: '', email: '', entity: 'Universitas', role: 'Staff', department: '' });
  };

  const handleAddRole = () => {
    if (!newRole.name) return;
    const roleNode: RoleNode = {
      id: `r-${Date.now()}`,
      name: newRole.name,
      level: Number(newRole.level),
      entity: newRole.entity as EntityType,
      description: newRole.description
    };
    setRoles([...roles, roleNode]);
    setShowRoleModal(false);
    setNewRole({ name: '', level: 2, entity: 'Universitas', description: '' });
  };

  const handleUpdateUserStatus = (id: string, newStatus: User['status']) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    if (editingUser) setEditingUser({ ...editingUser, status: newStatus });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Organization & Users</h2>
          <p className="text-sm text-slate-500">Manage Yayasan, Universitas, and Koperasi access rights.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
            <FileText size={16} /> Audit Log
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
          >
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 gap-6 shrink-0">
        {[
          { id: 'users', label: 'Users Directory', icon: Users },
          { id: 'roles', label: 'Org Structure & Roles', icon: Network },
          { id: 'security', label: 'Security Policy', icon: Lock },
          { id: 'audit', label: 'Activity Logs', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">Identity</th>
                    <th className="px-6 py-4 font-medium">Entity & Role</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${
                            user.entity === 'Yayasan' ? 'bg-rose-500' : 
                            user.entity === 'Koperasi' ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="mb-1">{getEntityBadge(user.entity)}</div>
                        <div className="font-medium text-slate-700 text-sm">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {user.department}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                          user.status === 'Locked' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="text-indigo-600 font-medium text-xs hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROLES TAB (VISUAL HIERARCHY) */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Tree */}
                <div className="col-span-1 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Organizational Hierarchy</h3>
                    <button onClick={() => setShowRoleModal(true)} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 border border-indigo-200">
                       + Add Position
                    </button>
                  </div>
                  
                  <div className="space-y-3 pb-10">
                    {/* Yayasan Level */}
                    {roles.filter(r => r.entity === 'Yayasan').map(role => (
                       <div key={role.id} className="relative group">
                          <div className={`p-4 rounded-lg border-l-4 shadow-sm ${getEntityColor(role.entity)} bg-white hover:shadow-md transition-shadow`}>
                             <div className="flex justify-between items-start">
                                <div>
                                   <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-slate-900">{role.name}</h4>
                                      {getEntityBadge(role.entity)}
                                   </div>
                                   <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                                </div>
                                <ShieldCheck size={18} className="text-rose-300"/>
                             </div>
                          </div>
                          {/* Connector Line */}
                          <div className="absolute left-6 bottom-0 h-4 w-0.5 bg-slate-300 translate-y-full z-0"></div>
                       </div>
                    ))}

                    <div className="pl-6 pt-4 space-y-6 border-l-2 border-slate-200 ml-6 relative">
                       {/* Split Branch: Universitas & Koperasi */}
                       
                       {/* Universitas Branch */}
                       <div className="relative">
                          {/* Connector */}
                          <div className="absolute -left-6 top-6 w-6 h-0.5 bg-slate-300"></div>
                          <div className="bg-slate-50 p-2 rounded mb-2 border border-blue-100 inline-block text-xs font-bold text-blue-800 uppercase tracking-wider">
                             Entitas Universitas
                          </div>
                          
                          <div className="space-y-3">
                             {roles.filter(r => r.entity === 'Universitas').sort((a,b) => a.level - b.level).map(role => (
                                <div key={role.id} className={`p-3 rounded-lg border bg-white ml-${(role.level - 1) * 6} hover:border-blue-300 transition-colors shadow-sm relative`} style={{ marginLeft: `${(role.level - 1) * 20}px` }}>
                                   {role.level > 1 && <div className="absolute -left-4 top-1/2 w-4 h-px bg-slate-300"></div>}
                                   <div className="flex justify-between items-center">
                                      <span className="font-medium text-slate-800 text-sm">{role.name}</span>
                                      <span className="text-[10px] text-slate-400">{role.description}</span>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       {/* Koperasi Branch */}
                       <div className="relative mt-8">
                           {/* Connector */}
                           <div className="absolute -left-6 top-6 w-6 h-0.5 bg-slate-300"></div>
                           <div className="bg-slate-50 p-2 rounded mb-2 border border-emerald-100 inline-block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                             Entitas Koperasi
                           </div>
                           
                           <div className="space-y-3">
                             {roles.filter(r => r.entity === 'Koperasi').sort((a,b) => a.level - b.level).map(role => (
                                <div key={role.id} className={`p-3 rounded-lg border bg-white hover:border-emerald-300 transition-colors shadow-sm relative`} style={{ marginLeft: `${(role.level - 1) * 20}px` }}>
                                   {role.level > 1 && <div className="absolute -left-4 top-1/2 w-4 h-px bg-slate-300"></div>}
                                   <div className="flex justify-between items-center">
                                      <span className="font-medium text-slate-800 text-sm">{role.name}</span>
                                      <span className="text-[10px] text-slate-400">{role.description}</span>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                    </div>
                  </div>
                </div>

                {/* Permissions Info Panel */}
                <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 h-fit sticky top-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Lock size={18} className="text-indigo-600" /> Access Governance
                  </h3>
                  
                  <div className="space-y-4">
                     <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                        <h4 className="font-bold text-rose-800 text-sm mb-1">Yayasan (Foundation)</h4>
                        <p className="text-xs text-rose-700">
                           Full visibility over consolidated Financials and Strategic Metrics. 
                           <br/><b>Cannot</b> edit operational academic grades or cooperative transactions directly (Segregation of Control).
                        </p>
                     </div>

                     <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 text-sm mb-1">Universitas (Rektorat)</h4>
                        <p className="text-xs text-blue-700">
                           Full control over Academic, Student, and HR modules within the University scope.
                           <br/><b>Restricted</b> from accessing Cooperative banking data.
                        </p>
                     </div>

                     <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <h4 className="font-bold text-emerald-800 text-sm mb-1">Koperasi (Co-op)</h4>
                        <p className="text-xs text-emerald-700">
                           Independent operational scope.
                           <br/>Manages Member Savings, Loans, and Retail Inventory.
                           <br/>Reports profit/loss to Yayasan.
                        </p>
                     </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                     <button className="w-full py-2 border border-slate-300 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50">
                        View Detailed Permission Matrix
                     </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock size={20} className="text-indigo-600" /> Authentication Policies
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Enforce 2FA/MFA</p>
                    <p className="text-xs text-slate-500">Required for Rektorat & Finance roles</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Enabled</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Single Sign-On (SSO)</p>
                    <p className="text-xs text-slate-500">Integrated with University Email</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" /> Segregation of Duties
              </h3>
              
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-blue-800">Entity Isolation Active</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Users with "Koperasi" entity cannot approve "Universitas" expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <table className="w-full text-sm text-left">
               <thead className="bg-white text-slate-500 border-b border-slate-100">
                 <tr>
                   <th className="px-6 py-3 font-medium">Timestamp</th>
                   <th className="px-6 py-3 font-medium">User</th>
                   <th className="px-6 py-3 font-medium">Module</th>
                   <th className="px-6 py-3 font-medium">Action & Details</th>
                   <th className="px-6 py-3 font-medium text-right">Severity</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {mockLogs.map(log => (
                   <tr key={log.id} className="hover:bg-slate-50">
                     <td className="px-6 py-3 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                     <td className="px-6 py-3 font-medium text-slate-900">{log.user}</td>
                     <td className="px-6 py-3 text-slate-600">{log.module}</td>
                     <td className="px-6 py-3">
                       <span className="font-medium text-slate-800">{log.action}</span>
                       <p className="text-xs text-slate-500">{log.details}</p>
                     </td>
                     <td className="px-6 py-3 text-right">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                         log.severity === 'high' ? 'bg-red-100 text-red-800' :
                         log.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                         'bg-emerald-100 text-emerald-800'
                       }`}>
                         {log.severity}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

      </div>

      {/* INVITE USER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add New User</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Entity Scope</label>
                  <select 
                    value={newUser.entity}
                    onChange={e => setNewUser({...newUser, entity: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Universitas">Universitas (Academic/Ops)</option>
                    <option value="Yayasan">Yayasan (Foundation/Oversight)</option>
                    <option value="Koperasi">Koperasi (Business Unit)</option>
                  </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {roles.filter(r => r.entity === newUser.entity).map(r => (
                       <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={newUser.department}
                    onChange={e => setNewUser({...newUser, department: e.target.value})}
                    placeholder="e.g. Finance"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-xl">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-white rounded-lg">Cancel</button>
              <button onClick={handleInviteUser} className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700">Add User</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ROLE MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
             <div className="flex justify-between items-center p-5 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Add Organization Role</h3>
                <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                   <X size={20} />
                </button>
             </div>
             <div className="p-5 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Position / Role Name</label>
                   <input 
                      type="text" 
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="e.g. Ka. Prodi"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Entity</label>
                   <select 
                      value={newRole.entity}
                      onChange={(e) => setNewRole({...newRole, entity: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                   >
                      <option value="Yayasan">Yayasan</option>
                      <option value="Universitas">Universitas</option>
                      <option value="Koperasi">Koperasi</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Hierarchy Level</label>
                   <select 
                      value={newRole.level}
                      onChange={(e) => setNewRole({...newRole, level: Number(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                   >
                      <option value={0}>Top Level (Pengurus/Ketua)</option>
                      <option value={1}>Executive (Rektor/Manajer)</option>
                      <option value={2}>Management (Warek/Kabiro)</option>
                      <option value={3}>Operational (Staff/Dosen)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                   <textarea 
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      rows={2}
                   />
                </div>
             </div>
             <div className="p-5 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-xl">
                <button onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-white rounded-lg">Cancel</button>
                <button onClick={handleAddRole} className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700">Save Role</button>
             </div>
          </div>
        </div>
      )}

      {/* MANAGE USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
             <div className={`flex justify-between items-start p-6 border-b border-slate-100 rounded-t-xl ${
                editingUser.entity === 'Yayasan' ? 'bg-rose-50' : 
                editingUser.entity === 'Koperasi' ? 'bg-emerald-50' : 'bg-blue-50'
             }`}>
               <div className="flex items-center gap-3">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white ${
                    editingUser.entity === 'Yayasan' ? 'bg-rose-500' : 
                    editingUser.entity === 'Koperasi' ? 'bg-emerald-500' : 'bg-blue-600'
                 }`}>
                    {editingUser.name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-800">{editingUser.name}</h3>
                    <p className="text-sm text-slate-500">{editingUser.email}</p>
                    <div className="mt-1">{getEntityBadge(editingUser.entity)}</div>
                 </div>
               </div>
               <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             </div>
             
             <div className="p-6 space-y-6">
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Placement</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Entity</label>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 text-slate-500" disabled defaultValue={editingUser.entity}>
                           <option>Universitas</option>
                           <option>Yayasan</option>
                           <option>Koperasi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                        <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white" defaultValue={editingUser.role}>
                           {roles.filter(r => r.entity === editingUser.entity).map(r => (
                              <option key={r.id}>{r.name}</option>
                           ))}
                        </select>
                      </div>
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Access Control</h4>
                   <div className="flex gap-3">
                      {editingUser.status === 'Locked' ? (
                        <button 
                           onClick={() => handleUpdateUserStatus(editingUser.id, 'Active')}
                           className="flex-1 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 flex justify-center items-center gap-2"
                        >
                           <CheckCircle size={16} /> Unlock
                        </button>
                      ) : (
                        <button 
                           onClick={() => handleUpdateUserStatus(editingUser.id, 'Locked')}
                           className="flex-1 py-2 border border-amber-200 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 flex justify-center items-center gap-2"
                        >
                           <Ban size={16} /> Lock
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteUser(editingUser.id)}
                        className="flex-1 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 flex justify-center items-center gap-2"
                      >
                         <Trash2 size={16} /> Remove
                      </button>
                   </div>
                </div>
             </div>
             <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
                <button onClick={() => setEditingUser(null)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Done</button>
             </div>
          </div>
        </div>
      )}

      <SmartAssistant contextData={contextString} />
    </div>
  );
};

export default ModuleUserManagement;
