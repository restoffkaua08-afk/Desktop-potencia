# 5. Sessões e adaptadores de agentes

## 5.1 Sessão
Unidade independente de execução, com UUID, provedor, workspace, processo/transporte, estado, fluxo de eventos e histórico. O cartão é somente a representação visual. Slot pode ser reutilizado; sessionId não.

## 5.2 Contrato conceitual
    AgentAdapter
      id / displayName
      detect()
      validate(config)
      start(config)
      sendInput(process, input)
      resize(process, cols, rows) [opcional]
      stop(process, options)
      dispose(process)

O contrato final precisa refletir as capacidades reais de cada CLI. Não prometer operação que o provedor não exponha.

## 5.3 Claude Code
Investigar comandos oficialmente suportados, modo interativo e não interativo, eventos estruturados, envio de mensagens adicionais, permissões, autenticação, encerramento, exit codes e compatibilidade Windows. Não presumir que todo controle de uma conversa esteja disponível para uma aplicação externa.

## 5.4 Codex
Investigar modos oficiais, saída estruturada, continuação de tarefas, aprovação de comandos, acesso ao workspace, autenticação, TTY, cancelamento e códigos de saída. Não reutilizar comandos específicos do Claude Code no adaptador Codex.

## 5.5 PTY versus pipes
Usar PTY se a CLI exige TTY ou prompts interativos. Usar stdin/stdout/stderr se o modo suportado for não interativo e estruturado. Fazer prova de conceito no Windows para cada provedor. A existência de node-pty no projeto não é razão suficiente para obrigar PTY em todos os fluxos.

## 5.6 Eventos normalizados
process.started, process.stdout, process.stderr, agent.message, agent.status, agent.permission_required, process.exit, process.error e session.warning.

Emitir status estruturado somente quando existir evidência estável do CLI. Não classificar texto arbitrário como estado garantido.

## 5.7 Ciclo de vida
empty → preparing → starting → running → stopping → completed/failed. Também pode transitar para interrupted. Estados finais não voltam a running. Uma nova execução recebe novo ID ou é explicitamente modelada como nova tentativa com histórico preservado.

## 5.8 Potência IA
Separar orquestrador, executor e Desktop. Orquestrador divide objetivos e encaminha tarefas; executor é o processo CLI; Desktop gerencia sessão e mostra atividade. Encaminhamento para cartão deve ser visível e auditável. O orquestrador não pode contornar permissões ou escrever em sessão errada.

## 5.9 Recursos e histórico
Limite de concorrência configurável, fila opcional e aviso de pressão de recursos. Não iniciar tarefas em fila sem política clara de confirmação. Histórico local limitado e apagável. Não coletar tokens, variáveis secretas ou conteúdo de arquivos sem necessidade.
