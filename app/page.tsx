"use client";
import React, { useState, useEffect } from 'react';

export default function NotionEditor() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Pronto');

  // Simulazione Salvataggio Automatico (quello che permette a me di scriverti dentro)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (content) {
        setStatus('Salvataggio...');
        // Qui collegheremo il push su Supabase
        setTimeout(() => setStatus('Sincronizzato'), 500);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [content]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#efefef] p-4 md:p-20 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-1 bg-zinc-800 rounded text-zinc-400">v0.2.0</span>
            <span className="text-xs text-zinc-500">{status}</span>
          </div>
          <div className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Archeos Matrix Editor</div>
        </div>

        <input 
          type="text" 
          placeholder="Titolo della Pagina" 
          className="w-full bg-transparent text-5xl font-black outline-none mb-6 placeholder-zinc-800 tracking-tighter"
        />

        <textarea
          className="w-full h-[60vh] bg-transparent text-xl leading-relaxed outline-none resize-none placeholder-zinc-800"
          placeholder="Inizia a scrivere o digita '/' per i comandi..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="fixed bottom-10 right-10">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl">
            <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">AI Agent Status</p>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Pronto a generare blocchi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
