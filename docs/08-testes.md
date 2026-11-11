# 8. Testes e qualidade

## 8.1 Testes unitários
Máquina de estados, validação de slots, UUID, mapeamento slot/session, roteamento de input, normalização de eventos, buffer, concorrência e redação de logs.

## 8.2 Testes de integração
Renderer/preload/main, criação e encerramento de processo, stdout/stderr, envio de input, resize PTY, exit code, queda inesperada, reconexão ao Runtime e falha de adaptador.

## 8.3 Testes end-to-end
Abrir aplicativo, criar sessão, enviar tarefa, acompanhar saída, iniciar segunda sessão, provar isolamento, encerrar uma e manter outra, reiniciar aplicativo e verificar recuperação.

## 8.4 Casos críticos
1. Dois cartões recebem mensagens simultâneas: destinos não se cruzam.
2. Sessão termina durante envio: erro controlado e texto preservado.
3. CLI ausente: nenhum processo zumbi.
4. Workspace inválido: start bloqueado.
5. Processo filho persiste após pai: detectado e tratado.
6. Uma sessão falha: outras permanecem ativas.
7. Saída volumosa: UI responsiva e buffer limitado.
8. Evento atrasado de sessão antiga: descartado.
9. Slot reutilizado: eventos antigos não aparecem no novo cartão.
10. Token em saída: não é copiado para logs técnicos.
11. Versão incompatível do CLI: diagnóstico explícito.

## 8.5 Testes manuais Windows
Instalação limpa, usuário padrão, CLI ausente/presente, autenticação ausente/válida, caminhos com espaços e acentos, outra unidade, suspensão/retomada, fechamento forçado, atualização e desinstalação sem apagar dados.

## 8.6 Observabilidade
Separar log do aplicativo, eventos da sessão, saída de terminal e erros de integração. Incluir timestamp, nível, componente e sessionId quando aplicável. Não registrar segredos nem prompts integrais por padrão.

## 8.7 Definition of Done
Funcionalidade cumpre aceite, tem testes, trata falhas previsíveis, não amplia permissões silenciosamente, preserva isolamento, funciona no Windows declarado, atualiza documentação e passa build/typecheck.
