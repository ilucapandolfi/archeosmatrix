"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Assicurati di avere questo file configurato
import { Save, Plus, Database, Eye, Trash2, RefreshCw } from 'lucide-react';

export default function MatrixEditor() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Carica tutti i nodi dal DB
  async function fetchNodes() {
    setLoading(true);
    const { data, error } = await supabase.from('nodes').select('*').order('updated_at', { ascending: false });
    if (!error) setNodes(data);
    setLoading(false);
  }

  useEffect(() => { fetchNodes(); }, []);

  // 2. Salva le modifiche
  async function saveNode() {
    if (!selectedNode) return;
    const { error } = await supabase
      .from('nodes')
      .update({
        data_content: selectedNode.data_content,
        ui_schema: selectedNode.ui_schema,
        node_type: selectedNode.node_type
      })
      .eq('id', selectedNode.id);
    
    if (!error) {
        alert("Nodo salvato con successo!");
        fetchNodes();
    }
  }

  return (
    <div className="flex h-screen bg-[#020202] text-slate-300 overflow-hidden">
      
      {/* Listato Nodi (Sidebar Sinistra) */}
      <aside className="w-80 border-r border-white/5 bg-[#080808] flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-white font-bold tracking-tighter">NODE EXPLORER</h2>
          <button onClick={fetchNodes} className="p-2 hover:bg-white/5 rounded-full transition">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {nodes.map(node => (
            <button 
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`w-full text-left p-3 rounded-xl border transition ${selectedNode?.id === node.id ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-transparent border-transparent hover:border-white/10'}`}
            >
              <div className="text-xs font-bold uppercase text-blue-400 mb-1">{node.node_type}</div>
              <div className="text-sm font-medium truncate">{node.slug}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">{new Date(node.updated_at).toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
           <button className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
             <Plus size={16} /> CREA NUOVO NODO
           </button>
        </div>
      </aside>

      {/* Pannello Editor (Area Centrale) */}
      <main className="flex-1 p-10 overflow-y-auto">
        {selectedNode ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedNode.slug}</h1>
                    <p className="text-slate-500 font-mono text-xs">{selectedNode.id}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={saveNode} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition">
                        <Save size={18} /> SALVA
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Editor Dati (JSON) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Database size={14}/> Data Content (Dati Mercato)
                    </h3>
                    <textarea 
                        className="w-full h-[400px] bg-black border border-white/5 rounded-2xl p-6 font-mono text-sm text-blue-400 outline-none focus:border-blue-500/50"
                        value={JSON.stringify(selectedNode.data_content, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setSelectedNode({...selectedNode, data_content: parsed});
                            } catch(err) {}
                        }}
                    />
                </div>

                {/* Editor UI (Schema) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Eye size={14}/> UI Schema (Layout Blocchi)
                    </h3>
                    <textarea 
                        className="w-full h-[400px] bg-black border border-white/5 rounded-2xl p-6 font-mono text-sm text-amber-400 outline-none focus:border-amber-500/50"
                        value={JSON.stringify(selectedNode.ui_schema, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setSelectedNode({...selectedNode, ui_schema: parsed});
                            } catch(err) {}
                        }}
                    />
                </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-600 flex-col gap-4">
            <Database size={48} strokeWidth={1} />
            <p>Seleziona un nodo dalla sidebar per iniziare a editare la Matrice</p>
          </div>
        )}
      </main>
    </div>
  );
}
