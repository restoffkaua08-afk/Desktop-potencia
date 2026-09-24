import { useMemo, useRef, useState, type PointerEvent } from "react";
import type { GraphEdge, GraphNode, GraphNodeKind } from "./types";
import "./graph.css";

const seed:GraphNode[]=[
{id:"potencia",label:"Potencia Runtime",kind:"project",x:500,y:270,status:"active"},
{id:"claude",label:"Claude Code",kind:"agent",x:250,y:150,status:"connected"},
{id:"executor",label:"Executor",kind:"agent",x:330,y:390,status:"working"},
{id:"reviewer",label:"Reviewer",kind:"agent",x:690,y:390,status:"reviewing"},
{id:"superpowers",label:"Superpowers",kind:"skill",x:90,y:270,status:"active"},
{id:"verification",label:"Verification",kind:"verification",x:850,y:180,status:"running"},
{id:"task",label:"Development Task",kind:"task",x:720,y:90,status:"active"},
{id:"headroom",label:"Headroom",kind:"plugin",x:900,y:360,status:"configured"}
];
const edges:GraphEdge[]=[
{from:"potencia",to:"claude",label:"bridge"},{from:"potencia",to:"executor",label:"delegates"},
{from:"potencia",to:"reviewer",label:"reviews"},{from:"potencia",to:"superpowers",label:"skill"},
{from:"potencia",to:"verification",label:"verifies"},{from:"potencia",to:"task",label:"task"},
{from:"potencia",to:"headroom",label:"plugin"},{from:"executor",to:"task"},
{from:"reviewer",to:"verification"}
];
const colors:Record<GraphNodeKind,string>={project:"#c69b5a",agent:"#76a7d9",skill:"#86b77a",plugin:"#a986c7",task:"#d98d65",verification:"#65b9ad"};

export default function GraphView(){
 const [mode,setMode]=useState<"general"|"status">("general");
 const [selected,setSelected]=useState<GraphNode|null>(null);
 const [zoom,setZoom]=useState(1);
 const [pan,setPan]=useState({x:0,y:0});
 const drag=useRef<{x:number;y:number;px:number;py:number}|null>(null);
 const nodes=useMemo(()=>mode==="general"?seed:seed.filter(n=>n.status&&["active","working","reviewing","running","connected"].includes(n.status)),[mode]);
 const visible=new Set(nodes.map(n=>n.id));
 const onPointerDown=(e:PointerEvent)=>{(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y}};
 const onPointerMove=(e:PointerEvent)=>{if(!drag.current)return;setPan({x:drag.current.px+e.clientX-drag.current.x,y:drag.current.py+e.clientY-drag.current.y})};
 const onPointerUp=()=>{drag.current=null};
 return <section className="graph-view">
  <header className="graph-toolbar"><strong>Potencia Graph</strong><div><button className={mode==="general"?"active":""} onClick={()=>setMode("general")}>Geral</button><button className={mode==="status"?"active":""} onClick={()=>setMode("status")}>Status</button><button onClick={()=>setZoom(z=>Math.min(1.8,z+.1))}>+</button><button onClick={()=>setZoom(z=>Math.max(.65,z-.1))}>−</button><button onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>Reset</button></div></header>
  <div className="graph-canvas" onWheel={e=>{e.preventDefault();setZoom(z=>Math.max(.65,Math.min(1.8,z+(e.deltaY<0?.08:-.08))))}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
   <svg viewBox="0 0 1000 540" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}>
    {edges.filter(e=>visible.has(e.from)&&visible.has(e.to)).map(e=>{const a=nodes.find(n=>n.id===e.from)!,b=nodes.find(n=>n.id===e.to)!;return <g key={e.from+e.to}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>{e.label&&<text x={(a.x+b.x)/2} y={(a.y+b.y)/2-6}>{e.label}</text>}</g>})}
    {nodes.map(n=><g key={n.id} className={selected?.id===n.id?"selected":""} onClick={()=>setSelected(n)}><circle cx={n.x} cy={n.y} r={n.kind==="project"?38:27} fill={colors[n.kind]}/><text className="node-kind" x={n.x} y={n.y-4}>{n.kind}</text><text className="node-label" x={n.x} y={n.y+45}>{n.label}</text></g>)}
   </svg>
  </div>
  {selected&&<aside className="graph-details"><button onClick={()=>setSelected(null)}>×</button><strong>{selected.label}</strong><span>{selected.kind}</span><small>Status: {selected.status||"unknown"}</small><p>Fonte atual: modelo visual temporário. Será substituída pelo Potencia Runtime.</p></aside>}
 </section>;
}