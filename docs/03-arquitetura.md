# 3. Arquitetura proposta

## 3.1 Base atual conhecida
O README do repositório declara Electron + React, terminal real via node-pty, HTTP/SSE autenticado com Potencia Runtime, health check, snapshot, reconexão, protocolo versionado, módulos Runtime/Office/Graph e renderer isolado. package.json declara Electron, React, TypeScript, Electron-Vite, xterm e node-pty.

A nova central multiagente é uma evolução a implementar, não uma capacidade que esta documentação presume pronta.

## 3.2 Arquitetura lógica alvo

    Renderer React
      Grade 3x3 | cartões | chat | terminal | controles
                         |
                 Preload tipado
                         |
    Main Process Electron
      Session Manager | Slot Manager | Event Router
      Process Manager | Persistence | Diagnostics
             |                         |
      Agent Adapters              Potência IA
      Claude Code                 Orquestração
      Codex                        tarefas/políticas
             |                         |
      CLI / PTY / pipes          Potencia Runtime API

## 3.3 Responsabilidades
**Renderer:** desenha cartões, coleta ações, apresenta estados e saída. Não inicia processos nem acessa APIs privilegiadas.

**Preload:** API pequena e tipada. Não expõe ipcRenderer genérico nem objetos Node.

**Main:** autoridade sobre sessões e processos. Valida workspace, cria e encerra processos, roteia input/output, aplica concorrência, registra metadados e integra Runtime.

**Agent Adapter:** traduz contrato interno para o protocolo real de cada CLI.

**Potência IA:** planeja e encaminha tarefas quando solicitado. Não é o processo executor do cartão.

## 3.4 Recomendação tecnológica
Manter Electron + React + TypeScript, por ser a base já existente e adequada à aplicação local. Manter node-pty onde TTY interativo for necessário. Não escolher PTY para todos os agentes por padrão: se uma CLI oferecer modo não interativo estruturado por pipes, avaliar essa opção.

Criar adaptadores independentes. Começar com persistência local simples; avaliar SQLite e custo de dependência nativa/migração antes de fechar a decisão. Não guardar credenciais no banco da aplicação.

## 3.5 API interna conceitual
Comandos: sessions:list, sessions:create, sessions:start, sessions:sendInput, sessions:stop, sessions:close, sessions:resize, sessions:getHistory.

Eventos: session:state, session:output, session:error, session:exit.

Todo comando/evento deve incluir sessionId. O main valida se a sessão existe e se está no estado apropriado. O renderer descarta eventos de sessões desconhecidas ou encerradas.

## 3.6 Modelo conceitual
**Session:** id UUID, slotId, provider, label, workspacePath, status, pid opcional, startedAt, endedAt, exitCode, adapterVersion e protocolVersion.

**SessionEvent:** id, sessionId, sequence, timestamp, kind e payload.

**Preference:** limite de concorrência e preferências não secretas.

Segredos e tokens não pertencem a esse modelo.

## 3.7 Fluxo de inicialização
1. UI solicita criação.
2. Main valida slot, workspace, provedor e limite.
3. Adapter detecta CLI e valida configuração.
4. Main registra preparing/starting.
5. Adapter inicia processo com argumentos explícitos.
6. Main associa processo e canais à sessão.
7. Saída vira eventos identificados por sessionId.
8. Ao terminar, registra estado final e exit code.
9. UI atualiza somente o cartão associado.

## 3.8 Processos e concorrência
Cada processo tem sessionId proprietário. Não encerrar processos por nome global. No Windows, testar encerramento da árvore de processos e detecção de órfãos. Usar timeout para encerramento gracioso e escalonamento controlado. Não afetar processos que o Desktop não criou.

Nove cartões são capacidade visual. Definir limite inicial conservador e medir RAM/CPU antes de permitir mais concorrência. Uma sessão em falha não pode bloquear as demais.
