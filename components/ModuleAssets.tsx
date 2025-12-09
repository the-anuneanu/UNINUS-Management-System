import React from 'react';
import { Box, RefreshCw, DollarSign, Activity } from 'lucide-react';
import { Asset } from '../types';
import SmartAssistant from './SmartAssistant';

const assets: Asset[] = [
  { id: 'AST-101', name: 'Dell Precision Workstation', category: 'IT', purchaseValue: 2500, currentValue: 1800, status: 'In Use', purchaseDate: '2022-01-15' },
  { id: 'AST-102', name: 'Herman Miller Chair', category: 'Furniture', purchaseValue: 1200, currentValue: 1000, status: 'In Use', purchaseDate: '2023-05-20' },
  { id: 'AST-103', name: 'Campus Shuttle Bus #4', category: 'Vehicle', purchaseValue: 45000, currentValue: 38000, status: 'Maintenance', purchaseDate: '2021-08-10' },
  { id: 'AST-104', name: 'Projector 4K', category: 'AV', purchaseValue: 3000, currentValue: 500, status: 'Scrapped', purchaseDate: '2019-02-01' },
];

const ModuleAssets = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Fixed Assets</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          Register New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
           <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Total Asset Value</div>
           <div className="text-2xl font-bold text-slate-900">$1.4M</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
           <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Items in Use</div>
           <div className="text-2xl font-bold text-emerald-600">845</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
           <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Maintenance</div>
           <div className="text-2xl font-bold text-amber-500">12</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
           <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Scrap Value</div>
           <div className="text-2xl font-bold text-slate-400">$12k</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-lg font-semibold text-slate-800">Asset Registry</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-6">
           {assets.map(asset => (
             <div key={asset.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h4 className="font-semibold text-slate-900">{asset.name}</h4>
                      <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{asset.category}</span>
                   </div>
                   <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                     asset.status === 'In Use' ? 'bg-emerald-100 text-emerald-700' : 
                     asset.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' :
                     'bg-red-100 text-red-700'
                   }`}>
                     {asset.status}
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                   <div className="flex items-center text-slate-600">
                      <DollarSign size={14} className="mr-1" />
                      Original: ${asset.purchaseValue.toLocaleString()}
                   </div>
                   <div className="flex items-center text-slate-600">
                      <Activity size={14} className="mr-1" />
                      Current: ${asset.currentValue.toLocaleString()}
                   </div>
                   <div className="col-span-2 mt-2">
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                         <div 
                           className="bg-indigo-500 h-1.5 rounded-full" 
                           style={{ width: `${(asset.currentValue / asset.purchaseValue) * 100}%` }}
                         ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                         <span>Value Remaining</span>
                         <span>{Math.round((asset.currentValue / asset.purchaseValue) * 100)}%</span>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
      <SmartAssistant contextData={`Asset Registry: ${JSON.stringify(assets)}`} />
    </div>
  );
};

export default ModuleAssets;
