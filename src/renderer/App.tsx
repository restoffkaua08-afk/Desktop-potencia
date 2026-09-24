import { useState } from "react";

type View = "terminal" | "office" | "graph";

export default function App() {
  const [view, setView] = useState<View>("terminal");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main style={{ height: "100vh", background: "#050505", color: "#fff" }}>
      <section style={{ height: "100%", display: view === "terminal" ? "block" : "none" }}>
        <div style={{ padding: 24, fontFamily: "monospace" }}>
          Potencia Desktop — Terminal
        </div>
      </section>

      {view === "office" && <section style={{ padding: 24 }}>Escritório Interativo</section>}
      {view === "graph" && <section style={{ padding: 24 }}>Gráfico Dinâmico</section>}

      <div style={{ position: "fixed", right: 18, bottom: 18 }}>
        {menuOpen && (
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button onClick={() => setView("graph")}>Graph</button>
            <button onClick={() => setView("office")}>Office</button>
          </div>
        )}
        <button onClick={() => { setView("terminal"); setMenuOpen(!menuOpen); }}>
          {menuOpen ? "×" : "P"}
        </button>
      </div>
    </main>
  );
}
