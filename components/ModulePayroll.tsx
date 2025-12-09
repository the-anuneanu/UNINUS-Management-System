import React from 'react';
import { Users, CreditCard, Calendar, Download } from 'lucide-react';
import { Employee } from '../types';
import SmartAssistant from './SmartAssistant';

const employees: Employee[] = [
  { id: 'EMP-001', name: 'Dr. Sarah Connor', role: 'Professor', department: 'Physics', salary: 8500, status: 'Active' },
  { id: 'EMP-002', name: 'John Smith', role: 'Admin Officer', department: 'Registrar', salary: 4200, status: 'Active' },
  { id: 'EMP-003', name: 'Emily Chen', role: 'Lecturer', department: 'Computer Science', salary: 5600, status: 'On Leave' },
  { id: 'EMP-004', name: 'Michael Brown', role: 'Janitor', department: 'Facilities', salary: 3100, status: 'Active' },
];

const ModulePayroll = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Payroll & Tax</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
            Configure Tax Slabs
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <CreditCard size={16} />
            Run Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-indigo-100 text-sm mb-1">Next Payroll Run</p>
          <h3 className="text-3xl font-bold">Oct 31, 2023</h3>
          <div className="mt-4 flex items-center text-sm text-indigo-100">
            <Calendar size={16} className="mr-2" />
            <span>5 Days remaining</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm mb-1">Total Salary Cost</p>
          <h3 className="text-3xl font-bold text-slate-900">$184,200</h3>
          <p className="text-xs text-slate-400 mt-2">Monthly Estimate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm mb-1">Pending Loans</p>
          <h3 className="text-3xl font-bold text-slate-900">4</h3>
          <p className="text-xs text-slate-400 mt-2">Employee requests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <h3 className="text-lg font-semibold text-slate-800">Employee Salary Structures</h3>
           <div className="text-sm text-slate-500">Showing 4 of 142 employees</div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Role & Dept</th>
              <th className="px-6 py-4 font-medium">Base Salary</th>
              <th className="px-6 py-4 font-medium">Tax Status</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{emp.name}</div>
                      <div className="text-xs text-slate-500">{emp.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900">{emp.role}</div>
                  <div className="text-xs text-slate-500">{emp.department}</div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">${emp.salary.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-600">Compliant</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-slate-400 hover:text-indigo-600"><Download size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SmartAssistant contextData={`Payroll View. Employees: ${JSON.stringify(employees)}`} />
    </div>
  );
};

export default ModulePayroll;
