
import React, { useState } from 'react';
import { Sparkles, User, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Simple validation logic (Hardcoded for demo)
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-200/30 blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/30 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl mx-4 z-10 overflow-hidden">
        
        {/* Left Side - Brand / Image */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-wide">UniCore ERP</h1>
              </div>
              <p className="text-indigo-100 text-lg leading-relaxed mb-6">
                Integrated Management System for Modern Universities. Streamline Finance, HR, and Academic Operations in one platform.
              </p>
              
              <div className="space-y-4 mt-8">
                 <div className="flex items-center gap-3 text-sm text-indigo-100 bg-white/10 p-3 rounded-lg border border-white/10">
                    <ShieldCheck size={18} />
                    <span>Yayasan & Rektorat Dashboard</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-indigo-100 bg-white/10 p-3 rounded-lg border border-white/10">
                    <User size={18} />
                    <span>Secure Role-Based Access</span>
                 </div>
              </div>
           </div>

           {/* Decorative Circles on Left Panel */}
           <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>

           <div className="relative z-10 mt-12 text-xs text-indigo-200">
              © 2024 UNINUS Technology Dept.
           </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">Forgot password?</a>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-xs text-slate-400">
                Demo Credentials: <b>admin</b> / <b>admin</b>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
