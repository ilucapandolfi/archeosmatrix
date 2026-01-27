"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  ExternalLink,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';

export default function AdminBackend() {
  const [view, setView] = useState('assets'); // asset, users, pages
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex h-screen bg-[#050505] text-slate-300 font-sans">
      
      {/* SIDEBAR DI NAVIGAZIONE BACKEND */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">M</div>
          <span className="text-white font-bold tracking-tighter">MATRIX ADMIN</span>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={view === 'dash'} onClick={() => setView('dash')} />
          <NavItem icon={<Package size={18}/>} label="Asset Merceologici" active={view === 'assets'} onClick={() => setView('assets')} />
          <NavItem icon={<Users size={18}/>} label="Gestione Trader" active={view === 'users'} onClick={() => setView('users')} />
          <NavItem icon={<Settings size={18}/>} label="Configurazione Core" active={view === 'config'} onClick={() => setView('config')} />
        </nav>

        <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-auto text-[11px]">
          <p className="text-slate-500 uppercase font-bold mb-2">Stato Sistema</p>
          <div className="flex items-center gap-2 text-emerald-500">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Connected to Supabase
          </div>
        </div>
      </aside>

      {/* AREA DI LAVORO CENTRALE */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header con Azioni Rapide */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-96">
            <Search size={16} className="text-slate-500" />
            <input className="bg-transparent border-none outline-none text-sm w-full" placeholder="Cerca nodi, slug o contratti..." />
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} /> NUOVO OGGETTO
          </button>
        </header>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">{view}</h1>
              <p className="text-slate-500 text-sm">Gestisci i dati della matrice in tempo reale</p>
            </div>
          </div>

          {/* TABELLA DATI (SIMILE A NOTION/AIRTABLE) */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-slate-500 border-b border-white/5 uppercase text-[10px] font-bold tracking-widest">
                  <th className="p-4">Slug / Nome</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">ROI</th>
                  <th className="p-4">Valore</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <DataRow name="Ford Focus 2022" slug="ford-focus-red" type="Asset" roi="+15.4%" value="18.400€" status="Active" />
                <DataRow name="iPhone 17 Pro" slug="ip17-pro-256" type="Asset" roi="+18.2%" value="1.149€" status="Active" />
                <DataRow name="Trader_Luca" slug="user-001" type="User" roi="-" value="12.450 TRC" status="Premium" />
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* SIDEBAR DI EDITING (MODALE LATERALE) */}
      {isEditing && (
        <aside className="w-[400px] border-l border-white/10 bg-[#0D0D0D] p-8 overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-white">Modifica Nodo</h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Nome Oggetto</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none" defaultValue="Ford Focus 2022" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">ROI %</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-emerald-400 font-mono outline-none" defaultValue="15.4" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Prezzo (€)</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono outline-none" defaultValue="18400" />
              </div>
            </div>

            <div className="space-y-2 pt-6 border-t border-white/5">
              <label className="text-xs font-bold text-slate-500 uppercase">JSON Data Content (Avanzato)</label>
              <pre className="text-[10px] bg-black p-4 rounded-lg text-blue-400 overflow-x-auto border border-white/5">
                {`{
  "color": "Red",
  "km": 42000,
  "fuel": "Diesel",
  "dealer": "Metro IT"
}`}
              </pre>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition shadow-xl shadow-blue-900/30">
              SALVA MODIFICHE
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-medium text-sm ${active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
    >
      {icon} {label}
    </button>
  );
}

function DataRow({ name, slug, type, roi, value, status }: any) {
  return (
    <tr className="hover:bg-white/[0.02] transition group cursor-pointer">
      <td className="p-4">
        <div className="text-white font-bold">{name}</div>
        <div className="text-[10px] font-mono text-slate-600">{slug}</div>
      </td>
      <td className="p-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">{type}</td>
      <td className="p-4 font-mono text-emerald-500 font-bold">{roi}</td>
      <td className="p-4 font-mono text-white">{value}</td>
      <td className="p-4">
        <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-400 font-bold">{status}</span>
      </td>
      <td className="p-4 text-right">
        <button className="p-2 hover:bg-white/10 rounded-lg transition opacity-0 group-hover:opacity-100">
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  );
}
