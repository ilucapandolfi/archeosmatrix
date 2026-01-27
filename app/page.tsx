"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Layout, Trash2, Command, TrendingUp, Table, Wallet as WalletIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function MatrixProBuilder() {
  const [activeBlocks, setActiveBlocks] = useState<any[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      const { data: pageData } = await supabase.from('nodes').select('ui_schema').eq('slug', 'home').single();
      if (pageData?.ui_schema?.blocks) setActiveBlocks(pageData.ui_schema.blocks);
      const { data: assetData } = await supabase.from('nodes').select('*').eq('node_type', 'asset');
      if (assetData) setAssets(assetData);
    }
    init();
  }, []);

  const sync = async (blocks: any[]) => {
    await supabase.from('nodes').update({ ui_schema: { blocks } }).eq('slug', 'home');
  };

  const addBlock = (type: string) => {
    const newBlock = { id: Math.random().toString(36).substr(2, 9), type };
    const updated = [...activeBlocks, newBlock];
    setActiveBlocks(updated);
    sync(updated);
    setShowSlashMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setMenuPos({ x: rect.left, y: rect.bottom + window.scrollY + 10 });
        setShowSlashMenu(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 focus:outline-none" onKeyDown={handleKeyDown} tabIndex={0}>
      <nav className="fixed top-0 w-full h-14 border-b border-white/5 bg-black/80 backdrop-blur-xl z-[100] flex items-center px-6">
        <span className="text-white font-black text-xs uppercase tracking-widest">Archeos Matrix OS</span>
      </nav>

      <main className="max-w-4xl mx-auto pt-32 pb-40 px-6">
        <div className="space-y-12">
          {activeBlocks.map((block, idx) => (
            <div key={block.id} className="relative group">
              <button onClick={() => {const f = activeBlocks.filter((_, i) => i !== idx); setActiveBlocks(f); sync(f);}} className="absolute -left-12 opacity-0 group-hover:opacity-100 p-2 text-slate-700 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
              
              {block.type === 'CHART' && (
                <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8">
                  <div className="flex justify-between mb-4 text-white font-bold text-sm"><span>Market Analysis</span><TrendingUp size={16} className="text-blue-500"/></div>
                  <div className="h-32 w-full flex items-end gap-1 opacity-50">{[40, 70, 45, 90, 65, 80, 30].map((h, i) => <div key={i} className="flex-1 bg-blue-600 rounded-t-sm" style={{height: `${h}%`}} />)}</div>
                </div>
              )}

              {block.type === 'TABLE' && (
                <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden">
                   <table className="w-full text-xs text-left">
                    <thead className="bg-white/5 text-slate-500 font-bold uppercase tracking-widest border-b border-white/5"><tr><th className="p-4">Asset</th><th className="p-4 text-right">Value</th></tr></thead>
                    <tbody>{assets.map(a => (<tr key={a.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"><td className="p-4 text-white font-bold">{a.slug}</td><td className="p-4 text-right text-emerald-500 font-mono">{a.data_content?.price || '0.00'}</td></tr>))}</tbody>
                   </table>
                </div>
              )}

              {block.type === 'WALLET' && (
                <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex justify-between items-center shadow-xl">
                  <div><p className="text-blue-200 text-[10px] font-bold uppercase mb-1">Balance</p><h2 className="text-4xl font-black italic">12.450 TRC</h2></div>
                  <WalletIcon size={32} />
                </div>
              )}
            </div>
          ))}
          <div className="pt-20 border-t border-white/5 text-slate-700 text-sm flex items-center gap-2 italic"><Command size={14} /> Digita / per aggiungere moduli</div>
        </div>
      </main>

      <AnimatePresence>
        {showSlashMenu && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ top: menuPos.y, left: menuPos.x }} className="fixed z-[120] w-56 bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl">
            <button onClick={() => addBlock('CHART')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-600 rounded-xl group transition-all text-left">
              <TrendingUp size={16} className="text-slate-500 group-hover:text-white" /><span className="text-xs font-bold text-white leading-none">Market Chart</span>
            </button>
            <button onClick={() => addBlock('TABLE')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-600 rounded-xl group transition-all text-left mt-1">
              <Table size={16} className="text-slate-500 group-hover:text-white" /><span className="text-xs font-bold text-white leading-none">Smart Table</span>
            </button>
            <button onClick={() => addBlock('WALLET')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-600 rounded-xl group transition-all text-left mt-1">
              <WalletIcon size={16} className="text-slate-500 group-hover:text-white" /><span className="text-xs font-bold text-white leading-none">Wallet Widget</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
