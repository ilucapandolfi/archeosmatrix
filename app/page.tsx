export default function Terminal() {
  return (
    <div className="p-8">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Market Terminal</h1>
          <p className="text-slate-500">Scansione real-time dei mercati globali</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase">Potere d'acquisto</div>
          <div className="text-2xl font-mono text-white">12.450,00 <span className="text-blue-500 text-sm">TRC</span></div>
        </div>
      </header>

      {/* Market Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Card Asset - Esempio Ford Focus */}
        <AssetCard 
          name="Ford Focus 2022" 
          tags={["Auto", "Wholesale"]} 
          price="18.400€" 
          roi="+15.4%" 
          contention="0.4"
          link="https://www.mobile.de/it/veicolo/ford+focus+2022"
        />
        <AssetCard 
          name="iPhone 17 Pro 256GB" 
          tags={["Tech", "Retail"]} 
          price="1.149€" 
          roi="+18.2%" 
          contention="0.9"
          link="https://www.amazon.it/dp/B0..."
        />
        <AssetCard 
          name="Lotto AirPods Max (10pz)" 
          tags={["Tech", "Futures"]} 
          price="4.200€" 
          roi="+22.1%" 
          contention="0.2"
          link="#"
        />
      </div>
      
      {/* Trading History - Bloomberg Style */}
      <section className="mt-12 bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex justify-between">
          <span className="text-xs font-bold uppercase tracking-widest">News & Anomalie di Mercato</span>
          <span className="text-xs text-blue-500 font-mono italic underline">Live Feed</span>
        </div>
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex gap-4 border-l-2 border-emerald-500 pl-4">
            <span className="text-slate-500">[21:44]</span>
            <span className="text-white">FLASH SALE:</span>
            <span className="text-slate-400 text-xs">Prezzo iPhone 17 Pro su Amazon DE sceso a 1.090€. Arbitraggio attivabile.</span>
          </div>
          <div className="flex gap-4 border-l-2 border-blue-500 pl-4">
            <span className="text-slate-500">[21:30]</span>
            <span className="text-white">FUTURE SETTLED:</span>
            <span className="text-slate-400 text-xs">Utente #842 ha chiuso posizione su Lotto Ford Focus (+2.400€ Net).</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function AssetCard({ name, tags, price, roi, contention, link }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full uppercase font-bold tracking-tighter">{t}</span>)}
        </div>
        <div className="text-emerald-400 font-bold text-xl">{roi}</div>
      </div>
      <h2 className="text-white font-bold text-lg mb-1">{name}</h2>
      <div className="text-2xl font-mono text-white mb-6">{price}</div>
      
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">APRI FUTURE</button>
        <a href={link} target="_blank" className="bg-slate-800 text-center text-slate-300 font-bold py-2 rounded-lg text-sm hover:bg-slate-700 transition">ANALISI</a>
      </div>
      <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 uppercase">
        <span>Contention Rate</span>
        <div className="flex gap-1">
           <div className={`h-1.5 w-8 rounded ${parseFloat(contention) > 0.7 ? 'bg-red-500' : 'bg-blue-500'}`}></div>
           <span className="font-mono">{contention}</span>
        </div>
      </div>
    </div>
  );
}
