import type { OfficeDesk, OfficeRoomId } from "./types";
export interface OfficeRoom { id: OfficeRoomId; label: string; x: number; y: number; width: number; height: number; kind: "agents" | "library" | "center"; }
export const officeRooms: OfficeRoom[] = [
 {id:"left-top",label:"Plugins",x:0,y:0,width:220,height:260,kind:"library"},
 {id:"left-bottom",label:"Agentes",x:0,y:280,width:220,height:260,kind:"agents"},
 {id:"center",label:"Sala Central",x:240,y:0,width:760,height:540,kind:"center"},
 {id:"right-top",label:"Agentes",x:1020,y:0,width:220,height:260,kind:"agents"},
 {id:"right-bottom",label:"Skills",x:1020,y:280,width:220,height:260,kind:"library"}
];
export const officeDesks: OfficeDesk[] = [
 {id:"left-1",room:"left-bottom",x:42,y:330},{id:"left-2",room:"left-bottom",x:132,y:330},
 {id:"left-3",room:"left-bottom",x:42,y:440},{id:"left-4",room:"left-bottom",x:132,y:440},
 {id:"right-1",room:"right-top",x:1062,y:50},{id:"right-2",room:"right-top",x:1152,y:50},
 {id:"right-3",room:"right-top",x:1062,y:160},{id:"right-4",room:"right-top",x:1152,y:160}
];
