import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import "./styles.css";

type View = "terminal" | "office" | "graph";

export default function App() {
  const [view, setView] = useState<View>("terminal");
  const [menuOpen, setMenuOpen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view !== "terminal" || !terminalRef.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: "Cascadia Mono, Consolas, monospace",
      fontSize: 14,
      theme: {
        background: "#050505",
        foreground: "#e8e8e8",
        cursor: "#ffffff"
      }
    });

    terminal.open(terminalRef.current);
    window.potencia.terminal.start();

    const dispose = window.potencia.terminal.onData((data) => terminal.write(data));
    const onData = terminal.onData((data) => window.potencia.terminal.write(data));
    const onResize = () => window.potencia.terminal.resize(terminal.cols, terminal.rows);

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      dispose();
      onData.dispose();
      window.removeEventListener("resize", onResize);
      window.potencia.terminal.stop();
      terminal.dispose();
    };
  }, [view]);

  return (
    <main className="app">
      {view === "terminal" && <div ref={terminalRef} className="terminal" />}

      {view === "office" && (
        <section className="placeholder">
          <h1>Escritório Interativo</h1>
          <p>A visualização será conectada ao Potencia Runtime na operação 3.</p>
        </section>
      )}

      {view === "graph" && (
        <section className="placeholder">
          <h1>Gráfico Dinâmico</h1>
          <p>A visualização será conectada ao Potencia Runtime na operação 4.</p>
        </section>
      )}

      <div className="potencia-menu">
        {menuOpen && (
          <div className="view-actions">
            <button onClick={() => setView("graph")}>Graph</button>
            <button onClick={() => setView("office")}>Office</button>
          </div>
        )}

        <button
          className="potencia-button"
          aria-label="Abrir menu Potencia"
          onClick={() => {
            if (menuOpen) setView("terminal");
            setMenuOpen((open) => !open);
          }}
        >
          {menuOpen ? "×" : "P"}
        </button>
      </div>
    </main>
  );
}
