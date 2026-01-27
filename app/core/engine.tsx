"use client";
import React from 'react';
import { ArrowUpRight, Wallet, Package, Zap } from 'lucide-react';

// Questa è la mappa dei componenti che il tuo CMS può renderizzare
const ComponentMap: any = {
  stat: ({ data, props }: any) => (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
      <p className="text-xs text-slate-500 uppercase font-bold mb-1">{props.title || 'Dato'}</p>
      <p className="text-3xl font-mono font-black text-emerald-400">{data || '0.00'}</p>
    </div>
  ),
  wallet: ({ data }: any) => (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-2xl shadow-blue-900/20">
      <div className="flex justify-between items-start mb-4">
        <Wallet className="text-blue-200" size={24} />
        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold uppercase">Live Credits</span>
      </div>
      <p className="text-4xl font-mono font-black text-white italic tracking-tighter">{data || '0.00'} TRC</p>
    </div>
  ),
  asset_card: ({ data, props }: any) => (
    <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl hover:border-blue-500/30 transition-all">
      <div className="flex justify-between mb-4">
        <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">{props.category}</span>
        <ArrowUpRight className="text-blue-500" size={18} />
      </div>
      <h3 className="text-white font-bold text-lg">{props.name}</h3>
      <div className="text-2xl font-mono text-white mt-2">{data}</div>
    </div>
  )
};

export function MatrixRenderer({ node }: { node: any }) {
  if (!node?.ui_schema?.blocks) return <div className="text-slate-500">Nessuna struttura UI definita per questo nodo.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {node.ui_schema.blocks.map((block: any) => {
        const SelectedComponent = ComponentMap[block.type];
        if (!SelectedComponent) return null;

        // Estraiamo il dato dinamico se mappato
        const dynamicValue = block.mapToField ? node.data_content[block.mapToField] : null;

        return (
          <div key={block.id} className={block.props?.className || ""}>
            <SelectedComponent 
              props={block.props} 
              data={dynamicValue} 
            />
          </div>
        );
      })}
    </div>
  );
}
