
import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  CheckCircle,
  X,
  Building,
  BarChart3,
  Archive,
  ArrowRight
} from 'lucide-react';
import { PurchaseOrder } from '../types';
import SmartAssistant from './SmartAssistant';

// --- Types for Local State ---
interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'Consumable' | 'Asset' | 'IT' | 'Furniture';
  stock: number;
  unit: string;
  reorderPoint: number;
  unitPrice: number;
  location: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  category: string;
  rating: number; // 1-5
}

// --- Mock Data (UNINUS Context) ---
const initialInventory: InventoryItem[] = [
  { id: 'ITM-001', name: 'Kertas A4 80gsm (Rim)', sku: 'OFF-PAP-001', category: 'Consumable', stock: 45, unit: 'Rim', reorderPoint: 50, unitPrice: 55000, location: 'Gudang Admin' },
  { id: 'ITM-002', name: 'Spidol Whiteboard (Box)', sku: 'OFF-MRK-002', category: 'Consumable', stock: 12, unit: 'Box', reorderPoint: 10, unitPrice: 85000, location: 'Gudang FKIP' },
  { id: 'ITM-003', name: 'Mikroskop Cahaya X200', sku: 'LAB-BIO-001', category: 'Asset', stock: 20, unit: 'Unit', reorderPoint: 5, unitPrice: 4500000, location: 'Lab Biologi' },
  { id: 'ITM-004', name: 'PC All-in-One Core i5', sku: 'IT-COM-005', category: 'IT', stock: 5, unit: 'Unit', reorderPoint: 5, unitPrice: 12500000, location: 'Gudang IT' },
  { id: 'ITM-005', name: 'Kursi Kuliah Chitose', sku: 'FUR-CHR-009', category: 'Furniture', stock: 200, unit: 'Unit', reorderPoint: 20, unitPrice: 650000, location: 'Gudang Umum' },
];

const initialSuppliers: Supplier[] = [
  { id: 'SUP-001', name: 'CV. Pustaka Abadi', contact: 'Budi Santoso', email: 'sales@pustaka.co.id', category: 'Stationery', rating: 4.5 },
  { id: 'SUP-002', name: 'PT. Teknologi Edukasi Indonesia', contact: 'Siska Wulandari', email: 'biz@techedu.id', category: 'IT Hardware', rating: 4.8 },
  { id: 'SUP-003', name: 'CV. Meubel Kampus', contact: 'Haji Ahmad', email: 'order@meubelkampus.com', category: 'Furniture', rating: 4.0 },
  { id: 'SUP-004', name: 'Global Science Supplies', contact: 'Dr. Rian', email: 'rian@globalsci.com', category: 'Lab Equipment', rating: 4.9 },
];

const initialOrders: PurchaseOrder[] = [
  { id: 'PO-2023-10-001', supplier: 'PT. Teknologi Edukasi Indonesia', item: 'PC All-in-One Core i5 (5 Unit)', amount: 62500000, status: 'Sent', date: '2023-10-25' },
  { id: 'PO-2023-10-002', supplier: 'CV. Pustaka Abadi', item: 'Kertas A4 80gsm (50 Rim)', amount: 2750000, status: 'Received', date: '2023-10-20' },
  { id: 'PO-2023-10-003', supplier: 'Global Science Supplies', item: 'Mikroskop Cahaya X200 (2 Unit)', amount: 9000000, status: 'Draft', date: '2023-10-26' },
];

// --- Helper: Currency ---
const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const ModuleProcurement = () => {
  const [activeTab, setActiveTab] = useState<'procurement' | 'inventory' | 'suppliers'>('procurement');
  
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  // Modals
  const [showPOModal, setShowPOModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Form States
  const [newPO, setNewPO] = useState({ supplierId: '', itemId: '', quantity: 1 });
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ category: 'Consumable', unit: 'Pcs' });
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({ rating: 5 });

  // Derived Stats
  const lowStockItems = inventory.filter(i => i.stock <= i.reorderPoint);
  const pendingOrders = orders.filter(o => o.status === 'Sent' || o.status === 'Draft').length;
  const totalInventoryValue = inventory.reduce((acc, item) => acc + (item.stock * item.unitPrice), 0);

  // --- Actions ---

  const handleCreatePO = () => {
    if (!newPO.supplierId || !newPO.itemId) return;

    const supplier = suppliers.find(s => s.id === newPO.supplierId);
    const item = inventory.find(i => i.id === newPO.itemId);

    if (supplier && item) {
      const totalAmount = item.unitPrice * newPO.quantity;
      const newOrder: PurchaseOrder = {
        id: `PO-2023-10-${String(orders.length + 1).padStart(3, '0')}`,
        supplier: supplier.name,
        item: `${item.name} (${newPO.quantity} ${item.unit})`,
        amount: totalAmount,
        status: 'Sent',
        date: new Date().toISOString().split('T')[0]
      };
      setOrders([newOrder, ...orders]);
      setShowPOModal(false);
      setNewPO({ supplierId: '', itemId: '', quantity: 1 });
    }
  };

  const handleReceivePO = (poId: string) => {
    // 1. Update PO Status
    const order = orders.find(o => o.id === poId);
    if (!order) return;

    setOrders(orders.map(o => o.id === poId ? { ...o, status: 'Received' } : o));

    // 2. Parse Item and Qty from string (Simplified logic for demo)
    // Format: "Item Name (Qty Unit)" -> Need to find item in inventory
    // In a real app, PO would have a structured `lines` array. 
    // Here we will try to match the item name.
    const itemName = order.item.split(' (')[0];
    const qtyMatch = order.item.match(/\((\d+)/);
    const qty = qtyMatch ? parseInt(qtyMatch[1]) : 0;

    if (itemName && qty > 0) {
       setInventory(prev => prev.map(inv => {
          if (inv.name === itemName) {
             return { ...inv, stock: inv.stock + qty };
          }
          return inv;
       }));
       alert(`Successfully received ${qty} units. Inventory updated.`);
    } else {
       // Fallback if parsing fails (for manually added mock data)
       alert('Order marked as Received. Please verify inventory manually.');
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.unitPrice) return;
    const item: InventoryItem = {
      id: `ITM-${String(inventory.length + 1).padStart(3, '0')}`,
      name: newItem.name,
      sku: newItem.sku || 'GEN-000',
      category: newItem.category as any,
      stock: Number(newItem.stock) || 0,
      unit: newItem.unit || 'Pcs',
      reorderPoint: Number(newItem.reorderPoint) || 5,
      unitPrice: Number(newItem.unitPrice),
      location: newItem.location || 'General Storage'
    };
    setInventory([...inventory, item]);
    setShowItemModal(false);
    setNewItem({ category: 'Consumable', unit: 'Pcs' });
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name) return;
    const sup: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      name: newSupplier.name!,
      contact: newSupplier.contact || '',
      email: newSupplier.email || '',
      category: newSupplier.category || 'General',
      rating: 5
    };
    setSuppliers([...suppliers, sup]);
    setShowSupplierModal(false);
    setNewSupplier({ rating: 5 });
  };

  const contextString = `
    Module: Procurement & Inventory.
    Active Tab: ${activeTab}.
    Low Stock Items: ${lowStockItems.map(i => i.name).join(', ')}.
    Pending Orders: ${pendingOrders}.
    Total Inventory Value: ${formatIDR(totalInventoryValue)}.
    Suppliers: ${suppliers.length} active vendors.
  `;

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Procurement & Inventory</h2>
           <p className="text-sm text-slate-500">Manage purchasing, stock levels, and vendor relationships.</p>
        </div>
        <div className="flex gap-2">
           {activeTab === 'procurement' && (
             <button 
               onClick={() => setShowPOModal(true)}
               className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
             >
               <ShoppingCart size={16} /> Create PO
             </button>
           )}
           {activeTab === 'inventory' && (
             <button 
               onClick={() => setShowItemModal(true)}
               className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
             >
               <Plus size={16} /> Add New Item
             </button>
           )}
           {activeTab === 'suppliers' && (
             <button 
               onClick={() => setShowSupplierModal(true)}
               className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
             >
               <Building size={16} /> Add Supplier
             </button>
           )}
        </div>
      </div>

      {/* KPI Cards (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Active Orders</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingOrders}</h3>
           </div>
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Truck size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Low Stock Alerts</p>
              <h3 className={`text-2xl font-bold mt-1 ${lowStockItems.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{lowStockItems.length}</h3>
           </div>
           <div className={`p-3 rounded-lg ${lowStockItems.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}><AlertCircle size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Inventory Value</p>
              <h3 className="text-xl font-bold text-emerald-700 mt-1">{formatIDR(totalInventoryValue)}</h3>
           </div>
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><BarChart3 size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
           <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Registered Vendors</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{suppliers.length}</h3>
           </div>
           <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Building size={24}/></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 shrink-0">
         <button onClick={() => setActiveTab('procurement')} className={`pb-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'procurement' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>
            <ShoppingCart size={16} /> Procurement (PO)
         </button>
         <button onClick={() => setActiveTab('inventory')} className={`pb-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'inventory' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>
            <Package size={16} /> Inventory & Stock
         </button>
         <button onClick={() => setActiveTab('suppliers')} className={`pb-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'suppliers' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>
            <Building size={16} /> Suppliers
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
         
         {/* PROCUREMENT TAB */}
         {activeTab === 'procurement' && (
           <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">PO Number</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Supplier</th>
                    <th className="px-6 py-4 font-medium">Items Ordered</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(po => (
                    <tr key={po.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 font-medium text-slate-900">{po.id}</td>
                       <td className="px-6 py-4 text-slate-600">{po.date}</td>
                       <td className="px-6 py-4 text-slate-900">{po.supplier}</td>
                       <td className="px-6 py-4 text-slate-600">{po.item}</td>
                       <td className="px-6 py-4 font-medium text-slate-900">{formatIDR(po.amount)}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             po.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                             po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' :
                             po.status === 'Draft' ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-700'
                          }`}>
                             {po.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          {po.status === 'Sent' ? (
                            <button 
                               onClick={() => handleReceivePO(po.id)}
                               className="text-emerald-600 hover:text-emerald-800 font-medium text-xs border border-emerald-200 bg-emerald-50 px-3 py-1 rounded-lg transition-colors"
                            >
                               Receive Goods
                            </button>
                          ) : (
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">View Details</button>
                          )}
                       </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                     <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No Purchase Orders found. Create one to get started.</td></tr>
                  )}
                </tbody>
              </table>
           </div>
         )}

         {/* INVENTORY TAB */}
         {activeTab === 'inventory' && (
           <div className="flex-1 overflow-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">SKU</th>
                    <th className="px-6 py-4 font-medium">Item Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium text-right">Unit Price</th>
                    <th className="px-6 py-4 font-medium text-center">Stock Level</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {inventory.map(item => {
                      const isLow = item.stock <= item.reorderPoint;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                           <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                           <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                           <td className="px-6 py-4">
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{item.category}</span>
                           </td>
                           <td className="px-6 py-4 text-slate-600">{item.location}</td>
                           <td className="px-6 py-4 text-right text-slate-900">{formatIDR(item.unitPrice)}</td>
                           <td className="px-6 py-4 text-center font-medium">
                              {item.stock} <span className="text-slate-400 text-xs font-normal">{item.unit}</span>
                           </td>
                           <td className="px-6 py-4 text-center">
                              {isLow ? (
                                <span className="flex items-center justify-center gap-1 text-rose-600 text-xs font-bold bg-rose-50 px-2 py-1 rounded-full border border-rose-100">
                                   <AlertCircle size={12}/> Low Stock
                                </span>
                              ) : (
                                <span className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                                   <CheckCircle size={12}/> OK
                                </span>
                              )}
                           </td>
                        </tr>
                      )
                   })}
                </tbody>
             </table>
           </div>
         )}

         {/* SUPPLIERS TAB */}
         {activeTab === 'suppliers' && (
           <div className="flex-1 overflow-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {suppliers.map(sup => (
                   <div key={sup.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition bg-slate-50/50">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">
                            {sup.name.charAt(0)}
                         </div>
                         <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs font-bold">
                            ★ {sup.rating}
                         </div>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{sup.name}</h3>
                      <p className="text-sm text-slate-500 mb-4">{sup.category} Vendor</p>
                      
                      <div className="space-y-2 text-sm">
                         <div className="flex items-center gap-2 text-slate-600">
                            <span className="w-16 text-xs text-slate-400">Contact:</span>
                            {sup.contact}
                         </div>
                         <div className="flex items-center gap-2 text-slate-600">
                            <span className="w-16 text-xs text-slate-400">Email:</span>
                            {sup.email}
                         </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                         <button className="flex-1 py-2 text-xs font-medium border border-slate-300 rounded-lg hover:bg-white transition-colors">History</button>
                         <button className="flex-1 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Create PO</button>
                      </div>
                   </div>
                ))}
             </div>
           </div>
         )}
      </div>

      {/* --- MODALS --- */}

      {/* Create PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Create Purchase Order</h3>
                <button onClick={() => setShowPOModal(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
             </div>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Select Supplier</label>
                   <select 
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                      value={newPO.supplierId}
                      onChange={e => setNewPO({...newPO, supplierId: e.target.value})}
                   >
                      <option value="">-- Choose Vendor --</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Select Item</label>
                   <select 
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                      value={newPO.itemId}
                      onChange={e => setNewPO({...newPO, itemId: e.target.value})}
                   >
                      <option value="">-- Choose Item from Inventory --</option>
                      {inventory.map(i => <option key={i.id} value={i.id}>{i.name} - {formatIDR(i.unitPrice)}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                   <input 
                      type="number" 
                      min="1"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newPO.quantity}
                      onChange={e => setNewPO({...newPO, quantity: parseInt(e.target.value)})}
                   />
                </div>
                {newPO.itemId && (
                   <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-200">
                      <span className="text-sm text-slate-600">Total Estimated Cost:</span>
                      <span className="font-bold text-indigo-600">
                         {formatIDR((inventory.find(i => i.id === newPO.itemId)?.unitPrice || 0) * newPO.quantity)}
                      </span>
                   </div>
                )}
             </div>
             <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowPOModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                <button onClick={handleCreatePO} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Create Order</button>
             </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Add Inventory Item</h3>
                <button onClick={() => setShowItemModal(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
             </div>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                   <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g. Spidol Whiteboard"
                      value={newItem.name || ''}
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select 
                         className="w-full px-3 py-2 border rounded-lg bg-white"
                         value={newItem.category}
                         onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                      >
                         <option value="Consumable">Consumable</option>
                         <option value="Asset">Asset (Fixed)</option>
                         <option value="IT">IT Equipment</option>
                         <option value="Furniture">Furniture</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Code</label>
                      <input 
                         type="text" 
                         className="w-full px-3 py-2 border rounded-lg"
                         placeholder="Auto-generated if empty"
                         value={newItem.sku || ''}
                         onChange={e => setNewItem({...newItem, sku: e.target.value})}
                      />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
                      <input 
                         type="number" 
                         className="w-full px-3 py-2 border rounded-lg"
                         value={newItem.stock || 0}
                         onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Unit of Measure</label>
                      <select 
                         className="w-full px-3 py-2 border rounded-lg bg-white"
                         value={newItem.unit}
                         onChange={e => setNewItem({...newItem, unit: e.target.value})}
                      >
                         <option>Pcs</option>
                         <option>Box</option>
                         <option>Rim</option>
                         <option>Unit</option>
                         <option>Kg</option>
                      </select>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price (IDR)</label>
                      <input 
                         type="number" 
                         className="w-full px-3 py-2 border rounded-lg"
                         value={newItem.unitPrice || 0}
                         onChange={e => setNewItem({...newItem, unitPrice: parseInt(e.target.value)})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Reorder Point</label>
                      <input 
                         type="number" 
                         className="w-full px-3 py-2 border rounded-lg"
                         value={newItem.reorderPoint || 5}
                         onChange={e => setNewItem({...newItem, reorderPoint: parseInt(e.target.value)})}
                      />
                   </div>
                </div>
             </div>
             <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowItemModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                <button onClick={handleAddItem} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Item</button>
             </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showSupplierModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Register New Supplier</h3>
                <button onClick={() => setShowSupplierModal(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
             </div>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                   <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSupplier.name || ''}
                      onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                   <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g. IT, Stationery, Cleaning"
                      value={newSupplier.category || ''}
                      onChange={e => setNewSupplier({...newSupplier, category: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                   <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSupplier.contact || ''}
                      onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                   <input 
                      type="email" 
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSupplier.email || ''}
                      onChange={e => setNewSupplier({...newSupplier, email: e.target.value})}
                   />
                </div>
             </div>
             <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowSupplierModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                <button onClick={handleAddSupplier} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Supplier</button>
             </div>
          </div>
         </div>
      )}

      <SmartAssistant contextData={contextString} />
    </div>
  );
};

export default ModuleProcurement;
