"use client";
import React, { useState } from 'react';
import { LayoutGrid, BrainCircuit, Landmark, Plus } from 'lucide-react';

export default function ArcheosDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const modules = [
    { id: 'logistica', title: 'Logistica & Delivery', icon: <LayoutGrid className="w-5 h-5" />, color: 'text-blue-400' },
    { id: 'intelligence', title: 'Intelligence Engine', icon: <BrainCircuit className="w-5 h-5" />, color: 'text-purple-400' },
    { id: 'brokeraggio', title: 'Sales & Brokeraggio', icon: <Landmark className="w-5 h-5" />, color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-2">ARCHEOS MATRIX <span className="text-sm font-mono text-zinc-500">v0.1.2</span></h1>
        <p className="text-zinc-400 font-medium">Benvenuto Architetto. I sistemi sono nominali.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <button 
            key={mod.id}
            onClick={() => alert(`Inizializzazione modulo ${mod.title}...`)}
            className="group p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left"
          >
            <div className={`mb-4 ${mod.color}`}>{mod.icon}</div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">{mod.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Gestione flussi e automazione dati per {mod.id}.</p>
            <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">
              Apri Modulo <Plus className="ml-2 w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      <section className="mt-12 p-8 rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center">
        <div className="text-zinc-600 mb-4 font-mono text-xs uppercase tracking-widest font-bold italic">Deep Intelligence Feed</div>
        <p className="text-zinc-500 max-w-md italic">"I dati sono la nuova materia prima. La matrice è lo stampo."</p>
      </section>
    </div>
  );
}
