# 10. Decisões e pendências

## 10.1 Decisões/recomendações registradas

**DEC-001 — Manter Electron + React + TypeScript.** Recomendado por ser a base existente; migrar somente diante de limitação comprovada.

**DEC-002 — Nove slots visuais.** Adotado como requisito. Não implica nove processos simultâneos.

**DEC-003 — Sessão independente por cartão.** Adotado. Input, output, estado, identidade e ciclo de vida separados.

**DEC-004 — Adaptadores por provedor.** Recomendado para não misturar protocolos Claude Code e Codex.

**DEC-005 — Não presumir WSL/Docker.** Adotado. Dependências precisam de justificativa técnica.

**DEC-006 — Separar Potência IA dos executores.** Adotado como princípio: orquestração e processo CLI têm responsabilidades distintas.

**DEC-007 — Produto original.** Adotado. Pesquisa externa serve para evidência funcional, não para copiar ativos ou código.

## 10.2 Pendências
1. Confirmar URL e identidade exatas do produto chamado Hablaud.
2. Auditar o código atual completo antes de decidir refatorações.
3. Definir versões oficiais de Windows.
4. Testar Claude Code no Windows.
5. Testar Codex no Windows.
6. Definir se cada cartão escolhe provedor livremente.
7. Definir se slots podem ser reorganizados/ocultados.
8. Definir política de retenção do histórico.
9. Medir e definir limite inicial de concorrência.
10. Definir como Potência IA encaminha tarefas e obtém autorização.

## 10.3 Hipóteses
- Windows é primeiro alvo, coerente com instalador atual.
- Usuário instala e autentica CLIs, salvo futura decisão por instalador assistido.
- Desktop não armazena credenciais dos provedores.
- Runtime, Office e Graph atuais devem continuar funcionando.
- A prova de conceito deve validar uma sessão real antes de escalar.

## 10.4 Governança
Quando uma hipótese virar decisão, registrar data, motivo, evidência e impacto. Quando uma decisão for revertida, explicar o motivo. Alterações de escopo devem atualizar requisitos, arquitetura, roadmap e critérios de aceite.
