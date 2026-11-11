# 7. Plano de desenvolvimento

## Fase 0 — Reconhecimento e prova de conceito
- Inventariar código atual, pastas, IPC e terminal existente.
- Mapear processo principal, preload e renderer.
- Testar Claude Code e Codex no Windows.
- Comparar PTY, pipes e saída estruturada.
- Testar start, input, output, cancelamento, exit code e autenticação.
- Documentar limitações e versões suportadas.

**Saída:** relatório de prova de conceito e decisões técnicas. Não refatorar amplamente antes dessa etapa.

## Fase 1 — Núcleo de sessões
Implementar Session Manager, UUID, mapeamento slot-sessão, máquina de estados, contrato de adaptador, limite de concorrência, roteamento e testes unitários.

## Fase 2 — Primeiro adaptador real
Escolher provedor conforme evidência da Fase 0. Implementar detecção, validação, start, input, stop, eventos e diagnóstico. Validar em Windows.

## Fase 3 — Grade 3×3
Implementar nove slots, cartões vazios/ativos, input dedicado, saída com buffer, status, controles e modo de foco. Testar várias sessões sem cruzamento.

## Fase 4 — Segundo adaptador
Adicionar o outro provedor sem acoplar seu protocolo ao núcleo. Documentar capacidades não equivalentes.

## Fase 5 — Persistência
Persistir metadados e histórico limitado, criar migrações, restaurar visualização e detectar processos interrompidos. Nunca duplicar processos automaticamente ao reiniciar.

## Fase 6 — Integração Potência IA
Definir contrato de orquestração, encaminhamento para slot, rastreabilidade tarefa-sessão e autorização explícita.

## Fase 7 — Qualidade e distribuição
Testes automatizados, testes manuais em Windows limpo, build, instalador, hashes, troubleshooting e notas de versão.

## Ordem recomendada
Fase 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7. Validar um fluxo vertical real antes de ampliar para nove processos.

## Checklist por entrega
- [ ] requisito e aceite definidos;
- [ ] impacto arquitetural documentado;
- [ ] testes adicionados;
- [ ] falhas tratadas;
- [ ] isolamento preservado;
- [ ] logs sem segredos;
- [ ] validação Windows executada;
- [ ] documentação atualizada.
