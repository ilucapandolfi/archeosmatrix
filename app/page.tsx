"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Layout, Trash2, Command, CloudCheck, CloudLightning } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- ATOMO EDITABILI CON SINCRONIZZAZIONE ---
const EditableText = ({ initialText, onSave, className }: { initialText: string, onSave: (val: string) => void, className: string }) => {
  const [text, setText] = useState(initialText);
  
  return (
    <span 
      contentEditable 
      suppressContentEditableWarning 
      onBlur={(e) => onSave(e.currentTarget.textContent || "")}
      className={`${className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 transition-all cursor-text`}
    >
      {text}
    </span>
  );
};

// --- LOGICA BUILDER ---
export default function MatrixLiveBuilder() {
  const [activeBlocks, setActiveBlocks] = useState<any[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // 1. CARICAMENTO INIZIALE DA SUPABASE
  useEffect(() => {
    async function loadPage() {
      const { data, error } = await supabase
        .from('nodes')
        .select('ui_schema')
        .eq('slug', 'home') // Carichiamo la home per default
        .single();
      
      if (data?.ui_schema?.blocks) {
        setActiveBlocks(data.ui_schema.blocks);
      }
    }
    loadPage();
  }, []);

  // 2. FUNZIONE DI SALVATAGGIO AUTOMATICO
  const syncWithDatabase = async (newBlocks: any[]) => {
    setSaveStatus('saving');
    const { error } = await supabase
      .from('nodes')
      .update({ ui_schema: { blocks: newBlocks } })
      .eq('slug', 'home');
    
    if (!error) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const updateBlockData = (index: number, newText: string) => {
    const updated = [...activeBlocks];
    updated[index].content = newText;
    setActiveBlocks(updated);
    syncWithDatabase(updated);
  };

  const addBlock = (type: string) => {
    const newBlock = { 
      id: Math.random().toString(36).substr(2, 9), 
      type, 
      content: type === 'HERO' ? 'Design the Matrix' : 'New Asset Grid Content' 
    };
    const updated = [...activeBlocks, newBlock];
    setActiveBlocks(updated);
    syncWithDatabase(updated);
    setShowSlashMenu(false);
  };

  // Shortcut per il menu "/"
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setMenuPos({ x: rect.left, y: rect.bottom + window.scrollY + 10 });
        setShowSlashMenu(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300" onKeyDown={handleKeyDown} tabIndex={0}>
      
      {/* NAVBAR STATUS */}
      <nav className="fixed top-0 w-full h-14 border-b border-white/5 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded-full" />
          <span className="text-white font-bold text-sm tracking-tighter uppercase">Matrix Canvas</span>
        </div>
        
        <div className="flex items-center gap-4">
          {saveStatus === 'saving' && <span className="flex items-center gap-2 text-[10px] text-blue-400 font-bold"><CloudLightning size={14} className="animate-pulse"/> SAVING...</span>}
          {saveStatus === 'saved' && <span className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold"><CloudCheck size={14}/> CHANGES SYNCED</span>}
          <button className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-tighter">Live Preview</button>
        </div>
      </nav>

      {/* CANVAS EDITOR */}
      <main className="max-w-4xl mx-auto pt-24 pb-40 px-6">
        <div className="space-y-12">
          {activeBlocks.map((block, idx) => (
            <motion.div key={block.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative">
              
              {/* Bottone Elimina */}
              <button 
                onClick={() => {
                  const filtered = activeBlocks.filter((_, i) => i !== idx);
                  setActiveBlocks(filtered);
                  syncWithDatabase(filtered);
                }}
                className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all"
              >
                <Trash2 size={16} />
              </button>

              {/* RENDERER DEI BLOCCHI TAILWIND */}
              {block.type === 'HERO' && (
                <div className="py-12 border-l-2 border-transparent hover:border-blue-500/30 pl-6 transition-all">
                  <EditableText 
                    className="text-7xl font-black text-white leading-none block mb-4" 
                    initialText={block.content} 
                    onSave={(val) => updateBlockData(idx, val)} 
                  />
                  <p className="text-slate-500 text-lg italic">Fai clic sopra per modificare il titolo...</p>
                </div>
              )}

              {block.type === 'STAT' && (
                <div className="grid grid-cols-2 gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase mb-2">Market ROI</p>
                    <EditableText 
                      className="text-4xl font-black text-white" 
                      initialText={block.content} 
                      onSave={(val) => updateBlockData(idx, val)} 
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* INDICATORE NOTION-STYLE */}
          <div className="pt-20 border-t border-white/5 opacity-20 hover:opacity-100 transition-opacity">
            <p className="text-sm font-mono flex items-center gap-2">
              <Command size={14} /> Premi <span className="bg-white text-black px-1 rounded text-[10px] font-bold">/</span> per iniettare blocchi Tailwind
            </p>
          </div>
        </div>
      </main>

      {/* SLASH MENU */}
      <AnimatePresence>
        {showSlashMenu && (
          <>
            <div className="fixed inset-0 z-[110]" onClick={() => setShowSlashMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ top: menuPos.y, left: menuPos.x }}
              className="fixed z-[120] w-64 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl p-2"
            >
              <button onClick={() => addBlock('HERO')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-600 rounded-xl transition-all group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/20"><Layout size={16}/></div>
                <div className="text-left"><p className="text-xs font-bold text-white leading-none">Hero Header</p><p className="text-[10px] text-slate-500 mt-1">Titolo Bold Premium</p></div>
              </button>
              <button onClick={() => addBlock('STAT')} className="w-full flex items-center gap-3 p-3 

              "use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Layout, Trash2, Command, CloudCheck, CloudLightning, TrendingUp, Table, Wallet as WalletIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- ATOMI EDITABILI ---
const EditableText = ({ initialText, onSave, className }: { initialText: string, onSave: (val: string) => void, className: string }) => {
  return (
    <span 
      contentEditable 
      suppressContentEditableWarning 
      onBlur={(e) => onSave(e.currentTarget.textContent || "")}
      className={`${className} outline-none focus:ring-1 focus:ring-blue-500/30 rounded px-1 transition-all`}
    >
      {initialText}
    </span>
  );
};

export default function MatrixProBuilder() {
  const [activeBlocks, setActiveBlocks] = useState<any[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [assets, setAssets] = useState<any[]>([]);

  // Caricamento Dati
  useEffect(() => {
    async function init() {
      // 1. Carica Layout
      const { data: pageData } = await supabase.from('nodes').select('ui_schema').eq('slug', 'home').single();
      if (pageData?.ui_schema?.blocks) setActiveBlocks(pageData.ui_schema.blocks);
      
      // 2. Carica Asset per la tabella intelligente
      const { data: assetData } = await supabase.from('nodes').select('*').eq('node_type', 'asset');
      if (assetData) setAssets(assetData);
    }
    init();
  }, []);

  const sync = async (blocks: any[]) => {
    setSaveStatus('saving');
    await supabase.from('nodes').update({ ui_schema: { blocks } }).eq('slug', 'home');
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const addBlock = (type: string) => {
    const newBlock = { id: Math.random().toString(36).substr(2, 9), type, props: {} };
    const updated = [...activeBlocks, newBlock];
    setActiveBlocks(updated);
    sync(updated);
    setShowSlashMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      const selection = window.getSelection();
      if (selection) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setMenuPos({ x: rect.left, y: rect.bottom + window.scrollY + 10 });
        setShowSlashMenu(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 selection:bg-blue-500/30" onKeyDown={handleKeyDown} tabIndex={0}>
      
      {/* HEADER STATUS */}
      <nav className="fixed top-0 w-full h-14 border-b border-white/5 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-white font-black text-xs uppercase tracking-widest">Archeos Matrix OS</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold">
          {saveStatus === 'saving' && <span className="text-blue-500">SYNCING TO CLOUD...</span>}
          {saveStatus === 'saved' && <span className="text-emerald-500">DATABASE READY</span>}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-32 pb-64 px-6">
        <div className="space-y-16">
          {activeBlocks.map((block, idx) => (
            <div key={block.id} className="relative group">
              <button onClick={() => {const f = activeBlocks.filter((_, i) => i !== idx); setActiveBlocks(f); sync(f);}} className="absolute -left-12 opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
              
              {/* 1. MODULO TRADING VIEW STYLE */}
              {block.type === 'CHART' && (
                <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-white font-bold text-xl tracking-tighter">Market Analysis</h3>
                      <p className="text-xs text-slate-500">Real-time asset performance</p>
                    </div>
                    <TrendingUp className="text-blue-500" />
                  </div>
                  <div className="h-64 w-full bg-gradient-to-t from-blue-500/5 to-transparent border-b border-blue-500/20 flex items-end gap-1 px-2">
                    {[40, 70, 45, 90, 65, 80, 30, 100, 50].map((h, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-blue-600/20 rounded-t-sm" />
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SMART ASSET TABLE */}
              {block.type === 'TABLE' && (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2"><Table size={18} className="text-blue-500"/> Asset Inventory</h3>
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                        <tr><th className="p-4">Asset</th><th className="p-4">Type</th><th className="p-4 text-right">Value</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {assets.map(a => (
                          <tr key={a.id} className="hover:bg-white/[0.02]">
                            <td className="p-4 font-bold text-white">{a.slug}</td>
                            <td className="p-4 uppercase text-[10px]">{a.node_type}</td>
                            <td className="p-4 text-right font-mono text-emerald-500">{a.data_content?.price || '0.00'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. LIVE WALLET */}
              {block.type === 'WALLET' && (
                <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/40 flex justify-between items-center">
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Available Balance</p>
                    <h2 className="text-5xl font-black italic tracking-tighter">12.450,00 TRC</h2>
                  </div>
                  <div className="h-16 w-16 bg-white/20 rounded-3xl flex items-center justify-center">
                    <WalletIcon size={32} />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-20 border-t border-white/5 flex items-center gap-3 text-slate-700">
            <Command size={16} /> <span>Premi <kbd className="bg-white/5 px-2 py-0.5 rounded text-white text-xs">/</kbd> per aggiungere i muscoli della Matrice</span>
          </div>
        </div>
      </main>

      {/* SLASH MENU */}
      <AnimatePresence>
        {showSlashMenu && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ top: menuPos.y, left: menuPos.x }} className="fixed z-[120] w-64 bg-[#111] border border-white/10 rounded-2xl p-2 shadow-3xl backdrop-blur-xl">
            <button onClick={() => addBlock('CHART')} className="w-full flex items-center gap-3 p-3 hover:bg-blue-600 rounded-xl transition-all text-left group">
              <TrendingUp className="text-slate-500 group-hover:text-white" size={18}/>
              <div><p className="text-xs font-bold text-white">Trading Chart</p><p className="
