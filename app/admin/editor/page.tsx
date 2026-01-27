"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Save, 
  Plus, 
  Database, 
  Eye, 
  Trash2, 
  RefreshCw,
  ChevronRight,
  Code
} from 'lucide-react';

export default function MatrixEditor() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving'>('idle');

  // Caricamento dati
  const fetchNodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (!error && data) setNodes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  // Salvataggio
  const saveNode = async () => {
    if (!selectedNode) return;
    setSaveStatus('saving');
    
    const { error } = await supabase
      .from('nodes')
      .update({
        data_content: selectedNode.data_content,
        ui_schema: selectedNode.ui_schema,
        node_type: selectedNode.node_type
      })
      .eq('id', selectedNode.id);
    
    if (!error) {
      setSaveStatus('idle');
      fetchNodes();
    } else {
      alert("Errore durante il salvataggio: " + error.message);
      setSaveStatus('idle');
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-slate-300 overflow-hidden font-sans">
      
      {/* SIDEBAR: EXPLORER */}
      <aside className="w-72 border-r border-white/5 bg-[#080808] flex flex-col">
        <div className="p-6 border-b border-white/5
