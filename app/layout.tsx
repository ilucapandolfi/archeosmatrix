import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archeos Matrix | Brokerage System",
  description: "Architettura di Sistemi di Brokeraggio e Intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body style={{ margin: 0, backgroundColor: "#09090b", color: "#fafafa", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar Minimalista */}
          <aside style={{ width: "260px", borderRight: "1px solid #27272a", padding: "20px", backgroundColor: "#09090b" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "20px" }}>🏛️ Archeos Matrix</h2>
            <nav>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ padding: "8px 0", color: "#a1a1aa", cursor: "pointer" }}>📦 Logistica & Delivery</li>
                <li style={{ padding: "8px 0", color: "#a1a1aa", cursor: "pointer" }}>🧠 Intelligence</li>
                <li style={{ padding: "8px 0", color: "#a1a1aa", cursor: "pointer" }}>💰 Sales (Brokeraggio)</li>
              </ul>
            </nav>
          </aside>
          <main style={{ flex: 1, padding: "40px" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
