import React from 'react';
import { ModuleType } from '../types';
import { ArrowRight } from 'lucide-react';

interface DashboardProps {
  setModule: (m: ModuleType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setModule }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back, Admin</h1>
        <p className="text-slate-500 mt-2">Here is what is happening at the University today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Access Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform transition hover:scale-[1.01] cursor-pointer" onClick={() => setModule(ModuleType.ACCOUNTING)}>
          <h3 className="text-lg font-semibold opacity-90">Financial Status</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">$1.2M</span>
            <span className="ml-2 text-indigo-100 text-sm">Revenue this month</span>
          </div>
          <div className="mt-6 flex items-center text-sm font-medium text-indigo-100 hover:text-white">
            View Reports <ArrowRight size={16} className="ml-1" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => setModule(ModuleType.PAYROLL)}>
          <h3 className="text-lg font-semibold text-slate-800">Payroll Pending</h3>
          <div className="mt-4">
             <div className="text-3xl font-bold text-slate-900">142</div>
             <p className="text-slate-500 text-sm">Employees to process</p>
          </div>
          <div className="mt-6 w-full bg-slate-100 rounded-full h-2">
            <div className="bg-amber-500 w-3/4 h-2 rounded-full"></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Process by Oct 31</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => setModule(ModuleType.RECRUITMENT)}>
           <h3 className="text-lg font-semibold text-slate-800">Open Positions</h3>
           <div className="mt-4 flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold text-slate-900">8</div>
                <p className="text-slate-500 text-sm">Active Job Listings</p>
              </div>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs">
                     U{i}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                  +5
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">System Alerts</h3>
            <div className="space-y-4">
               <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="h-2 w-2 mt-2 rounded-full bg-red-500 mr-3"></div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">Tax Compliance Due</h4>
                    <p className="text-xs text-red-600 mt-1">Submit annual declaration by Nov 15th to avoid penalties.</p>
                  </div>
               </div>
               <div className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="h-2 w-2 mt-2 rounded-full bg-amber-500 mr-3"></div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800">Low Stock Warning</h4>
                    <p className="text-xs text-amber-600 mt-1">Science Lab inventory is below threshold.</p>
                  </div>
               </div>
               <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800">New Grant Received</h4>
                    <p className="text-xs text-blue-600 mt-1">Research Dept received $150k grant. Allocation needed.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">AI Insights</h3>
              <p className="text-slate-300 text-sm mb-6">Gemini has analyzed your last quarter performance.</p>
              
              <div className="space-y-3">
                 <div className="flex items-center text-sm">
                    <span className="w-24 text-slate-400">Trend</span>
                    <span className="font-medium text-emerald-400">Positive Revenue Growth (+12%)</span>
                 </div>
                 <div className="flex items-center text-sm">
                    <span className="w-24 text-slate-400">Anomaly</span>
                    <span className="font-medium text-amber-400">High Utility Costs in Building C</span>
                 </div>
                 <div className="flex items-center text-sm">
                    <span className="w-24 text-slate-400">Prediction</span>
                    <span className="font-medium text-blue-400">Recruitment needs will peak in Dec</span>
                 </div>
              </div>
              
              <button className="mt-6 text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">
                View Full Analysis
              </button>
            </div>
            
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
