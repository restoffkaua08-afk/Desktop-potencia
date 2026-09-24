import { useMemo, useRef, useState, type PointerEvent } from "react";
import type { GraphEdge, GraphNode, GraphNodeKind } from "./types";
import "./graph.css";
import type { RuntimeAgent, RuntimeEntity, RuntimeState, RuntimeStatus } from "../runtime-types";

const colors: Record<GraphNodeKind, string> = {
  project: "#c69b5a", agent: "#76a7d9", skill: "#86b77a", plugin: "#a986c7",
  task: "#d98d65", verification: "#65b9ad", tool: "#b7a7d9"
};

const relationKeys: Record<string, GraphNodeKind> = {
  agentId: "agent", projectId: "project", skillId: "skill", pluginId: "plugin",
  taskId: "task", verificationId: "verification", toolId: "tool"
};

function runtimeNodes(state: RuntimeState): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    { id: "potencia", label: "Potencia Runtime", kind: "project", x: 500, y: 270, status: "active" },
    ...state.projects.map((p, i) => ({ id: `project:${p.id}`, label: p.name || p.label || p.id, kind: "project" as const, x: 500, y: 90 + i * 70, status: p.status || "active" })),
    ...state.agents.map((a, i) => ({ id: `agent:${a.id}`, label: a.name, kind: "agent" as const, x: 260 + (i % 3) * 150, y: 130 + Math.floor(i / 3) * 170, status: a.state || "idle" })),
    ...state.activeSkills.map((s, i) => ({ id: `skill:${s.id}`, label: s.name || s.label || s.id, kind: "skill" as const, x: 90, y: 90 + i * 80, status: s.status || "active" })),
    ...state.activePlugins.map((p, i) => ({ id: `plugin:${p.id}`, label: p.name || p.label || p.id, kind: "plugin" as const, x: 900, y: 90 + i * 80, status: p.status || "active" })),
    ...state.tasks.map((t, i) => ({ id: `task:${t.id}`, label: t.name || t.label || t.id, kind: "task" as const, x: 500, y: 390 + i * 70, status: t.status || "active" })),
    ...state.verifications.map((v, i) => ({ id: `verification:${v.id}`, label: v.name || v.label || v.id, kind: "verification" as const, x: 720, y: 430 + i * 60, status: v.status || "running" })),
    ...state.tools.map((t, i) => ({ id: `tool:${t.id}`, label: t.name || t.label || t.id, kind: "tool" as const, x: 90, y: 390 + i * 70, status: t.status || "active" }))
  ];
  const byId = new Map(nodes.map(node => [node.id, node]));
  const edges: GraphEdge[] = [];
  const edgeKeys = new Set<string>();
  const addEdge = (from: string, to: string, label: string) => {
    if (from === to) return;
    const key = `${from}|${to}|${label}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ from, to, label });
  };
  for (const node of nodes) if (node.id !== "potencia") addEdge("potencia", node.id, "runtime");

  const collections: Array<[keyof RuntimeState, GraphNodeKind]> = [
    ["projects", "project"], ["agents", "agent"], ["activeSkills", "skill"],
    ["activePlugins", "plugin"], ["tasks", "task"], ["verifications", "verification"], ["tools", "tool"]
  ];
  for (const [collection, nodeKind] of collections) {
    for (const item of state[collection] as Array<RuntimeEntity | RuntimeAgent>) {
      const from = byId.get(`${nodeKind}:${item.id}`);
      if (!from) continue;
      for (const [key, value] of Object.entries(item)) {
        const relationKind = relationKeys[key];
        if (!relationKind || typeof value !== "string") continue;
        const target = byId.get(`${relationKind}:${value}`);
        if (target) addEdge(from.id, target.id, key.replace("Id", ""));
      }
    }
  }
  return { nodes, edges };
}

export default function GraphView({ runtimeState, runtimeStatus }: { runtimeState: RuntimeState; runtimeStatus: RuntimeStatus }) {
  const [mode, setMode] = useState<"general" | "status">("general");
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const graph = useMemo(() => runtimeNodes(runtimeState), [runtimeState]);
  const nodes = useMemo(() => mode === "general" ? graph.nodes : graph.nodes.filter(n => n.status && n.status !== "idle"), [graph, mode]);
  const visible = new Set(nodes.map(n => n.id));
  const onPointerDown = (e: PointerEvent) => { if ((e.target as SVGElement).closest("g")) return; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; };
  const onPointerMove = (e: PointerEvent) => { if (!drag.current) return; setPan({ x: drag.current.px + e.clientX - drag.current.x, y: drag.current.py + e.clientY - drag.current.y }); };
  const onPointerUp = () => { drag.current = null; };
  return <section className="graph-view">
    <header className="graph-toolbar"><strong>Potencia Graph</strong><div>
      <button className={mode === "general" ? "active" : ""} onClick={() => setMode("general")}>Geral</button>
      <button className={mode === "status" ? "active" : ""} onClick={() => setMode("status")}>Status</button>
      <button onClick={() => setZoom(z => Math.min(1.8, z + .1))}>+</button>
      <button onClick={() => setZoom(z => Math.max(.65, z - .1))}>−</button>
      <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset</button>
    </div></header>
    <div className="graph-canvas" onWheel={e => { e.preventDefault(); setZoom(z => Math.max(.65, Math.min(1.8, z + (e.deltaY < 0 ? .08 : -.08)))); }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <svg viewBox="0 0 1000 540" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}>
        {graph.edges.filter(e => visible.has(e.from) && visible.has(e.to)).map(e => { const a = nodes.find(n => n.id === e.from)!; const b = nodes.find(n => n.id === e.to)!; return <g key={`${e.from}|${e.to}|${e.label}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>{e.label && <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6}>{e.label}</text>}</g>; })}
        {nodes.map(n => <g key={n.id} className={selected?.id === n.id ? "selected" : ""} onClick={() => setSelected(n)}><circle cx={n.x} cy={n.y} r={n.kind === "project" ? 38 : 27} fill={colors[n.kind]}/><text className="node-kind" x={n.x} y={n.y - 4}>{n.kind}</text><text className="node-label" x={n.x} y={n.y + 45}>{n.label}</text></g>)}
      </svg>
    </div>
    <div className="graph-source">{runtimeStatus === "connected" ? "Fonte: Potencia Runtime" : "Fonte: aguardando Potencia Runtime"} • {nodes.length} nós</div>
    {selected && <aside className="graph-details"><button onClick={() => setSelected(null)}>×</button><strong>{selected.label}</strong><span>{selected.kind}</span><small>Status: {selected.status || "unknown"}</small><p>Dados sincronizados do estado atual do Potencia Runtime.</p></aside>}
  </section>;
}
