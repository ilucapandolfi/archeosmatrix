import { ArrowUpRight, BarChart3, Wallet, Clock, Zap } from "lucide-react";

export default function ProDashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300">
      {/* Top Bar Sottile */}
      <div className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="text-white font-bold tracking-tighter text-lg">ARCHEOS<span className="text-blue-500">MATRIX</span></span>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="text-white">Terminal</a>
              <a href="#" className="hover:text-white transition">Futures</a>
              <a href="#" className="hover:text-white transition">Analytics</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase text-slate-500 font-bold leading-none">Net Liquidity</span>
                <span className="text-emerald-400 font-mono font-bold">12,450.00 TRC</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/20"></div>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* Market Pulse (Ticker) */}
        <div className="flex gap-4 overflow-hidden py-2 border-b border-white/5 whitespace-nowrap">
           <TickerItem label="IPHONE 17P" value="1.149€" change="+1.2%" />
           <TickerItem label="FORD FOCUS" value="18.400€" change="-0.4%" />
           <TickerItem label="PS5 PRO" value="799€" change="+5.7%" />
           <TickerItem label="MACBOOK M4" value="2.450€" change="0.0%" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          
          {/* Colonna Sinistra: Monitoraggio Mercato */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Live Arbitrage Opportunities</h2>
                <div className="flex gap-2">
                    <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10 transition">Export CSV</button>
                    <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md font-bold transition">New Trade</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernAssetCard 
                    name="Ford Focus 2022" 
                    price="18,400€" 
                    roi="15.4%" 
                    type="Wholesale" 
                    provider="Metro IT" 
                    status="Buy" 
                />
                <ModernAssetCard 
                    name="iPhone 17 Pro 256GB" 
                    price="1,149€" 
                    roi="18.2%" 
                    type="Retail" 
                    provider="Amazon IT" 
                    status="Active" 
                />
            </div>

            {/* Trading Journal / Logs */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-bold uppercase tracking-wider">
                    <Clock size={14} /> 
                    <span>Activity Feed</span>
                </div>
                <div className="space-y-4">
                    <ActivityRow time="22:15" msg="Bot #04 detected price drop on PS5 Pro (eBay IT)" color="text-blue-400" />
                    <ActivityRow time="22:02" msg="Future Contract SETTLED - User_99 (+2,450 TRC)" color="text-emerald-400" />
                    <ActivityRow time="21:45" msg="Swap Fee applied to 14 open positions" color="text-slate-500" />
                </div>
            </div>
          </div>

          {/* Colonna Destra: Performance & Wallet */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400"><Wallet size={24} /></div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">System Online</span>
                </div>
                <h3 className="text-slate-400 text-sm mb-1">Available Trading Credits</h3>
                <div className="text-4xl font-mono font-bold text-white mb-6 tracking-tighter">12,450.00</div>
                <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition flex items-center justify-center gap-2">
                   <Zap size={16} fill="currentColor" /> DEPOSIT CREDITS
                </button>
             </div>

             <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Portfolio Analytics</h3>
                <div className="space-y-4">
                    <ProgressStat label="Success Rate" value="94%" percent={94} />
                    <ProgressStat label="Active Futures" value="8/10" percent={80} />
                    <ProgressStat label="Monthly ROI" value="+22.4%" percent={65} />
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Sotto-componenti per pulizia codice
function TickerItem({ label, value, change }) {
    return (
        <div className="flex gap-2 text-[11px] font-mono items-center border-r border-white/5 pr-4">
            <span className="text-slate-500">{label}</span>
            <span className="text-white">{value}</span>
            <span className={change.includes('+') ? 'text-emerald-500' : 'text-red-500'}>{change}</span>
        </div>
    );
}

function ModernAssetCard({ name, price, roi, type, provider, status }) {
    return (
        <div className="group bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-blue-500" size={20} />
            </div>
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-tighter border border-white/5">{type}</span>
                <span className="text-emerald-400 font-mono font-bold text-lg">+{roi}</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
            <p className="text-slate-500 text-xs mb-4">Market: <span className="text-slate-300">{provider}</span></p>
            <div className="flex justify-between items-end">
                <div className="text-2xl font-mono text-white font-bold tracking-tighter">{price}</div>
                <button className="text-[11px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400">Trade Now</button>
            </div>
        </div>
    );
}

function ActivityRow({ time, msg, color }) {
    return (
        <div className="flex gap-4 text-xs font-mono border-l border-white/5 pl-4 relative">
            <div className="absolute -left-[1px] top-0 h-2 w-[2px] bg-blue-500"></div>
            <span className="text-slate-600">{time}</span>
            <span className={color}>{msg}</span>
        </div>
    );
}

function ProgressStat({ label, value, percent }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-slate-500">{label}</span>
                <span className="text-white font-mono">{value}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}
