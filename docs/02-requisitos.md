# 2. Requisitos e critérios de aceite

## 2.1 Requisitos funcionais

| ID | Requisito | Prioridade | Aceite |
|---|---|---|---|
| RF-01 | Exibir nove cartões | P0 | Grade 3×3 com slots vazios e ativos |
| RF-02 | Criar sessão em um slot | P0 | Provedor, workspace e tarefa selecionáveis |
| RF-03 | Estado individual | P0 | Estado deriva do processo/adaptador |
| RF-04 | Saída em tempo real | P0 | Eventos chegam ao cartão correto |
| RF-05 | Entrada individual | P0 | Mensagem roteada por sessionId |
| RF-06 | Encerrar sessão | P0 | Apenas processo daquela sessão é afetado |
| RF-07 | Identificar provedor | P0 | Claude Code/Codex claramente identificados |
| RF-08 | Diagnóstico de falha | P0 | Erro e código de saída visíveis |
| RF-09 | Validar CLI e workspace | P0 | Falha explicada antes/depois do start |
| RF-10 | Limite de concorrência | P1 | Bloqueia novas sessões ao atingir limite |
| RF-11 | Histórico | P1 | Eventos associados à sessão correta |
| RF-12 | Recuperação após reinício | P1 | Sessões antigas não aparecem falsamente ativas |
| RF-13 | Modo de foco | P1 | Expandir cartão sem perder a sessão |
| RF-14 | Limpeza de histórico | P1 | Ação explícita e confirmada |

## 2.2 Estados
- empty: slot livre.
- preparing: validação do ambiente.
- starting: inicialização solicitada.
- running: processo ativo e canal disponível.
- waiting_input: somente quando o CLI fornecer evidência confiável.
- stopping: encerramento solicitado.
- completed: terminou normalmente.
- failed: inicialização ou execução falhou.
- interrupted: processo/conexão foi perdido sem conclusão confirmada.

Não inferir waiting_input por procurar palavras na saída do terminal. Se não houver evento estruturado, manter running e mostrar a saída.

## 2.3 Regras de negócio
- Um slot comporta no máximo uma sessão ativa.
- Slot visual e ID de sessão são conceitos distintos.
- Cada sessão recebe UUID imutável.
- Sessão registra provedor, workspace, horários, estado e exit code.
- Provedor não pode ser trocado durante uma execução.
- Reiniciar o aplicativo não reinicia automaticamente comandos anteriores.
- Nove slots não significam nove processos ativos obrigatórios.
- Falha em um adaptador não deve encerrar os demais.

## 2.4 Requisitos não funcionais
- Segurança: renderer sem acesso direto a Node, filesystem ou shell.
- Desempenho: saída não pode bloquear renderização; buffers limitados.
- Robustez: queda, timeout e encerramento têm estados explícitos.
- Privacidade: dados locais por padrão; sem telemetria própria por padrão.
- Compatibilidade: matriz documentada de Windows, Electron e versões dos CLIs.
- Acessibilidade: foco por teclado, contraste e status textual.
- Recursos: concorrência configurável e observável.

## 2.5 MVP
MVP aceito quando os nove slots existem, um adaptador real opera ponta a ponta, input/output são isolados, encerramento é controlado, erros são visíveis, falha de uma sessão não derruba a UI, segredos não aparecem em logs e há testes para roteamento e ciclo de vida.
