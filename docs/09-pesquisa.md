# 9. Pesquisa, REA e referências

## 9.1 Objetivo
Pesquisar padrões de interface, instalação, gerenciamento de agentes e observabilidade para tomar decisões fundamentadas. O resultado deve ser uma especificação original, não uma cópia de implementação proprietária.

## 9.2 REA
Repositório informado: https://github.com/morluto/rea

REA (Reverse Engineer Anything) é um toolkit público de inspeção/engenharia reversa que pode auxiliar a coletar evidências sobre aplicações e conectá-las a agentes via MCP. O README público descreve capacidades de inspeção de aplicações e coleta de evidências. Não é um mecanismo que automaticamente clona ou recria um produto.

Fluxo recomendado:
1. ler README, licença, requisitos e comandos oficiais;
2. revisar alterações que o setup pretende fazer;
3. instalar somente após revisar permissões;
4. inspecionar apenas aplicações que o usuário tem autorização para analisar;
5. registrar fluxos, estados, entradas, saídas e dependências aparentes;
6. distinguir observação direta de hipótese;
7. validar conclusões com protótipo independente.

## 9.3 Referência “Hablaud”
A URL anteriormente informada como hablaud.com não foi confirmada com evidência confiável suficiente. Não afirmar funcionalidades, requisitos, instalador, uso de WSL/Docker ou integração Claude até confirmar o produto correto.

Após confirmação, registrar URL oficial, data, versão, sistema suportado, instalação, dependências, modelo de sessões, provedores, entrada/saída, estados, persistência, permissões, limitações e evidências reproduzíveis.

## 9.4 Limites
Usar somente ambientes autorizados. Respeitar licenças e termos. Não copiar código proprietário, branding, textos, ícones ou assets. Não contornar autenticação ou controles de acesso. Não extrair dados privados. Reimplementar requisitos funcionais com design e código próprios. Cumprir licenças de bibliotecas open-source.

## 9.5 Registro de evidência
| ID | Observação | Tipo | Fonte/versão | Confiança | Impacto |
|---|---|---|---|---|---|
| OBS-001 | Descrever o que foi observado | observação/hipótese | URL ou teste | alta/média/baixa | decisão |

## 9.6 Perguntas de pesquisa
- Cartão representa processo, conversa, workspace ou agente lógico?
- Entrada chega por terminal, API ou protocolo estruturado?
- Saída é texto bruto, eventos ou ambos?
- Quem inicia o processo: UI, Runtime ou orquestrador?
- Como permissões e autenticação são tratadas?
- Quais dependências são realmente obrigatórias?
- O que ocorre ao fechar a aplicação?
- Como histórico, atualização e logs funcionam?
