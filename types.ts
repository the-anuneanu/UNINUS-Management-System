export enum ModuleType {
  DASHBOARD = 'Dashboard',
  ACCOUNTING = 'Accounting',
  PROCUREMENT = 'Procurement',
  ASSETS = 'Assets',
  PAYROLL = 'Payroll',
  RECRUITMENT = 'Recruitment',
  USER_MANAGEMENT = 'User Management',
  SETTINGS = 'Settings'
}

export interface FinancialMetric {
  month: string;
  revenue: number;
  expenses: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  category: string;
  status: 'Posted' | 'Pending';
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  item: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Received' | 'Paid';
  date: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  purchaseValue: number;
  currentValue: number;
  status: 'In Use' | 'Maintenance' | 'Scrapped';
  purchaseDate: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  status: 'Active' | 'On Leave';
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired';
  rating: number;
}