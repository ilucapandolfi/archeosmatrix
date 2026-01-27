"use client";
import React, { useState } from 'react';
import { motion, Reorder } from "framer-motion"; // Per animazioni fluide stile Framer
import { Plus, Layout, Type, Image as ImageIcon, CreditCard, Save, Eye, Layers } from 'lucide-react';

// --- LIBRERIA COMPONENTI TAILWIND (I NOSTRI BLOCCHI) ---
const UI_LIBRARY = {
  hero: {
    label: "Hero Section",
    render: () => (
      <section className="py-20 px-10 bg-gradient-to-b from-blue-900/20 to-black border border-white/5 rounded-3xl mb-6">
        <h1 className="text-6xl font-black tracking-tighter text-white mb-4">Trading di Prossima Generazione</h1>
        <p className="text-slate-400 text-xl max-w-2xl">Gestisci asset fisici con la velocità del digitale. Benvenuto nella Matrice.</p>
        <button className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-blue-900/20">Inizia Ora</button>
      </section>
    )
  },
  stats: {
    label: "Market Stats",
    render: () => (
      <div className="grid grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-8 bg-[#0A0A0A] border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">ROI Medio</p>
            <p className="text-4xl font-black text-white">+18.4%</p>
          </div>
        ))}
      </div>
    )
  },
  card: {
    label: "Asset Card",
    render: () => (
      <div className="max-w-sm bg-[#0D0D0D] border border-white/10 rounded-[2rem] overflow-hidden group mb-6">
        <div className="h-48 bg-slate-800 animate-pulse group-hover:scale-105 transition-transform duration-500"></div>
        <div className="p-6">
            <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold uppercase">Automotive</span>
            <h3 className="text-xl font-bold text-white mt-4">Ford Focus 2022</h3>
            <p className="text-slate-500 text-sm mt-2">Lotto #4421 - Disponibile per Swap</p>
            <div className="flex justify-between items-end mt-6">
                <span className="text-2xl font-mono font-bold text-white">18.400€</span>
                <span className="text-emerald-500 font-bold text-sm">+5.2% YoY</span>
            </div>
        </div>
      </div>
    )
  }
};

export default function MatrixFramerBuilder() {
  const [activeBlocks, setActiveBlocks] = useState<string[]>([]);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="min-h-screen bg-black text-slate-300 flex">
      
      {/* SIDEBAR: IL CATALOGO BLOCCHI (STILE FRAMER) */}
      {mode === 'edit' && (
        <aside className="w-80 border-r border-white/5 bg-[#050505] p-6 flex flex-col fixed h-full z-50">
          <div className="flex items-center gap-2 mb-10">
            <div className="h-6 w-6 bg-white rounded-full"></div>
            <span className="text-white font-black tracking-tighter text-lg uppercase">Archeos Matrix</span>
          </div>

          <p className="text-[10px] font-bold text-slate-600 uppercase mb-4 tracking-widest">Componenti Gratuiti</p>
          <div className="space-y-3">
            {Object.entries(UI_LIBRARY).map(([key, value]) => (
              <button 
                key={key}
                onClick={() => setActiveBlocks([...activeBlocks, key])}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                    <Layers size={18} className="text-slate-500 group-hover:text-blue-500" />
                    <span className="text-sm font-medium text-slate-400 group-hover:text-white">{value.label}</span>
                </div>
                <Plus size={14} />
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-blue-900/40">
                <Save size={18} /> Pubblica
            </button>
          </div>
        </aside>
      )}

      {/* CANVAS: L'AREA DI DISEGNO */}
      <main className={`flex-1 transition-all duration-500 ${mode === 'edit' ? 'ml-80' : 'ml-0'}`}>
        
        {/* Toolbar Superiore */}
        <div className="h-16 flex items-center justify-center gap-4 sticky top-0 z-40 bg-black/50 backdrop-blur-md">
            <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
                <button onClick={() => setMode('edit')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${mode === 'edit' ? 'bg-white text-black' : 'text-slate-400'}`}>Editor</button>
                <button onClick={() => setMode('preview')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${mode === 'preview' ? 'bg-white text-black' : 'text-slate-400'}`}>Preview</button>
            </div>
        </div>

        <div className={`max-w-6xl mx-auto p-12 transition-all ${mode === 'edit' ? 'scale-[0.98] border-2 border-dashed border-white/5 rounded-[3rem]' : 'scale-100'}`}>
            {activeBlocks.length === 0 && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-slate-700">
                    <Layout size={64} strokeWidth={1} className="mb-4" />
                    <p className="text-xl font-medium">Il tuo Canvas è vuoto</p>
                    <p className="text-sm">Aggiungi componenti dalla sidebar per iniziare</p>
                </div>
            )}

            <Reorder.Group axis="y" values={activeBlocks} onReorder={setActiveBlocks}>
                {activeBlocks.map((blockKey, index) => (
                    <Reorder.Item key={`${blockKey}-${index}`} value={blockKey}>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group"
                        >
                            {mode === 'edit' && (
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/10 p-2 rounded-full cursor-grab active:cursor-grabbing">
                                        <Layers size={14} />
                                    </div>
                                </div>
                            )}
                            {(UI_LIBRARY as any)[blockKey].render()}
                        </motion.div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
      </main>
    </div>
  );
}
