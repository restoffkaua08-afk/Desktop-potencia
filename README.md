# Potencia Desktop

Interface desktop do ecossistema Potencia.

## Estado atual

- Operação 1: fundação Electron + React + TypeScript.
- Operação 2: terminal real em construção.
- Operações 3–5: ainda não iniciadas.

## Terminal

O terminal usa:

- Electron
- React
- xterm.js
- node-pty
- PowerShell no Windows
- Electron IPC com context isolation

### Validação local

No Windows, dentro deste projeto:

```powershell
npm install
npm run rebuild
npm run typecheck
npm run build
npm run dev
```

A operação 2 só deve ser considerada concluída depois de validar o shell real, entrada, saída, resize e encerramento.

## Arquitetura futura

```
Potencia Runtime
      |
 Event Protocol
      |
Potencia Desktop
  |      |      |
Terminal Office Graph
```
