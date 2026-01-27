// app/builder/page.tsx
"use client";
import React, { useState } from 'react';
import { Plus, Layout, Type, CreditCard, Database, Settings } from 'lucide-react';

export default function CMSBuilder() {
  const [blocks, setBlocks] = useState<any[]>([]); // La tua pagina dinamica

  const addBlock = (type: string) => {
    const newBlock = { id: Date.now(), type, content: {} };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar dei Blocchi (Stile Notion/Webflow) */}
      <aside className="w-72 border-r border-white/5 bg-[#0A0A0A] p-4 flex flex-col">
        <div className="mb-8 font-bold text-blue-500 uppercase tracking-tighter text-sm">Component Library</div>
        
        <div className="space-y-2">
          <BlockButton icon={<Layout size={16}/>} label="Market Grid" onClick={() => addBlock('grid')} />
          <BlockButton icon={<CreditCard size={16}/>} label="Wallet Widget" onClick={() => addBlock('wallet')} />
          <BlockButton icon={<Type size={16}/>} label="Rich Text Area" onClick={() => addBlock('text')} />
          <BlockButton icon={<Database size={16}/>} label="Asset Property List" onClick={() => addBlock('properties')} />
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-slate-500 uppercase font-bold">
          Stato: Editing Mode
        </div>
      </aside>

      {/* Main Canvas (La tua Pagina) */}
      <main className="flex-1 overflow-y-auto p-12 bg-black flex justify-center">
        <div className="max-w-4xl w-full space-y-8">
          {blocks.length === 0 && (
            <div className="border-2 border-dashed border-white/5 rounded-3xl h-64 flex flex-col items-center justify-center text-slate-600">
               <Plus size={32} className="mb-2" />
               <p>Clicca un blocco per iniziare a costruire</p>
            </div>
          )}
          
          {blocks.map((block) => (
            <RenderBlock key={block.id} block={block} />
          ))}
        </div>
      </main>

      {/* Pannello Proprietà (Modifica Campi) */}
      <aside className="w-64 border-l border-white/5 bg-[#0A0A0A] p-4 hidden xl:block">
        <div className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
          <Settings size={14} /> Properties
        </div>
        <p className="text-[11px] text-slate-600 italic">Seleziona un blocco per modificare le sue proprietà dinamiche.</p>
      </aside>
    </div>
  );
}

// Funzione di rendering dinamico dei blocchi Tailwind
function RenderBlock({ block }: any) {
  if (block.type === 'grid') return <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10 italic text-slate-400">Grid Layout Placeholder</div>;
  if (block.type === 'wallet') return <div className="p-8 bg-blue-600 rounded-3xl font-mono text-3xl font-bold">12.450,00 TRC</div>;
  if (block.type === 'text') return <h1 className="text-4xl font-bold outline-none focus:ring-1 focus:ring-blue-500 p-2" contentEditable>Titolo della Pagina...</h1>;
  return null;
}

function BlockButton({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-white/5 text-sm text-slate-400 hover:text-white">
      {icon} {label}
    </button>
  );
}
