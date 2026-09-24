import { request, type IncomingMessage } from "node:http";
import { homedir } from "node:os";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export type RuntimeStatus = "disconnected" | "connecting" | "connected";

type RuntimeMessage = {
  type: "status" | "snapshot" | "event";
  status?: RuntimeStatus;
  data?: unknown;
};

const HOST = "127.0.0.1";
const PORT = Number(process.env.POTENCIA_RUNTIME_PORT ?? 43173);

async function token(): Promise<string | null> {
  const appData = process.env.APPDATA;
  const base = process.platform === "win32" && appData
    ? appData
    : process.platform === "darwin"
      ? join(homedir(), "Library", "Application Support")
      : join(homedir(), ".config");
  try {
    return (await readFile(join(base, "Potencia", "runtime.token"), "utf8")).trim() || null;
  } catch {
    return null;
  }
}

function get(path: string, auth?: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = request({ host: HOST, port: PORT, path, method: "GET", headers: auth ? { Authorization: `Bearer ${auth}` } : {} }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("error", reject);
    req.end();
  });
}

export function startRuntimeBridge(send: (message: RuntimeMessage) => void): () => void {
  let stopped = false;
  let retryTimer: NodeJS.Timeout | undefined;
  let stream: IncomingMessage | undefined;
  let generation = 0;

  const publish = (message: RuntimeMessage) => {
    if (!stopped) send(message);
  };

  const connect = async () => {
    if (stopped) return;
    const currentGeneration = ++generation;
    publish({ type: "status", status: "connecting" });
    try {
      const health = await get("/health");
      if (health.status !== 200) throw new Error("runtime unavailable");
      const healthBody = JSON.parse(health.body) as { protocol_version?: unknown; potencia_version?: unknown };
      if (healthBody.protocol_version !== "1") throw new Error("unsupported runtime protocol");
      const auth = await token();
      if (!auth) throw new Error("runtime token unavailable");
      const state = await get("/v1/state", auth);
      if (state.status !== 200) throw new Error("runtime state unavailable");
      const snapshot = JSON.parse(state.body) as { protocol_version?: unknown };
      if (snapshot.protocol_version !== "1") throw new Error("unsupported runtime state protocol");
      publish({ type: "snapshot", data: snapshot });

      if (stopped || currentGeneration !== generation) return;
      const req = request({
        host: HOST,
        port: PORT,
        path: "/v1/events",
        method: "GET",
        headers: { Authorization: `Bearer ${auth}`, Accept: "text/event-stream" }
      });
      req.on("response", (res) => {
        if (stopped || currentGeneration !== generation) {
          res.resume();
          return;
        }
        stream = res;
        if ((res.statusCode ?? 0) !== 200) {
          res.resume();
          publish({ type: "status", status: "disconnected" });
          schedule();
          return;
        }
        publish({ type: "status", status: "connected" });
        let buffer = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          buffer += chunk;
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const eventName = frame.split("\n").find((item) => item.startsWith("event: "))?.slice(7).trim() ?? "message";
            const line = frame.split("\n").find((item) => item.startsWith("data: "));
            if (!line) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (eventName === "snapshot") publish({ type: "snapshot", data });
              else publish({ type: "event", data });
            } catch {
              // Ignore malformed frames and keep the stream alive.
            }
          }
        });
        res.on("close", () => {
          stream = undefined;
          publish({ type: "status", status: "disconnected" });
          schedule();
        });
      });
      req.on("error", () => {
        stream = undefined;
        publish({ type: "status", status: "disconnected" });
        schedule();
      });
      req.end();
    } catch {
      publish({ type: "status", status: "disconnected" });
      schedule();
    }
  };

  const schedule = () => {
    if (stopped || retryTimer) return;
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      void connect();
    }, 3000);
  };

  void connect();

  return () => {
    stopped = true;
    generation += 1;
    if (retryTimer) clearTimeout(retryTimer);
    stream?.destroy();
  };
}
