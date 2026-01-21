"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inizializzazione Client (si collegherà alle variabili che hai messo su Vercel)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ArcheosMatrixEditor() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ASCOLTO IN TEMPO REALE: Io scrivo nel DB, tu vedi apparire le cose
  useEffect(() => {
    // Caricamento iniziale
    const fetchBlocks = async () => {
      const { data } = await supabase.from('blocks').select('*').order('order_index');
      if (data) setBlocks(data);
      setLoading(false);
    };
    fetchBlocks();

    // Sottoscrizione ai cambiamenti (Realtime)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocks' }, (payload) => {
        fetchBlocks(); // Ricarica quando io (AI) faccio una modifica
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#efefef] p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-16 border-b border-zinc-800 pb-6">
          <h1 className="text-2xl font-black tracking-tighter">ARCHEOS MATRIX <span className="text-zinc-600">v0.3.0</span></h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">AI Managed Space</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="animate-pulse text-zinc-700">Inizializzazione flussi...</div>
        ) : (
          <div className="space-y-6">
            {blocks.length === 0 && (
              <p className="text-zinc-600 italic">L'editor è vuoto. In attesa di input dall'operatore AI...</p>
            )}
            {blocks.map((block) => (
              <div key={block.id} className="group relative">
                {block.type === 'h1' && <h1 className="text-5xl font-bold mb-4 outline-none">{block.content}</h1>}
                {block.type === 'text' && <p className="text-xl leading-relaxed text-zinc-300 outline-none">{block.content}</p>}
                {block.type === 'kanban' && <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg"> [Modulo Kanban Attivo] </div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
