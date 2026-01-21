"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- MODULI RIUTILIZZABILI ---
const KanbanModule = ({ data }: any) => (
  <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 my-4">
    <h3 className="text-zinc-500 text-xs font-bold uppercase mb-4 tracking-widest">Brokerage Pipeline</h3>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {['Lead', 'Negoziazione', 'Chiuso'].map(col => (
        <div key={col} className="min-w-[200px] p-3 bg-zinc-950 rounded border border-zinc-800/50">
          <span className="text-[10px] font-bold text-zinc-600">{col}</span>
        </div>
      ))}
    </div>
  </div>
);

const TextModule = ({ content }: any) => (
  <p className="text-xl leading-relaxed text-zinc-300 my-4 outline-none hover:bg-zinc-800/20 transition-colors p-2 rounded">
    {content}
  </p>
);

const HeadingModule = ({ content }: any) => (
  <h1 className="text-5xl font-black tracking-tighter my-8 hover:text-white transition-colors cursor-text">
    {content}
  </h1>
);

// --- MAIN ENGINE ---
export default function ArcheosEngine() {
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      const { data } = await supabase.from('blocks').select('*').order('order_index');
      if (data) setBlocks(data);

      supabase.channel('matrix_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'blocks' }, () => {
          fetchAndSubscribe();
        }).subscribe();
    };
    fetchAndSubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#efefef] p-6 md:p-24 selection:bg-green-500/30">
      <div className="max-w-4xl mx-auto">
        {blocks.map((block) => {
          switch (block.type) {
            case 'h1': return <HeadingModule key={block.id} content={block.content} />;
            case 'text': return <TextModule key={block.id} content={block.content} />;
            case 'kanban': return <KanbanModule key={block.id} data={block.settings} />;
            default: return null;
          }
        })}
        {blocks.length === 0 && (
          <div className="opacity-20 font-mono text-sm">ARCHEOS MATRIX: Awaiting initial injection...</div>
        )}
      </div>
    </div>
  );
}
