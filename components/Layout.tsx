
import React, { useState, useRef, useEffect } from 'react';
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
  Settings,
  LogOut,
  User,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { ModuleType } from '../types';

interface LayoutProps {
  currentModule: ModuleType;
  setModule: (module: ModuleType) => void;
  onLogout: () => void;
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

const Layout: React.FC<LayoutProps> = ({ currentModule, setModule, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
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
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 hover:bg-slate-100 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                  AD
                </div>
                <div className="hidden md:flex flex-col items-start text-xs">
                   <span className="font-bold text-slate-700">Admin User</span>
                   <span className="text-slate-500">Super Admin</span>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                    <p className="text-sm font-bold text-slate-800">Administrator</p>
                    <p className="text-xs text-slate-500 truncate">admin@uninus.ac.id</p>
                  </div>
                  
                  <div className="px-2 space-y-1">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors">
                      <User size={16} /> My Profile
                    </button>
                    <button 
                      onClick={() => {
                         setModule(ModuleType.SETTINGS);
                         setProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Settings size={16} /> System Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors">
                      <HelpCircle size={16} /> Help & Support
                    </button>
                  </div>
                  
                  <div className="border-t border-slate-100 my-2 pt-2 px-2">
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
