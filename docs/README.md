# Desktop Potência — documentação técnica

Esta documentação é a especificação de produto e engenharia para a próxima evolução do Desktop Potência.

## Leitura recomendada
1. [Visão e escopo](01-visao-e-escopo.md)
2. [Requisitos e critérios de aceite](02-requisitos.md)
3. [Arquitetura proposta](03-arquitetura.md)
4. [Interface e experiência](04-interface.md)
5. [Sessões e adaptadores de agentes](05-sessoes-e-adaptadores.md)
6. [Segurança e privacidade](06-seguranca.md)
7. [Plano de desenvolvimento](07-roadmap.md)
8. [Testes e qualidade](08-testes.md)
9. [Pesquisa, REA e referências](09-pesquisa.md)
10. [Decisões e pendências](10-decisoes.md)

## Estado conhecido versus objetivo
O README atual descreve Electron + React, terminal real com node-pty, comunicação HTTP/SSE autenticada com Potencia Runtime, áreas Runtime/Office/Graph e empacotamento Windows. O package.json confirma Electron, React, TypeScript, Electron-Vite, xterm e node-pty.

A grade 3×3 de sessões independentes, com adaptadores Claude Code e Codex, é o objetivo de evolução; não é declarada aqui como funcionalidade já entregue.

WSL, Docker e Linux não são dependências presumidas. Só poderão entrar no projeto se uma prova de conceito demonstrar necessidade.

Cada documento diferencia estado atual, objetivo proposto, recomendação técnica e pendência. Atualize esta documentação junto com decisões relevantes de implementação.
