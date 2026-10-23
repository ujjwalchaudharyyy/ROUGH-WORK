import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { InventoryItem } from '../../types';
import { Boxes, PackagePlus, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ShelterSuppliesPage: React.FC = () => {
  const [supplies, setSupplies] = useState<InventoryItem[]>([]);
  const [requestMsg, setRequestMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const res = await api.getInventory();
        setSupplies(res.items?.slice(0, 8) || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSupplies();
  }, []);

  const handleRequestDepotSupply = (itemName: string) => {
    setRequestMsg(`📦 Re-supply order for "${itemName}" dispatched to Central Depot logistics fleet.`);
    setTimeout(() => setRequestMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Boxes className="w-6 h-6 text-rose-400" />
          <span>Shelter Essential Supplies Roster</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Monitor available relief food, potable water canisters, blankets, and request depot re-supply runs.
        </p>
      </div>

      {requestMsg && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-mono">
          {requestMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supplies.map((item) => {
          const isLow = item.quantity <= item.minStockLevel;
          return (
            <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">{item.sku}</span>
                  {isLow ? (
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded font-bold bg-red-950 text-red-400 border border-red-500/30 uppercase">
                      LOW STOCK
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase">
                      SUFFICIENT
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-100 mt-1">{item.name}</h3>

                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-xs text-slate-400">On-Site Quantity:</span>
                  <span className="text-xl font-extrabold text-cyan-300">
                    {item.quantity.toLocaleString()} <span className="text-xs text-slate-400">{item.unit}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRequestDepotSupply(item.name)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>Request Re-supply</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
