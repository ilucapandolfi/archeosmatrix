export default function HomePage() {
  return (
    <div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px" }}>Benvenuto, Architetto</h1>
      <p style={{ color: "#a1a1aa", marginBottom: "40px" }}>Seleziona un modulo per iniziare a gestire i flussi di brokeraggio.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Blocco Esempio: Database Kanban */}
        <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "#18181b" }}>
          <h3 style={{ marginTop: 0 }}>📊 Status Operativo Intelligence</h3>
          <p style={{ fontSize: "0.9rem", color: "#71717a" }}>Monitoraggio in tempo reale dei sistemi di arbitraggio.</p>
          <div style={{ marginTop: "20px", color: "#4ade80", fontWeight: "bold" }}>● Sistema Online</div>
        </div>

        {/* Blocco Esempio: Gateway Pagamenti */}
        <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "#18181b" }}>
          <h3 style={{ marginTop: 0 }}>💳 Modulo Pagamenti Stripe</h3>
          <p style={{ fontSize: "0.9rem", color: "#71717a" }}>Configura checkout dinamici per i tuoi servizi.</p>
          <button style={{ marginTop: "20px", padding: "8px 16px", backgroundColor: "#fafafa", color: "#18181b", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            Configura Gateway
          </button>
        </div>
      </div>
    </div>
  );
}
