"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Database, Layout, Wallet as WalletIcon, Save } from 'lucide-react';

export default function MatrixBuilder() {
  const [node, setNode] = useState<any>({
    title: "Nuova Pagina Trading",
    ui_schema: { blocks: [] },
    data_content: { balance: "12,450.00", roi: "+15.4%" }
  });

  const addBlock = (type: string) => {
    const newBlock = { 
        id: Date.now(), 
        type, 
        props: { title: "Nuovo Blocco", color: "blue" },
        mapTo: "" // Campo del database a cui collegarsi
    };
    setNode({ ...node, ui_schema: { blocks: [...node.ui_schema.blocks, newBlock] } });
  };

  return (
    <div className="flex h-screen bg-[#020202] text-slate-300">
      {/* Sidebar: Libreria Moduli */}
      <aside className="w-64 border-r border-white/5 bg-[#080808] p-4 space-y-8">
        <div className="font-black text-white italic tracking-tighter text-xl">MATRIX CORE</div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">Moduli UI</p>
          <BuilderBtn icon={<Layout size={14}/>} label="Stat Card" onClick={() => addBlock('stat')} />
          <BuilderBtn icon={<Database size={14}/>} label="Asset Grid" onClick={() => addBlock('grid')} />
          <BuilderBtn icon={<WalletIcon size={14}/>} label="Wallet Widget" onClick={() => addBlock('wallet')} />
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold transition mt-10">
          <Save size={14} /> SALVA NEL DB
        </button>
      </aside>

      {/* Canvas: Il tuo Builder */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <input 
            className="bg-transparent text-5xl font-black text-white outline-none w-full mb-10 placeholder-slate-800"
            placeholder="Titolo Pagina..."
            defaultValue={node.title}
          />

          {node.ui_schema.blocks.map((block: any) => (
            <div key={block.id} className="relative group border border-transparent hover:border-blue-500/50 rounded-2xl transition">
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={16} className="text-slate-600 cursor-pointer" />
              </div>
              <RenderModule type={block.type} data={node.data_content} />
            </div>
          ))}

          {node.ui_schema.blocks.length === 0 && (
            <div className="h-40 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-slate-600 font-medium">
              Trascina un modulo o usa "/" per iniziare
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// IL MOTORE DI RENDERING DEI MODULI
function RenderModule({ type, data }: any) {
  const modules: any = {
    stat: (
      <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
        <p className="text-xs text-slate-500 uppercase font-bold mb-1">ROI Mercato</p>
        <p className="text-3xl font-mono font-black text-emerald-400">{data.roi}</p>
      </div>
    ),
    wallet: (
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-2xl shadow-blue-900/20">
        <p className="text-blue-200 text-xs font-bold uppercase mb-2">Liquidità Interna</p>
        <p className="text-4xl font-mono font-black text-white italic tracking-tighter">{data.balance} TRC</p>
      </div>
    ),
    grid: (
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-white/5 rounded-xl border border-white/5 animate-pulse"></div>
        <div className="h-32 bg-white/5 rounded-xl border border-white/5 animate-pulse"></div>
      </div>
    )
  };
  return modules[type] || null;
}

function BuilderBtn({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-md text-sm transition">
      {icon} <span>{label}</span>
    </button>
  );
}
