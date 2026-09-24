# Potencia Desktop

Interface desktop do ecossistema Potencia.

## Arquitetura

O projeto é a camada visual do Potencia Runtime:

```
Potencia_IA (Runtime)
        |
   HTTP + SSE
        |
Potencia Desktop
   |       |       |
Terminal  Office  Graph
```

O **Potencia_IA** continua sendo o núcleo. O Desktop é opcional e consome o estado do Runtime por uma API local autenticada.

## Estado implementado

### Fundação
- Electron + React + TypeScript.
- IPC com `contextIsolation`, `sandbox` e `nodeIntegration: false`.
- Navegação externa e abertura de novas janelas bloqueadas.

### Terminal real
- Terminal real via `node-pty`.
- PowerShell no Windows.
- Entrada e saída interativas.
- Resize.
- Encerramento e limpeza do processo.
- IPC estreito; o renderer não executa shell diretamente.

### Runtime
- Conexão local com `127.0.0.1:43173`.
- Leitura do token do Potencia Runtime.
- Snapshot inicial autenticado.
- Stream SSE autenticada.
- Reconexão automática.
- Proteção contra streams antigas durante reconexão.
- Protocolo diferencia `snapshot` de eventos.
- Estado e histórico de eventos são refletidos no renderer.

### Office
- Agentes exibidos a partir do estado real do Runtime.
- Salas, mesas e interação do usuário.
- WASD/setas para movimentação.
- Interação com mesas.
- Visualização de skills e plugins registrados no Runtime.
- Agentes demo estáticos foram removidos.

### Graph
- Nós derivados do estado real do Runtime.
- Agentes, skills, plugins, tarefas e verificações.
- Zoom, pan, seleção e modo de status.
- Seed estática de demonstração removida.

## Validação

```powershell
npm install
npm run rebuild
npm run typecheck
npm run build
npm run dev
```

O CI executa `rebuild`, `typecheck` e `build` em Windows.

## Relação com Potencia_IA

O Desktop não substitui o Runtime.

O fluxo recomendado é:

1. iniciar o Potencia Runtime;
2. iniciar o Desktop;
3. verificar o indicador **Potencia conectado**;
4. usar Terminal, Office ou Graph;
5. acompanhar o estado sincronizado pelo Runtime.

O Runtime continua funcional sem o Desktop.

## Segurança

O Desktop não expõe um comando genérico de shell ao renderer. O terminal é controlado por uma API IPC específica, e a comunicação com o Runtime exige o token local.

## Versão

Interface compatível com o protocolo `1` do Potencia Runtime.
