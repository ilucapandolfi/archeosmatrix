"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ArcheosEngine() {
  const [blocks, setBlocks] = useState<any[]>([]);

  const fetchBlocks = async () => {
    const { data } = await supabase.from('blocks').select('*').order('order_index');
    if (data) setBlocks(data);
  };

  useEffect(() => {
    fetchBlocks();
    const channel = supabase.channel('matrix_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocks' }, () => {
        fetchBlocks();
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#efefef] p-12 md:p-24 selection:bg-green-500/30 font-sans">
      <div className="max-w-4xl mx-auto">
        {blocks.map((block) => (
          <div key={block.id} className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {block.type === 'h1' && (
              <h1 className="text-6xl font-black tracking-tighter mb-4">{block.content}</h1>
            )}
            {block.type === 'text' && (
              <p className="text-xl leading-relaxed text-zinc-400 border-l-2 border-zinc-800 pl-6 italic">
                {block.content}
              </p>
            )}
            {block.type === 'kanban' && (
              <div className="mt-10 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Brokerage Pipeline Active</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['Inbound', 'Negotiation', 'Closed'].map(col => (
                    <div key={col} className="h-32 bg-zinc-950/50 rounded-xl border border-zinc-800/50 p-4 border-dashed flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-zinc-700 uppercase">{col}</span>
                      <div className="text-[10px] text-zinc-800 font-mono">Ready for data...</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="h-[50vh] flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
             <p className="text-zinc-600 font-mono text-sm tracking-widest">AWAITING AI INJECTION...</p>
          </div>
        )}
      </div>
    </div>
  );
}
