import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import "./styles.css";
import OfficeView from "./office/OfficeView";
import GraphView from "./graph/GraphView";

type View = "terminal" | "office" | "graph";

export default function App() {
  const [view,setView]=useState<View>("terminal");
  const [menuOpen,setMenuOpen]=useState(false);
  const terminalRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(view!=="terminal"||!terminalRef.current)return;
    const terminal=new Terminal({cursorBlink:true,fontFamily:"Cascadia Mono, Consolas, monospace",fontSize:14,theme:{background:"#050505",foreground:"#e8e8e8",cursor:"#fff"}});
    terminal.open(terminalRef.current);
    window.potencia.terminal.start();
    const dispose=window.potencia.terminal.onData(data=>terminal.write(data));
    const input=terminal.onData(data=>window.potencia.terminal.write(data));
    const resize=()=>window.potencia.terminal.resize(terminal.cols,terminal.rows);
    window.addEventListener("resize",resize); resize();
    return()=>{dispose();input.dispose();window.removeEventListener("resize",resize);window.potencia.terminal.stop();terminal.dispose();};
  },[view]);

  return <main className="app">
    {view==="terminal"&&<div ref={terminalRef} className="terminal"/>}
    {view==="office"&&<OfficeView/>}
    {view==="graph"&&<GraphView/>}
    <div className="potencia-menu">
      {menuOpen&&<div className="view-actions"><button onClick={()=>setView("graph")}>Graph</button><button onClick={()=>setView("office")}>Office</button></div>}
      <button className="potencia-button" aria-label="Abrir menu Potencia" onClick={()=>{if(menuOpen)setView("terminal");setMenuOpen(v=>!v);}}>{menuOpen?"×":"P"}</button>
    </div>
  </main>;
}
