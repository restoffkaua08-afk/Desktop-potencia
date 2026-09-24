import os from "node:os";
import pty, { IPty } from "node-pty";

let terminal: IPty | null = null;

function shellPath() {
  if (process.platform === "win32") {
    return process.env.POTENCIA_SHELL ?? "powershell.exe";
  }
  return process.env.SHELL ?? "/bin/sh";
}

function shellArgs() {
  if (process.platform === "win32") {
    return ["-NoLogo"];
  }
  return ["-l"];
}

export function startTerminal(onData: (data: string) => void) {
  if (terminal) return;

  terminal = pty.spawn(shellPath(), shellArgs(), {
    name: "xterm-color",
    cols: 120,
    rows: 32,
    cwd: os.homedir(),
    env: process.env as Record<string, string>,
    useConpty: process.platform === "win32"
  });

  terminal.onData(onData);
}

export function writeTerminal(data: string) {
  terminal?.write(data);
}

export function resizeTerminal(cols: number, rows: number) {
  if (!terminal || !Number.isFinite(cols) || !Number.isFinite(rows) || cols < 2 || rows < 2) return;
  terminal.resize(Math.min(500, Math.floor(cols)), Math.min(200, Math.floor(rows)));
}

export function stopTerminal() {
  terminal?.kill();
  terminal = null;
}
