import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-black text-slate-300 antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 p-6 flex flex-col hidden md:flex">
            <div className="text-white font-black text-xl mb-10 tracking-tighter italic">BORSA MERCI</div>
            <nav className="space-y-4 flex-1">
              <a href="/" className="block text-blue-500 font-medium">Terminal</a>
              <a href="/wallet" className="block hover:text-white transition">Portafoglio</a>
              <a href="#" className="block hover:text-white transition">I miei Futures</a>
              <a href="#" className="block hover:text-white transition">Academy</a>
            </nav>
            <div className="pt-6 border-t border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-2">Status Sistema</div>
              <div className="flex items-center gap-2 text-emerald-500 text-sm">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span> Engine Online
              </div>
            </div>
          </aside>
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
