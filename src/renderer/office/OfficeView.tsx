import { useEffect, useRef, useState } from "react";
import { officeDesks, officeRooms } from "./layout";
import type { OfficeAgent } from "./types";
import { clampPoint, WALKABLE, WORLD } from "./world";
import "./office.css";

type Player={x:number;y:number;room:"center"|"left-bottom"|"right-top"};
type AgentActivity="wandering"|"going-to-desk"|"working"|"leaving-desk";

const initialAgents:OfficeAgent[]=[
 {id:"demo-a",name:"Executor",role:"Especialista",state:"walking",x:430,y:170,targetX:650,targetY:260,room:"center"},
 {id:"demo-b",name:"Reviewer",role:"Verificador",state:"working",x:1095,y:120,targetX:1095,targetY:120,room:"right-top",deskId:"right-3",speech:"Validando a última alteração."}
];
const rects=officeDesks.map(d=>({x:d.x-8,y:d.y-8,width:82,height:75}));
const deskPoint=(id:string)=>{const d=officeDesks.find(x=>x.id===id)!;return {x:d.x+33,y:d.y+72};};
function blocked(x:number,y:number){return rects.some(r=>x>r.x-14&&x<r.x+r.width+14&&y>r.y-14&&y<r.y+r.height+14);}
function targetFor(agent:OfficeAgent){const area=agent.room==="center"?WALKABLE.center:agent.room==="left-bottom"?WALKABLE.left:WALKABLE.right;for(let i=0;i<12;i++){const p=clampPoint({x:area.x+Math.random()*area.width,y:area.y+Math.random()*area.height},area);if(!blocked(p.x,p.y))return p;}return {x:area.x+area.width/2,y:area.y+area.height/2};}
function nearestFreeDesk(agents:OfficeAgent[],agentId:string){const used=new Set(agents.filter(a=>a.id!==agentId).map(a=>a.deskId).filter(Boolean));return officeDesks.find(d=>!used.has(d.id));}

export default function OfficeView(){
 const [agents,setAgents]=useState(initialAgents);
 const [activity,setActivity]=useState<Record<string,AgentActivity>>({"demo-a":"wandering","demo-b":"working"});
 const [player,setPlayer]=useState<Player>({x:600,y:270,room:"center"});
 const [book,setBook]=useState<"plugins"|"skills"|null>(null);
 const [selected,setSelected]=useState<OfficeAgent|null>(null);
 const keys=useRef(new Set<string>());
 const workTicks=useRef<Record<string,number>>({});
 const [nearDesk,setNearDesk]=useState<string|null>(null);
 const [seated,setSeated]=useState(false);

 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","e"].includes(k)){e.preventDefault();keys.current.add(k);}};
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);
  const timer=window.setInterval(()=>{
   setPlayer(p=>{if(seated)return p;let dx=0,dy=0;if(keys.current.has("w")||keys.current.has("arrowup"))dy-=3.5;if(keys.current.has("s")||keys.current.has("arrowdown"))dy+=3.5;if(keys.current.has("a")||keys.current.has("arrowleft"))dx-=3.5;if(keys.current.has("d")||keys.current.has("arrowright"))dx+=3.5;const nx=Math.max(10,Math.min(WORLD.width-10,p.x+dx)),ny=Math.max(10,Math.min(WORLD.height-10,p.y+dy));if(blocked(nx,ny))return p;const room=nx<220&&ny>280?"left-bottom":nx>1020&&ny<260?"right-top":"center";return {x:nx,y:ny,room};});
   setAgents(current=>current.map(agent=>{
    const mode=activity[agent.id]||"wandering";
    if(mode==="working"){
     workTicks.current[agent.id]=(workTicks.current[agent.id]||0)+1;
     if(workTicks.current[agent.id]>260&&Math.random()<0.04){workTicks.current[agent.id]=0;setActivity(a=>({...a,[agent.id]:"leaving-desk"}));return {...agent,state:"walking",speech:"Tarefa concluída. Saindo da estação..."}}
     return {...agent,state:"working",speech:agent.speech||"Trabalhando na tarefa..."};
    } 
    if(mode==="going-to-desk"&&agent.deskId){const t=deskPoint(agent.deskId),dx=t.x-agent.x,dy=t.y-agent.y,d=Math.hypot(dx,dy);if(d<6){setActivity(a=>({...a,[agent.id]:"working"}));return {...agent,x:t.x,y:t.y,state:"working",speech:"Executando na estação..."}}return {...agent,x:agent.x+(dx/d)*1.3,y:agent.y+(dy/d)*1.3,state:"walking",speech:"Indo para a estação..."};
    }
    if(mode==="leaving-desk"){const t=targetFor(agent),dx=t.x-agent.x,dy=t.y-agent.y,d=Math.hypot(dx,dy);if(d<7){setActivity(a=>({...a,[agent.id]:"wandering"}));return {...agent,targetX:t.x,targetY:t.y,deskId:undefined,state:"idle",speech:"Voltando à circulação..."}}return {...agent,x:agent.x+(dx/d)*1.3,y:agent.y+(dy/d)*1.3,state:"walking",speech:"Saindo da estação..."};
    }
    const dx=agent.targetX-agent.x,dy=agent.targetY-agent.y,d=Math.hypot(dx,dy);
    if(d<7){
      if(Math.random()<.18){const desk=nearestFreeDesk(current,agent.id);if(desk){setActivity(a=>({...a,[agent.id]:"going-to-desk"}));return {...agent,deskId:desk.id,state:"walking",speech:"Indo trabalhar..."}}}
      const t=targetFor(agent);return {...agent,targetX:t.x,targetY:t.y,state:Math.random()>.72?"idle":"walking",speech:undefined};
    }
    const nx=agent.x+(dx/d)*1.3,ny=agent.y+(dy/d)*1.3;
    return blocked(nx,ny)?{...agent,targetX:targetFor(agent).x,targetY:targetFor(agent).y}:{...agent,x:nx,y:ny,state:"walking",speech:undefined};
   }));
  },50);
  return()=>{window.clearInterval(timer);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);};
 },[seated]);

 useEffect(()=>{const d=officeDesks.reduce<{id:string;dist:number}|null>((best,d)=>{const dist=Math.hypot(d.x+33-player.x,d.y+30-player.y);return dist<55&&(!best||dist<best.dist)?{id:d.id,dist}:best},null);setNearDesk(d?.id||null)},[player]);
 useEffect(()=>{if(!nearDesk)return;const onKey=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==="e")setSeated(v=>!v)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[nearDesk]);
 const camera={x:Math.max(0,Math.min(WORLD.width-900,player.x-450)),y:Math.max(0,Math.min(WORLD.height-560,player.y-280))};

 return <section className="office-view">
  <div className="office-hud"><span>Escritório</span><small>WASD / setas • E sentar/levantar</small></div>
  <div className="office-viewport"><div className="office-world" style={{transform:`translate(-${camera.x}px,-${camera.y}px)`}}>
   {officeRooms.map(room=><div key={room.id} className={`office-room office-room--${room.kind}`} style={{left:room.x,top:room.y,width:room.width,height:room.height}}><span className="room-label">{room.label}</span>{room.id==="left-top"&&<button className="book" onClick={()=>setBook("plugins")}>📖<small>Plugins</small></button>}{room.id==="right-bottom"&&<button className="book" onClick={()=>setBook("skills")}>📕<small>Skills</small></button>}{room.id==="center"&&<div className="central-table"><span>MESA CENTRAL</span><i/><i/><i/><i/></div>}</div>)}
   {officeDesks.map(d=><div key={d.id} className={`desk ${agents.some(a=>a.deskId===d.id&&activity[a.id]!=="leaving-desk")?"desk--occupied":""}`} style={{left:d.x,top:d.y}}><div className="monitor"/><div className="keyboard"/><div className="chair"/><span className="desk-label">{agents.some(a=>a.deskId===d.id&&activity[a.id]!=="leaving-desk")?"ocupada":""}</span></div>)}
   <div className="decor plant-a">🌿</div><div className="decor plant-b">🪴</div><div className="decor trash">🗑️</div><div className="decor picture">🖼️</div><div className="decor papers">📄</div><div className="decor coffee">☕</div><div className="decor shelf">📚</div>
   <div className="agent-layer">{agents.map(agent=><button key={agent.id} className={`office-agent office-agent--${agent.state}`} style={{transform:`translate(${agent.x}px,${agent.y}px)`}} onClick={()=>setSelected(agent)}><div className="agent-shadow"/><div className="agent-avatar">🤖</div><span>{agent.name}</span>{agent.speech&&<em>{agent.speech}</em>}</button>)}</div>
   <div className={`player ${seated?"player--seated":""}`} style={{transform:`translate(${player.x}px,${player.y}px)`}}><div className="player-shadow"/><div className="player-avatar">🧑‍💻</div><span>Você</span></div>
   {nearDesk&&<div className="interaction-hint" style={{left:player.x+35,top:player.y-48}}>{seated?"E  levantar":"E  sentar"}</div>}
  </div></div>
  {selected&&<div className="agent-card"><button onClick={()=>setSelected(null)}>×</button><strong>{selected.name}</strong><span>{selected.role}</span><small>Estado: {selected.state}</small><p>{selected.speech||"Circulando pelo escritório."}</p></div>}
  {book&&<div className="book-modal" onClick={()=>setBook(null)}><div className="book-page" onClick={e=>e.stopPropagation()}><button onClick={()=>setBook(null)}>×</button><h2>{book==="plugins"?"Livro de Plugins":"Livro de Skills"}</h2><div className="book-list"><div>Componente será sincronizado</div><div>com o Potencia Runtime.</div></div></div></div>}
 </section>;
}