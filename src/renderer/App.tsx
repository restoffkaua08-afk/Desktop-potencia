import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import "./styles.css";
import OfficeView from "./office/OfficeView";
import GraphView from "./graph/GraphView";
import type { RuntimeEvent, RuntimeMessage, RuntimeState, RuntimeStatus } from "./runtime-types";

type View = "terminal" | "office" | "graph";

const emptyRuntime: RuntimeState = {
  potencia_version: "0.0.0",
  protocol_version: "1",
  agents: [],
  activeSkills: [],
  activePlugins: [],
  projects: [],
  tools: [],
  tasks: [],
  verifications: [],
  events: [],
  updated_at: 0
};

function applyEvent(state: RuntimeState, event: RuntimeEvent): RuntimeState {
  const { type, payload } = event;
  if (!payload || typeof payload !== "object") return state;

  const collectionByType: Record<string, keyof Pick<RuntimeState, "agents" | "activeSkills" | "activePlugins" | "projects" | "tasks" | "verifications">> = {
    agent_upsert_changed: "agents",
    skill_upsert_changed: "activeSkills",
    plugin_upsert_changed: "activePlugins",
    project_upsert_changed: "projects",
    task_upsert_changed: "tasks",
    verification_upsert_changed: "verifications"
  };

  const collection = collectionByType[type];
  if (collection && payload.item && typeof payload.item === "object" && "id" in payload.item) {
    const item = payload.item as { id: string; [key: string]: unknown };
    const current = state[collection] as Array<{ id: string }>;
    return { ...state, [collection]: [...current.filter(entry => entry.id !== item.id), item], updated_at: event.timestamp };
  }

  if (type === "agent_removed" && typeof payload.id === "string") {
    return { ...state, agents: state.agents.filter(agent => agent.id !== payload.id), events: [...state.events.filter(item => item.id !== event.id), event].slice(-500), updated_at: event.timestamp };
  }

  return { ...state, events: [...state.events.filter(item => item.id !== event.id), event].slice(-500), updated_at: event.timestamp };
}

export default function App() {
  const [view, setView] = useState<View>("terminal");
  const [menuOpen, setMenuOpen] = useState(false);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus>("disconnected");
  const [runtimeState, setRuntimeState] = useState<RuntimeState>(emptyRuntime);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return window.potencia.runtime.onMessage((raw: unknown) => {
      const message = raw as RuntimeMessage;
      if (message.type === "status") {
        setRuntimeStatus(message.status);
        return;
      }
      if (message.type === "snapshot") {
        setRuntimeStatus("connected");
        setRuntimeState(message.data);
        return;
      }
      if (message.type === "event") {
        setRuntimeState(current => applyEvent(current, message.data));
      }
    });
  }, []);

  useEffect(() => {
    if (view !== "terminal" || !terminalRef.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: "Cascadia Mono, Consolas, monospace",
      fontSize: 14,
      scrollback: 10000,
      convertEol: true,
      theme: { background: "#050505", foreground: "#e8e8e8", cursor: "#fff" }
    });

    terminal.open(terminalRef.current);
    const dispose = window.potencia.terminal.onData(data => terminal.write(data));
    const input = terminal.onData(data => window.potencia.terminal.write(data));
    const resize = () => window.potencia.terminal.resize(terminal.cols, terminal.rows);

    window.potencia.terminal.start();
    window.addEventListener("resize", resize);
    resize();
    terminal.focus();

    return () => {
      dispose();
      input.dispose();
      window.removeEventListener("resize", resize);
      window.potencia.terminal.stop();
      terminal.dispose();
    };
  }, [view]);

  return (
    <main className="app">
      <div className="runtime-status" data-status={runtimeStatus}>
        <span className="runtime-dot" />
        Potencia {runtimeStatus === "connected" ? "conectado" : runtimeStatus === "connecting" ? "conectando" : "desconectado"}
      </div>

      {view === "terminal" && <div ref={terminalRef} className="terminal" />}
      {view === "office" && <OfficeView runtimeState={runtimeState} runtimeStatus={runtimeStatus} />}
      {view === "graph" && <GraphView runtimeState={runtimeState} runtimeStatus={runtimeStatus} />}

      <div className="potencia-menu">
        {menuOpen && (
          <div className="view-actions">
            <button onClick={() => setView("terminal")}>Terminal</button>
            <button onClick={() => setView("graph")}>Graph</button>
            <button onClick={() => setView("office")}>Office</button>
          </div>
        )}
        <button className="potencia-button" aria-label="Abrir menu Potencia" onClick={() => setMenuOpen(open => !open)}>
          {menuOpen ? "×" : "P"}
        </button>
      </div>
    </main>
  );
}
