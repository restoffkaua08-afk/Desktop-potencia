import { useEffect, useState } from "react";
import { officeDesks, officeRooms } from "./layout";
import type { OfficeAgent } from "./types";
import "./office.css";

const initialAgents: OfficeAgent[] = [
 {id:"demo-a",name:"Executor",role:"Especialista",state:"walking",x:430,y:170,targetX:650,targetY:260,room:"center"},
 {id:"demo-b",name:"Reviewer",role:"Verificador",state:"walking",x:760,y:370,targetX:540,targetY:220,room:"center"}
];

function targetFor(agent: OfficeAgent) {
 const minX=agent.room==="center"?300:25, maxX=agent.room==="center"?940:1180;
 const minY=agent.room==="center"?70:45, maxY=agent.room==="center"?480:490;
 return {x:minX+Math.random()*(maxX-minX),y:minY+Math.random()*(maxY-minY)};
}

export default function OfficeView() {
 const [agents,setAgents]=useState(initialAgents);
 const [book,setBook]=useState<"plugins"|"skills"|null>(null);

 useEffect(()=>{
  const timer=window.setInterval(()=>{
   setAgents(current=>current.map(agent=>{
    const dx=agent.targetX-agent.x,dy=agent.targetY-agent.y,distance=Math.hypot(dx,dy);
    if(distance<6){const t=targetFor(agent);return {...agent,targetX:t.x,targetY:t.y,state:"walking"};}
    const speed=1.2;
    return {...agent,x:agent.x+(dx/distance)*speed,y:agent.y+(dy/distance)*speed,state:"walking"};
   }));
  },50);
  return()=>window.clearInterval(timer);
 },[]);

 return <section className="office-view">
  <div className="office-world">
   {officeRooms.map(room=><div key={room.id} className={`office-room office-room--${room.kind}`} style={{left:room.x,top:room.y,width:room.width,height:room.height}}>
    <span className="room-label">{room.label}</span>
    {room.id==="left-top"&&<button className="book" onClick={()=>setBook("plugins")}>📖<small>Plugins</small></button>}
    {room.id==="right-bottom"&&<button className="book" onClick={()=>setBook("skills")}>📕<small>Skills</small></button>}
    {room.id==="center"&&<div className="central-table">Mesa central</div>}
   </div>)}
   {officeDesks.map(d=><div key={d.id} className="desk" style={{left:d.x,top:d.y}}><div className="monitor"/><div className="chair"/></div>)}
   <div className="decor plant-a">🌿</div><div className="decor plant-b">🪴</div>
   <div className="decor trash">🗑️</div><div className="decor picture">🖼️</div>
   <div className="agent-layer">{agents.map(agent=><div key={agent.id} className="office-agent" style={{transform:`translate(${agent.x}px,${agent.y}px)`}}><div className="agent-avatar">🤖</div><span>{agent.name}</span></div>)}</div>
  </div>
  {book&&<div className="book-modal" onClick={()=>setBook(null)}><div className="book-page" onClick={e=>e.stopPropagation()}><button onClick={()=>setBook(null)}>×</button><h2>{book==="plugins"?"Livro de Plugins":"Livro de Skills"}</h2><p>O conteúdo real virá do Potencia Runtime.</p></div></div>}
 </section>;
}
