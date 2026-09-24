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

export interface RuntimeEvent {
  id: string;
  type: string;
  timestamp: number;
  payload: Record<string, unknown>;
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
  events: RuntimeEvent[];
  updated_at: number;
}

export type RuntimeMessage =
  | { type: "status"; status: RuntimeStatus }
  | { type: "snapshot"; data: RuntimeState }
  | { type: "event"; data: RuntimeEvent };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;


const isEntityArray = (value: unknown): value is RuntimeEntity[] =>
  Array.isArray(value) && value.every(item => isRecord(item) && typeof item.id === "string");

const isAgentArray = (value: unknown): value is RuntimeAgent[] =>
  Array.isArray(value) &&
  value.every(item =>
    isRecord(item) &&
    typeof item.id === "string" &&
    typeof item.name === "string"
  );

export function isRuntimeEvent(value: unknown): value is RuntimeEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    typeof value.timestamp === "number" &&
    isRecord(value.payload)
  );
}

export function isRuntimeState(value: unknown): value is RuntimeState {
  if (!isRecord(value)) return false;
  return (
    typeof value.potencia_version === "string" &&
    typeof value.protocol_version === "string" &&
    isAgentArray(value.agents) &&
    isEntityArray(value.activeSkills) &&
    isEntityArray(value.activePlugins) &&
    isEntityArray(value.projects) &&
    isEntityArray(value.tools) &&
    isEntityArray(value.tasks) &&
    isEntityArray(value.verifications) &&
    Array.isArray(value.events) &&
    value.events.every(isRuntimeEvent) &&
    typeof value.updated_at === "number"
  );
}

export function isRuntimeMessage(value: unknown): value is RuntimeMessage {
  if (!isRecord(value) || typeof value.type !== "string") return false;

  if (value.type === "status") {
    return value.status === "connected" || value.status === "connecting" || value.status === "disconnected";
  }

  if (value.type === "snapshot") return isRuntimeState(value.data);
  if (value.type === "event") return isRuntimeEvent(value.data);
  return false;
}
