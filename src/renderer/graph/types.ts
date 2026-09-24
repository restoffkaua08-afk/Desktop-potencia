export type GraphNodeKind="project"|"agent"|"skill"|"plugin"|"task"|"verification";
export interface GraphNode{id:string;label:string;kind:GraphNodeKind;x:number;y:number;status?:string}
export interface GraphEdge{from:string;to:string;label?:string}
