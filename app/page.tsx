"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Menu, X, Type, Network, Globe, Plus, 
  ChevronRight, MoreHorizontal, Settings
} from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ArcheosSoftware() {
  const [view, setView] = useState<'editor' | 'architect'>('editor');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);

  // Caricamento Pagine e Realtime
  useEffect(() => {
    const fetchData = async () => {
      const { data: pData } = await supabase.from('pages').select('*').order('created_at');
      if (pData && pData.length > 0) {
        setPages(pData);
        if (!activePage) setActivePage(pData[0]);
      }
    };
    fetchData();
  }, [activePage]);

  useEffect(() => {
    if (activePage) {
      const fetchBlocks = async () => {
        const { data } = await supabase.from('blocks').select('*').eq('page_id', activePage.id).order('order_index');
        setBlocks(data || []);
      };
      fetchBlocks();
    }
  }, [activePage]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#f4f4f5] flex flex-col overflow-hidden font-sans select-none">
      
      {/* MOBILE HEADER (Notion Style) */}
      <header className="h-14 border-b border-zinc-800/50 flex items-center justify-between px-4 bg-black/80 backdrop-blur-md z-[100]">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 hover:bg-zinc-800 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-bold text-sm tracking-tight truncate max-w-[150px]">
            {activePage?.title || "Archeos Matrix"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={() => setView(view === 'editor' ? 'architect' : 'editor')} className="p-2 text-zinc-400 hover:text-white">
              {view === 'editor' ? <Network size={18}/> : <Type size={18}/>}
           </button>
           <button className="p-2 text-zinc-400"><MoreHorizontal size={18}/></button>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar} />
      
      <aside className={`fixed left-0 top-0 h-full w-[80%] max-w-[300px] bg-[#09090b] border-r border-zinc-800 z-[100] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xs font-black tracking-widest text-zinc-500 uppercase">Workspace</h2>
        </div>
        <nav className="p-4 space-y-2">
          {pages.map(p => (
            <button 
              key={p.id} 
              onClick={() => { setActivePage(p); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activePage?.id === p.id ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              <div className="w-2 h-2 rounded-full bg-zinc-700" /> {p.title}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-700 text-sm italic">
            <Plus size={16} /> Nuova Pagina
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {view === 'editor' ? (
          <div className="max-w-3xl mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-4xl font-black tracking-tighter mb-8 outline-none" contentEditable suppressContentEditableWarning>
              {activePage?.title}
            </h1>
            <div className="space-y-4">
              {blocks.length > 0 ? blocks.map(b => (
                <div key={b.id} className="text-lg text-zinc-400 leading-relaxed min-h-[1.5em] outline-none hover:bg-zinc-900/50 rounded transition-colors" contentEditable suppressContentEditableWarning>
                  {b.content}
                </div>
              )) : (
                <div className="text-zinc-700 italic">Inizia a scrivere...</div>
              )}
            </div>
          </div>
        ) : (
          /* ARCHITECT VIEW (Touch Optimized) */
          <div className="h-full w-full bg-[#050505] bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:30px_30px] flex items-center justify-center p-10">
             <div className="flex flex-wrap justify-center gap-6 max-w-md">
                {pages.map(p => (
                  <div key={p.id} onClick={() => {setActivePage(p); setView('editor');}} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl w-40 active:scale-95 transition-transform shadow-xl">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg mb-3 flex items-center justify-center">
                      <Layout size={16} className="text-zinc-500"/>
                    </div>
                    <div className="text-xs font-bold text-zinc-200 truncate">{p.title}</div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* BOTTOM ACTION BAR (Mobile) */}
      <footer className="h-12 border-t border-zinc-800/50 bg-black flex items-center justify-around px-6">
          <button className="p-2 text-zinc-500"><Plus size={20}/></button>
          <button className="p-2 text-zinc-500"><Globe size={20}/></button>
          <button className="p-2 text-zinc-500"><Settings size={20}/></button>
      </footer>
    </div>
  );
}
