"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Network, Type, MousePointer2, Settings, 
  ChevronRight, Globe, Plus, Box, Layout 
} from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ArcheosUltimateCore() {
  const [view, setView] = useState<'editor' | 'architect'>('editor');
  const [pages, setPages] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: pData } = await supabase.from('pages').select('*');
      if (pData) {
        setPages(pData);
        setActivePage(pData[0]);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (activePage) {
      const fetchBlocks = async () => {
        const { data } = await supabase.from('blocks').select('*').eq('page_id', activePage.id).order('order_index');
        if (data) setBlocks(data);
      };
      fetchBlocks();
    }
  }, [activePage]);

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#f4f4f5] flex overflow-hidden font-sans">
      
      {/* SIDEBAR: Notion-Style Navigation */}
      <aside className="w-64 border-r border-zinc-800/50 bg-[#09090b] flex flex-col z-50">
        <div className="p-4 flex items-center gap-3 border-b border-zinc-800/50">
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center font-black text-black text-[10px]">A</div>
          <span className="font-bold tracking-tighter text-sm uppercase">Archeos Matrix</span>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          <div className="text-[10px] font-bold text-zinc-600 px-3 py-2 uppercase tracking-widest">Insiemi</div>
          {pages.map(p => (
            <button 
              key={p.id} 
              onClick={() => { setActivePage(p); setView('editor'); }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${activePage?.id === p.id ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <ChevronRight size={14} /> {p.title}
            </button>
          ))}
          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-600 hover:text-zinc-400 text-sm mt-4 italic">
            <Plus size={14} /> Aggiungi Insieme
          </button>
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col relative">
        
        {/* TOP COMMAND BAR */}
        <header className="h-14 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md">
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button onClick={() => setView('editor')} className={`flex items-center gap-2 px-4 py-1 rounded-md text-xs font-bold transition-all ${view === 'editor' ? 'bg-zinc-800 text-green-400' : 'text-zinc-500'}`}>
              <Type size={14}/> EDITOR
            </button>
            <button onClick={() => setView('architect')} className={`flex items-center gap-2 px-4 py-1 rounded-md text-xs font-bold transition-all ${view === 'architect' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500'}`}>
              <Network size={14}/> ARCHITECT (MAP)
            </button>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-zinc-500 hover:text-white transition-colors"><Settings size={18}/></button>
             <button className="bg-white text-black px-4 py-1.5 rounded-md text-xs font-black flex items-center gap-2">
                <Globe size={14}/> PUBLISH
             </button>
          </div>
        </header>

        <main className="flex-1 relative overflow-auto">
          {view === 'editor' ? (
            /* EDITOR MODE */
            <div className="max-w-3xl mx-auto py-20 px-6 animate-in fade-in duration-700">
              <h1 className="text-6xl font-black tracking-tighter mb-12" contentEditable>{activePage?.title}</h1>
              <div className="space-y-6">
                {blocks.map(b => (
                  <div key={b.id} className="text-xl text-zinc-400 leading-relaxed outline-none" contentEditable>
                    {b.content}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ARCHITECT MODE: Mind-Mapping della struttura */
            <div className="h-full w-full bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:40px_40px] flex items-center justify-center p-20 animate-in zoom-in-95 duration-500">
              <div className="relative w-full h-full">
                {pages.map((p, i) => (
                  <div 
                    key={p.id}
                    style={{ left: `${150 + (i * 280)}px`, top: `${100 + (Math.sin(i) * 100)}px` }}
                    onClick={() => { setActivePage(p); setView('editor'); }}
                    className="absolute group cursor-pointer"
                  >
                    {/* Linee di connessione (Simulate) */}
                    {i > 0 && <div className="absolute right-full top-1/2 w-[100px] h-[1px] bg-zinc-800 -translate-y-1/2 -z-10" />}
                    
                    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl w-56 group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all">
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Insieme</div>
                      <div className="font-bold text-zinc-200">{p.title}</div>
                      <div className="mt-4 flex gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
