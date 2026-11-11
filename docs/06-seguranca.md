# 6. Segurança e privacidade

## 6.1 Modelo de ameaça
O aplicativo inicia processos locais que podem ler e modificar arquivos sob as permissões do usuário. O limite de segurança mais importante é a passagem entre renderer, processo principal, CLIs, workspace e conteúdo produzido pelos agentes.

Saída de agente, arquivos de projeto e instruções externas são dados não confiáveis. Não devem ser tratados como comandos confiáveis para o próprio Desktop.

## 6.2 Fronteiras
- Renderer: sem privilégios de sistema.
- Preload: superfície mínima e tipada.
- Main: valida e executa operações privilegiadas.
- CLI/agente: processo externo sob permissões do usuário e modo de aprovação selecionado.
- Workspace: conteúdo potencialmente não confiável.
- Runtime: serviço local autenticado conforme protocolo.
- Rede: URLs externas não são automaticamente confiáveis.

## 6.3 Controles obrigatórios
Manter contextIsolation=true, sandbox=true e nodeIntegration=false. Não expor IPC genérico. Validar payloads e sessionId no main. Restringir navegação externa. Não concatenar texto do usuário em shell; passar executável e argumentos separadamente. Validar cwd e ambiente. Redigir segredos dos logs. Não desativar prompts de aprovação dos CLIs por conveniência.

## 6.4 Permissões
A UI comunica o modo de permissão antes do início. Não reduzir silenciosamente as proteções do Claude Code ou Codex. Se houver solicitação de aprovação, apresentar a solicitação e encaminhar a decisão pelo mecanismo oficialmente suportado.

## 6.5 Processos
Registrar processos criados por sessão. Não matar processos por nome global. Encerrar somente árvore pertencente à sessão. Detectar órfãos. Implementar timeout e encerramento escalonado. Não afetar processos que não foram criados pelo Desktop.

## 6.6 Privacidade
Separar log técnico de saída de terminal. Redigir tokens e variáveis sensíveis. Persistência local por padrão, retenção limitada e opção de limpeza. Telemetria própria desativada por padrão. Informar que o conteúdo enviado ao CLI pode ser processado pelo fornecedor de IA de acordo com a conta e política daquele fornecedor.

## 6.7 Distribuição
Revisar dependências e scripts, publicar hashes dos instaladores, verificar integridade das releases e testar instalação/desinstalação. Avaliar assinatura do instalador. Manter inventário de dependências nativas como node-pty.

## 6.8 Bloqueadores de release
Não liberar se houver acesso direto a Node no renderer, roteamento cruzado de input, segredos em logs, abertura automática de URLs arbitrárias, encerramento cruzado de processos ou enfraquecimento silencioso de permissões.
