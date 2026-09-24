import { useEffect, useRef, useState } from "react";
import { officeDesks, officeRooms } from "./layout";
import type { OfficeAgent } from "./types";
import type { RuntimeState, RuntimeStatus } from "../runtime-types";
import { clampPoint, WALKABLE, WORLD } from "./world";
import "./office.css";

type Player={x:number;y:number;room:"center"|"left-bottom"|"right-top"};
const rects=officeDesks.map(d=>({x:d.x-8,y:d.y-8,width:82,height:75}));
const deskPoint=(id:string)=>{const d=officeDesks.find(x=>x.id===id)!;return {x:d.x+33,y:d.y+72};};
function blocked(x:number,y:number){return rects.some(r=>x>r.x-14&&x<r.x+r.width+14&&y>r.y-14&&y<r.y+r.height+14);}
function targetFor(agent:OfficeAgent){const area=agent.room==="center"?WALKABLE.center:agent.room==="left-bottom"?WALKABLE.left:WALKABLE.right;for(let i=0;i<12;i++){const p=clampPoint({x:area.x+Math.random()*area.width,y:area.y+Math.random()*area.height},area);if(!blocked(p.x,p.y))return p;}return {x:area.x+area.width/2,y:area.y+area.height/2};}

export default function OfficeView({ runtimeState, runtimeStatus }: { runtimeState: RuntimeState; runtimeStatus: RuntimeStatus }) {
 const [positions,setPositions]=useState<Record<string,{x:number;y:number;targetX:number;targetY:number}>>({});
 const [player,setPlayer]=useState<Player>({x:600,y:270,room:"center"});
 const [book,setBook]=useState<"plugins"|"skills"|null>(null);
 const [selected,setSelected]=useState<OfficeAgent|null>(null);
 const keys=useRef(new Set<string>());
 const agentsRef=useRef(runtimeState.agents);
 agentsRef.current=runtimeState.agents;
 const [nearDesk,setNearDesk]=useState<string|null>(null);
 const [seated,setSeated]=useState(false);

 useEffect(()=>{
  setPositions(current=>{
   const next={...current};
   for(const agent of agentsRef.current){
    if(!next[agent.id]){
     const area=agent.room==="left-bottom"?WALKABLE.left:agent.room==="right-top"?WALKABLE.right:WALKABLE.center;
     const p=clampPoint({x:area.x+40+(agent.id.length*17)%Math.max(50,area.width-80),y:area.y+40+(agent.id.length*29)%Math.max(50,area.height-80)},area);
     next[agent.id]={x:p.x,y:p.y,targetX:p.x,targetY:p.y};
    }
   }
   for(const id of Object.keys(next)) if(!runtimeState.agents.some(a=>a.id===id)) delete next[id];
   return next;
  });
 },[runtimeState.agents]);

 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","e"].includes(k)){e.preventDefault();keys.current.add(k);}};
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);
  const timer=window.setInterval(()=>{
   setPlayer(p=>{
    if(seated)return p;
    let dx=0,dy=0;
    if(keys.current.has("w")||keys.current.has("arrowup"))dy-=3.5;
    if(keys.current.has("s")||keys.current.has("arrowdown"))dy+=3.5;
    if(keys.current.has("a")||keys.current.has("arrowleft"))dx-=3.5;
    if(keys.current.has("d")||keys.current.has("arrowright"))dx+=3.5;
    const nx=Math.max(10,Math.min(WORLD.width-10,p.x+dx)),ny=Math.max(10,Math.min(WORLD.height-10,p.y+dy));
    if(blocked(nx,ny))return p;
    const room=nx<220&&ny>280?"left-bottom":nx>1020&&ny<260?"right-top":"center";
    return {x:nx,y:ny,room};
   });
   setPositions(current=>{
    const next={...current};
    for(const agent of runtimeState.agents){
     const pos=next[agent.id];
     if(!pos)continue;
     const area=agent.room==="left-bottom"?WALKABLE.left:agent.room==="right-top"?WALKABLE.right:WALKABLE.center;
     let target={x:pos.targetX,y:pos.targetY};
     let dx=target.x-pos.x,dy=target.y-pos.y,d=Math.hypot(dx,dy);
     if(d<8){
      target=targetFor({...agent,x:pos.x,y:pos.y,targetX:pos.targetX,targetY:pos.targetY,room:agent.room||"center"} as OfficeAgent);
      dx=target.x-pos.x;dy=target.y-pos.y;d=Math.hypot(dx,dy);
     }
     const speed=agent.state==="working"||agent.state==="reviewing"?0.45:1.15;
     next[agent.id]={x:pos.x+(d?dx/d*speed:0),y:pos.y+(d?dy/d*speed:0),targetX:target.x,targetY:target.y};
     if(next[agent.id].x<area.x||next[agent.id].x>area.x+area.width||next[agent.id].y<area.y||next[agent.id].y>area.y+area.height){
      const safe=clampPoint({x:next[agent.id].x,y:next[agent.id].y},area);
      next[agent.id]={...next[agent.id],x:safe.x,y:safe.y};
     }
    }
    return next;
   });
  },50);
  return()=>{window.clearInterval(timer);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);};
 },[seated]);

 useEffect(()=>{const d=officeDesks.reduce<{id:string;dist:number}|null>((best,d)=>{const dist=Math.hypot(d.x+33-player.x,d.y+30-player.y);return dist<55&&(!best||dist<best.dist)?{id:d.id,dist}:best},null);setNearDesk(d?.id||null)},[player]);
 useEffect(()=>{if(!nearDesk)return;const onKey=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==="e")setSeated(v=>!v)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[nearDesk]);
 const camera={x:Math.max(0,Math.min(WORLD.width-900,player.x-450)),y:Math.max(0,Math.min(WORLD.height-560,player.y-280))};

 return <section className="office-view">
  <div className="office-hud"><span>Escritório</span><small>{runtimeStatus==="connected"?`${runtimeState.agents.length} agente(s) no Runtime`:"Aguardando Potencia Runtime"} • WASD / setas • E sentar/levantar</small></div>
  <div className="office-viewport"><div className="office-world" style={{transform:`translate(-${camera.x}px,-${camera.y}px)`}}>
   {officeRooms.map(room=><div key={room.id} className={`office-room office-room--${room.kind}`} style={{left:room.x,top:room.y,width:room.width,height:room.height}}><span className="room-label">{room.label}</span>{room.id==="left-top"&&<button className="book" onClick={()=>setBook("plugins")}>📖<small>Plugins</small></button>}{room.id==="right-bottom"&&<button className="book" onClick={()=>setBook("skills")}>📕<small>Skills</small></button>}{room.id==="center"&&<div className="central-table"><span>MESA CENTRAL</span><i/><i/><i/><i/></div>}</div>)}
   {officeDesks.map(d=>{const occupant=runtimeState.agents.find(a=>a.deskId===d.id);return <div key={d.id} className={`desk ${occupant?"desk--occupied":""}`} style={{left:d.x,top:d.y}}><div className="monitor"/><div className="keyboard"/><div className="chair"/><span className="desk-label">{occupant?occupant.name:""}</span></div>})}
   <div className="decor plant-a">🌿</div><div className="decor plant-b">🪴</div><div className="decor trash">🗑️</div><div className="decor picture">🖼️</div><div className="decor papers">📄</div><div className="decor coffee">☕</div><div className="decor shelf">📚</div>
   {runtimeState.agents.length===0&&<div className="office-empty">{runtimeStatus==="connected"?"Nenhum agente registrado no Runtime.":"Conecte o Potencia Runtime para observar os agentes."}</div>}
   <div className="agent-layer">{runtimeState.agents.map(agent=>{const pos=positions[agent.id];if(!pos)return null;const visualState=(agent.state||"idle") as OfficeAgent["state"];return <button key={agent.id} className={`office-agent office-agent--${visualState}`} style={{transform:`translate(${pos.x}px,${pos.y}px)`}} onClick={()=>setSelected({...agent,x:pos.x,y:pos.y,targetX:pos.targetX,targetY:pos.targetY,room:agent.room||"center",role:agent.role||"Agente",state:visualState})}><div className="agent-shadow"/><div className="agent-avatar">🤖</div><span>{agent.name}</span>{agent.speech&&<em>{agent.speech}</em>}</button>})}</div>
   <div className={`player ${seated?"player--seated":""}`} style={{transform:`translate(${player.x}px,${player.y}px)`}}><div className="player-shadow"/><div className="player-avatar">🧑‍💻</div><span>Você</span></div>
   {nearDesk&&<div className="interaction-hint" style={{left:player.x+35,top:player.y-48}}>{seated?"E  levantar":"E  sentar"}</div>}
  </div></div>
  {selected&&<div className="agent-card"><button onClick={()=>setSelected(null)}>×</button><strong>{selected.name}</strong><span>{selected.role}</span><small>Estado: {selected.state}</small><p>{selected.speech||"Sem mensagem de atividade registrada."}</p></div>}
  {book&&<div className="book-modal" onClick={()=>setBook(null)}><div className="book-page" onClick={e=>e.stopPropagation()}><button onClick={()=>setBook(null)}>×</button><h2>{book==="plugins"?"Livro de Plugins":"Livro de Skills"}</h2><div className="book-list">{(book==="plugins"?runtimeState.activePlugins:runtimeState.activeSkills).length===0?<div>Nenhum item registrado no Runtime.</div>:(book==="plugins"?runtimeState.activePlugins:runtimeState.activeSkills).map(item=><div key={item.id}>{item.name||item.label||item.id}</div>)}</div></div></div>}
 </section>;
}
