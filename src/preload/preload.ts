import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("potencia", {
  version: "0.1.0"
});
