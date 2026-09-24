export {};

declare global {
  interface Window {
    potencia: {
      version: string;
      terminal: {
        start(): void;
        write(data: string): void;
        resize(cols: number, rows: number): void;
        stop(): void;
        onData(callback: (data: string) => void): () => void;
      };
    };
  }
}
