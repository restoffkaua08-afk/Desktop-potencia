import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("potencia", {
  version: "0.3.0",
  terminal: {
    start: () => ipcRenderer.send("terminal:start"),
    write: (data: string) => ipcRenderer.send("terminal:write", data),
    resize: (cols: number, rows: number) => ipcRenderer.send("terminal:resize", cols, rows),
    stop: () => ipcRenderer.send("terminal:stop"),
    onData: (callback: (data: string) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, data: string) => callback(data);
      ipcRenderer.on("terminal:data", listener);
      return () => ipcRenderer.removeListener("terminal:data", listener);
    }
  },
  runtime: {
    onMessage: (callback: (message: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, message: unknown) => callback(message);
      ipcRenderer.on("runtime:message", listener);
      return () => ipcRenderer.removeListener("runtime:message", listener);
    }
  }
});
