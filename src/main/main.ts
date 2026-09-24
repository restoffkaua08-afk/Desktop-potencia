import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";
import { resizeTerminal, startTerminal, stopTerminal, writeTerminal } from "./terminal";

let ipcRegistered = false;

function registerTerminalIpc() {
  if (ipcRegistered) return;
  ipcRegistered = true;
  ipcMain.on("terminal:start", (event) => startTerminal((data) => event.sender.send("terminal:data", data)));
  ipcMain.on("terminal:write", (_event, data: unknown) => {
    if (typeof data === "string") writeTerminal(data);
  });
  ipcMain.on("terminal:resize", (_event, cols: unknown, rows: unknown) => {
    if (typeof cols === "number" && typeof rows === "number") resizeTerminal(cols, rows);
  });
  ipcMain.on("terminal:stop", () => stopTerminal());
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1000, minHeight: 650,
    backgroundColor: "#050505",
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  window.on("closed", () => stopTerminal());
  if (process.env.ELECTRON_RENDERER_URL) void window.loadURL(process.env.ELECTRON_RENDERER_URL);
  else void window.loadFile(join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  registerTerminalIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  stopTerminal();
  if (process.platform !== "darwin") app.quit();
});
