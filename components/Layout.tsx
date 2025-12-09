import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  ShoppingCart, 
  Box, 
  Users, 
  UserPlus, 
  Bell, 
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { ModuleType } from '../types';

interface LayoutProps {
  currentModule: ModuleType;
  setModule: (module: ModuleType) => void;
  children: React.ReactNode;
}

const NavItem = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ currentModule, setModule, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900">UniCore</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          <NavItem 
            active={currentModule === ModuleType.DASHBOARD} 
            onClick={() => setModule(ModuleType.DASHBOARD)} 
            icon={LayoutDashboard} 
            label="Dashboard" 
          />
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Finance & Ops
          </div>
          <NavItem 
            active={currentModule === ModuleType.ACCOUNTING} 
            onClick={() => setModule(ModuleType.ACCOUNTING)} 
            icon={Calculator} 
            label="Accounting" 
          />
          <NavItem 
            active={currentModule === ModuleType.PROCUREMENT} 
            onClick={() => setModule(ModuleType.PROCUREMENT)} 
            icon={ShoppingCart} 
            label="Procurement" 
          />
          <NavItem 
            active={currentModule === ModuleType.ASSETS} 
            onClick={() => setModule(ModuleType.ASSETS)} 
            icon={Box} 
            label="Assets" 
          />
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            HR & Staffing
          </div>
          <NavItem 
            active={currentModule === ModuleType.PAYROLL} 
            onClick={() => setModule(ModuleType.PAYROLL)} 
            icon={Users} 
            label="Payroll & Tax" 
          />
          <NavItem 
            active={currentModule === ModuleType.RECRUITMENT} 
            onClick={() => setModule(ModuleType.RECRUITMENT)} 
            icon={UserPlus} 
            label="Recruitment" 
          />
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Administration
          </div>
          <NavItem 
            active={currentModule === ModuleType.USER_MANAGEMENT} 
            onClick={() => setModule(ModuleType.USER_MANAGEMENT)} 
            icon={ShieldCheck} 
            label="User Management" 
          />
          <NavItem 
            active={currentModule === ModuleType.SETTINGS} 
            onClick={() => setModule(ModuleType.SETTINGS)} 
            icon={Settings} 
            label="System Settings" 
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md mr-4"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search modules, data..." 
                className="pl-10 pr-4 py-2 w-64 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                AD
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700">Admin User</span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;