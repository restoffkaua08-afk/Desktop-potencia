import { useEffect, useRef, useState } from "react";
import { officeDesks, officeRooms } from "./layout";
import type { OfficeAgent } from "./types";
import { clampPoint, WALKABLE, WORLD } from "./world";
import "./office.css";

const initialAgents: OfficeAgent[] = [
 {id:"demo-a",name:"Executor",role:"Especialista",state:"walking",x:430,y:170,targetX:650,targetY:260,room:"center"},
 {id:"demo-b",name:"Reviewer",role:"Verificador",state:"working",x:760,y:370,targetX:760,targetY:370,room:"right-top",deskId:"right-3",speech:"Validando a última alteração."}
];

function targetFor(agent:OfficeAgent){
 const area=agent.room==="center"?WALKABLE.center:agent.room==="left-bottom"?WALKABLE.left:WALKABLE.right;
 return clampPoint({x:area.x+Math.random()*area.width,y:area.y+Math.random()*area.height},area);
}

export default function OfficeView(){
 const [agents,setAgents]=useState(initialAgents);
 const [book,setBook]=useState<"plugins"|"skills"|null>(null);
 const [selected,setSelected]=useState<OfficeAgent|null>(null);
 const [camera,setCamera]=useState({x:0,y:0});
 const keys=useRef(new Set<string>());

 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{if(["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){e.preventDefault();keys.current.add(e.key.toLowerCase());}};
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);
  const timer=window.setInterval(()=>{
   setCamera(c=>{
    let dx=0,dy=0;if(keys.current.has("w")||keys.current.has("arrowup"))dy-=8;if(keys.current.has("s")||keys.current.has("arrowdown"))dy+=8;if(keys.current.has("a")||keys.current.has("arrowleft"))dx-=8;if(keys.current.has("d")||keys.current.has("arrowright"))dx+=8;
    return {x:Math.max(0,Math.min(WORLD.width-900,c.x+dx)),y:Math.max(0,Math.min(WORLD.height-560,c.y+dy))};
   });
   setAgents(current=>current.map(agent=>{
    if(agent.state==="working"||agent.state==="waiting"||agent.state==="reviewing") return {...agent,speech:agent.speech||"Trabalhando..."};
    const dx=agent.targetX-agent.x,dy=agent.targetY-agent.y,d=Math.hypot(dx,dy);
    if(d<7){const t=targetFor(agent);const idle=Math.random()>.72;return {...agent,targetX:t.x,targetY:t.y,state:idle?"idle":"walking",speech:idle?"Observando o ambiente...":undefined};}
    return {...agent,x:agent.x+(dx/d)*1.25,y:agent.y+(dy/d)*1.25,state:"walking",speech:undefined};
   }));
  },50);
  return()=>{window.clearInterval(timer);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);};
 },[]);

 return <section className="office-view">
  <div className="office-hud"><span>Escritório</span><small>WASD / setas para andar</small></div>
  <div className="office-viewport">
   <div className="office-world" style={{transform:`translate(-${camera.x}px,-${camera.y}px)`}}>
    {officeRooms.map(room=><div key={room.id} className={`office-room office-room--${room.kind}`} style={{left:room.x,top:room.y,width:room.width,height:room.height}}>
      <span className="room-label">{room.label}</span>
      {room.id==="left-top"&&<button className="book" onClick={()=>setBook("plugins")}>📖<small>Plugins</small></button>}
      {room.id==="right-bottom"&&<button className="book" onClick={()=>setBook("skills")}>📕<small>Skills</small></button>}
      {room.id==="center"&&<div className="central-table"><span>MESA CENTRAL</span><i/><i/><i/><i/></div>}
    </div>)}
    {officeDesks.map(d=><div key={d.id} className={`desk ${d.occupiedBy?"desk--occupied":""}`} style={{left:d.x,top:d.y}}><div className="monitor"/><div className="keyboard"/><div className="chair"/><span className="desk-label">{d.occupiedBy?"ocupada":""}</span></div>)}
    <div className="decor plant-a">🌿</div><div className="decor plant-b">🪴</div><div className="decor trash">🗑️</div><div className="decor picture">🖼️</div><div className="decor papers">📄</div><div className="decor coffee">☕</div><div className="decor shelf">📚</div>
    <div className="agent-layer">{agents.map(agent=><button key={agent.id} className={`office-agent office-agent--${agent.state}`} style={{transform:`translate(${agent.x}px,${agent.y}px)`}} onClick={()=>setSelected(agent)}>
      <div className="agent-shadow"/><div className="agent-avatar">🤖</div><span>{agent.name}</span>{agent.speech&&<em>{agent.speech}</em>}
    </button>)}</div>
   </div>
  </div>
  {selected&&<div className="agent-card"><button onClick={()=>setSelected(null)}>×</button><strong>{selected.name}</strong><span>{selected.role}</span><small>Estado: {selected.state}</small><p>{selected.speech||"Circulando pelo escritório."}</p></div>}
  {book&&<div className="book-modal" onClick={()=>setBook(null)}><div className="book-page" onClick={e=>e.stopPropagation()}><button onClick={()=>setBook(null)}>×</button><h2>{book==="plugins"?"Livro de Plugins":"Livro de Skills"}</h2><div className="book-list"><div>Componente será sincronizado</div><div>com o Potencia Runtime.</div></div></div></div>}
 </section>;
}
