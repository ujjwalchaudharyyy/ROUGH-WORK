import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { InventoryItem } from '../../types';
import {
  Boxes,
  PlusCircle,
  PackageMinus,
  PackagePlus,
  AlertTriangle,
  Search,
  CheckCircle2,
  RefreshCw,
  Archive,
} from 'lucide-react';

export const InventoryLogisticsPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [txType, setTxType] = useState<string>('CONSUMPTION');
  const [quantityDelta, setQuantityDelta] = useState<number>(50);
  const [txNotes, setTxNotes] = useState<string>('');
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await api.getInventory({ search });
      setItems(res.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search]);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmittingTx(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const delta = txType === 'RESTOCK' ? Math.abs(quantityDelta) : -Math.abs(quantityDelta);

    try {
      await api.recordInventoryTransaction(selectedItem.id, txType, delta, txNotes || 'Field supply logistics run');
      setSuccessMsg(`✅ Inventory transaction logged! New balance updated.`);
      setSelectedItem(null);
      setTxNotes('');
      fetchInventory();
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction failed');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Boxes className="w-6 h-6 text-rose-400" />
            <span>Relief Logistics & Supply Depots</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-depot stock monitoring with negative-balance prevention and auditable consumption logs.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          {successMsg}
        </div>
      )}

      {/* Transaction Modal */}
      {selectedItem && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-3 shadow-2xl animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono">
              Record Stock Movement: <span className="text-cyan-400">{selectedItem.name}</span>
            </h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-slate-200 font-mono"
            >
              Cancel
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-red-950/80 border border-red-500/40 text-red-200 font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleTransaction} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Transaction Type</label>
              <select
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
              >
                <option value="CONSUMPTION">CONSUMPTION (Dispatch to Camp)</option>
                <option value="RESTOCK">RESTOCK (Warehouse Intake)</option>
                <option value="DONATION">DONATION (NGO Influx)</option>
                <option value="TRANSFER">TRANSFER (Depot Relay)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Quantity ({selectedItem.unit})</label>
              <input
                type="number"
                min={1}
                required
                value={quantityDelta}
                onChange={(e) => setQuantityDelta(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Logistics / Dispatch Notes</label>
              <input
                type="text"
                placeholder="Destination shelter or vehicle ID..."
                value={txNotes}
                onChange={(e) => setTxNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmittingTx}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded font-mono uppercase tracking-wider transition disabled:opacity-50"
              >
                {isSubmittingTx ? 'Processing...' : 'Apply Stock Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Roster Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase bg-slate-950/60">
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Item Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Available Stock</th>
                <th className="py-3 px-3 text-right">Min Threshold</th>
                <th className="py-3 px-3">Storage Depot</th>
                <th className="py-3 px-3">Stock Health</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {items.map((i) => {
                const isLow = i.quantity <= i.minStockLevel;
                return (
                  <tr key={i.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-400">{i.sku}</td>
                    <td className="py-3 px-3 font-semibold text-slate-100">{i.name}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{i.category}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100 text-sm">
                      {i.quantity.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{i.unit}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 text-xs">
                      {i.minStockLevel} {i.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-cyan-300">
                      {i.storageLocation.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-3">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-red-950/60 text-red-400 border border-red-500/40 px-2 py-0.5 rounded animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> LOW STOCK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> ADEQUATE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedItem(i)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px] transition"
                      >
                        Mutate &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
