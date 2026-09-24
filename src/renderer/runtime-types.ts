export type RuntimeStatus = "disconnected" | "connecting" | "connected";

export interface RuntimeAgent {
  id: string;
  name: string;
  role?: string;
  state?: string;
  room?: "left-bottom" | "right-top" | "center";
  deskId?: string;
  speech?: string;
}

export interface RuntimeEntity {
  id: string;
  name?: string;
  label?: string;
  status?: string;
  [key: string]: unknown;
}

export interface RuntimeState {
  potencia_version: string;
  protocol_version: string;
  connection?: { status?: string };
  workspace?: string;
  agents: RuntimeAgent[];
  activeSkills: RuntimeEntity[];
  activePlugins: RuntimeEntity[];
  projects: RuntimeEntity[];
  tools: RuntimeEntity[];
  tasks: RuntimeEntity[];
  verifications: RuntimeEntity[];
  events: Array<{ id: string; type: string; timestamp: number; payload: Record<string, unknown> }>;
  updated_at: number;
}

export type RuntimeMessage =
  | { type: "status"; status: RuntimeStatus }
  | { type: "snapshot"; data: RuntimeState }
  | { type: "event"; data: { id: string; type: string; timestamp: number; payload: Record<string, unknown> } };
