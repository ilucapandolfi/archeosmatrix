"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Layout, Type, Image as ImageIcon, Maximize2, Trash2, Command } from 'lucide-react';

// --- ATOMI EDITABILI (Il cuore del sistema) ---
const EditableText = ({ initialText, className }: { initialText: string, className: string }) => (
  <span 
    contentEditable 
    suppressContentEditableWarning 
    className={`${className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 transition-all`}
  >
    {initialText}
  </span>
);

// --- LIBRERIA COMPONENTI TAILWIND PREMIUM ---
const BLOCKS: any = {
  HERO_MODERN: {
    label: "Hero Section Premium",
    render: () => (
      <section className="relative py-24 px-12 bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden group mb-8">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="relative z-10">
          <div className="mb-6 inline-block px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full">
            <EditableText initialText="NEW RELEASES 2026" className="text-blue-500 text-[10px] font-black tracking-widest" />
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6">
            <EditableText initialText="Design the Matrix" className="" />
          </h1>
          <p className="text-slate-500 text-xl max-w-xl leading-relaxed">
            <EditableText initialText="Sincronizza asset reali con precisione digitale. Crea, scambia e gestisci il tuo inventario con la velocità del pensiero." className="" />
          </p>
        </div>
      </section>
    )
  },
  ASSET_GRID: {
    label: "Asset Display Grid",
    render: () => (
      <div className="grid grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 hover:bg-[#0D0D0D] transition-all group">
            <div className="flex justify-between items-start mb-12">
               <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Maximize2 size={20} className="text-white" />
               </div>
               <EditableText initialText="+14.5%" className="text-emerald-500 font-mono font-bold" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
               <EditableText initialText={i === 1 ? "Automotive Hub" : "Tech Futures"} className="" />
            </h3>
            <p className="text-slate-500 text-sm">
               <EditableText initialText="Gestione flussi di cassa e swap asset." className="" />
            </p>
          </div>
        ))}
      </div>
    )
  }
};

export default function NotionFramerBuilder() {
  const [activeBlocks, setActiveBlocks] = useState<string[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  // Gestione Slash Command
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setMenuPos({ x: rect.left, y: rect.bottom + 10 });
        setShowSlashMenu(true);
      }
    } else if (e.key === 'Escape') {
      setShowSlashMenu(false);
    }
  };

  const addBlock = (key: string) => {
    setActiveBlocks([...activeBlocks, key]);
    setShowSlashMenu(false);
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 selection:bg-blue-500/30" onKeyDown={handleKeyDown} tabIndex={0}>
      
      {/* HEADER DI NAVIGAZIONE */}
      <nav className="fixed top-0 w-full h-16 border-b border-white/5 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-sm rotate-45" />
          <span className="text-white font-black tracking-tighter">MATRIX.OS</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Editing Mode</span>
          <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs hover:bg-slate-200 transition">Publish Site</button>
        </div>
      </nav>

      {/* CANVAS PRINCIPALE */}
      <main className="max-w-5xl mx-auto pt-32 pb-64 px-6 min-h-screen">
        <div className="space-y-4">
          {activeBlocks.map((blockKey, idx) => (
            <motion.div 
              key={`${blockKey}-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="absolute -left-16 top-4 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2">
                <button onClick={() => setActiveBlocks(activeBlocks.filter((_, i) => i !== idx))} className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-500 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
              {BLOCKS[blockKey].render()}
            </motion.div>
          ))}

          {/* AREA DI INPUT STILE NOTION */}
          <div className="relative py-10">
            <p className="text-slate-700 text-lg flex items-center gap-2">
              <Command size={18} /> Digita <kbd className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-xs"> / </kbd> per aggiungere componenti Tailwind...
            </p>
          </div>
        </div>
      </main>

      {/* MENU SLASH (MODALE DINAMICO) */}
      <AnimatePresence>
        {showSlashMenu && (
          <>
            <div className="fixed inset-0 z-[110]" onClick={() => setShowSlashMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ top: menuPos.y, left: menuPos.x }}
              className="fixed z-[120] w-72 bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-2 backdrop-blur-xl"
            >
              <p className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inerisci Blocco Tailwind</p>
              {Object.entries(BLOCKS).map(([key, value]: any) => (
                <button 
                  key={key}
                  onClick={() => addBlock(key)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-blue-600 rounded-xl transition-colors group text-left"
                >
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/20">
                    <Layout size={16} className="text-slate-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-none">{value.label
