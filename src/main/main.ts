import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";
import { resizeTerminal, startTerminal, stopTerminal, writeTerminal } from "./terminal";
import { startRuntimeBridge } from "./runtime";

let ipcRegistered = false;
let stopRuntimeBridge: (() => void) | null = null;

function isTrustedSender(event: Electron.IpcMainEvent) {
  const url = event.senderFrame?.url ?? "";
  return url.startsWith("file://") || Boolean(process.env.ELECTRON_RENDERER_URL && url === process.env.ELECTRON_RENDERER_URL);
}

function registerIpc() {
  if (ipcRegistered) return;
  ipcRegistered = true;

  ipcMain.on("terminal:start", (event) => {
    if (!isTrustedSender(event)) return;
    startTerminal((data) => event.sender.send("terminal:data", data));
  });
  ipcMain.on("terminal:write", (event, data: unknown) => {
    if (!isTrustedSender(event) || typeof data !== "string") return;
    writeTerminal(data);
  });
  ipcMain.on("terminal:resize", (event, cols: unknown, rows: unknown) => {
    if (!isTrustedSender(event) || typeof cols !== "number" || typeof rows !== "number") return;
    resizeTerminal(cols, rows);
  });
  ipcMain.on("terminal:stop", (event) => {
    if (isTrustedSender(event)) stopTerminal();
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: "#050505",
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    const devUrl = process.env.ELECTRON_RENDERER_URL;
    const trusted = url.startsWith("file://") || Boolean(devUrl && url === devUrl);
    if (!trusted) event.preventDefault();
  });

  window.on("closed", () => stopTerminal());
  if (process.env.ELECTRON_RENDERER_URL) void window.loadURL(process.env.ELECTRON_RENDERER_URL);
  else void window.loadFile(join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  registerIpc();
  stopRuntimeBridge = startRuntimeBridge((message) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("runtime:message", message);
    }
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  stopRuntimeBridge?.();
  stopRuntimeBridge = null;
  stopTerminal();
  if (process.platform !== "darwin") app.quit();
});
