export type OfficeRoomId = "left-top" | "left-bottom" | "center" | "right-top" | "right-bottom";
export type AgentVisualState = "idle" | "walking" | "working" | "waiting" | "reviewing" | "failed";

export interface OfficeAgent {
  id: string; name: string; role: string; state: AgentVisualState;
  x: number; y: number; targetX: number; targetY: number;
  room: OfficeRoomId; deskId?: string;
}
export interface OfficeDesk {
  id: string; room: "left-bottom" | "right-top";
  x: number; y: number; occupiedBy?: string;
}
