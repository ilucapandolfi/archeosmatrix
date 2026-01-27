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
