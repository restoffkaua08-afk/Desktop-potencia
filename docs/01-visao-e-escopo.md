# 1. Visão e escopo

## 1.1 Produto
Desktop Potência será uma central desktop local para acompanhar e operar até nove sessões independentes de agentes de desenvolvimento. A janela principal apresenta uma grade 3×3 de cartões retangulares. Cada cartão representa uma sessão real, não uma simulação visual.

Cada sessão possui provedor, diretório de trabalho, identidade, estado, entrada, saída, processo/transporte e histórico próprios.

## 1.2 Problema
O uso de vários agentes normalmente espalha tarefas por múltiplos terminais e janelas. Isso dificulta saber qual agente está trabalhando em qual tarefa, acompanhar a saída, enviar instruções complementares e interromper uma execução específica.

## 1.3 Objetivos
- Reunir nove espaços de sessão em uma janela.
- Permitir iniciar Claude Code ou Codex em um cartão.
- Mostrar saída operacional real em tempo real.
- Enviar mensagens ao agente correto pelo campo daquele cartão.
- Exibir estado, erros, duração e código de saída.
- Iniciar, interromper, encerrar e consultar sessões isoladamente.
- Integrar a orquestração do Potência IA sem confundi-la com os processos executores.
- Preservar as áreas e integrações atuais do Desktop.

## 1.4 Não objetivos do MVP
- Criar um modelo de IA próprio.
- Reimplementar Claude Code ou Codex.
- Prometer nove processos simultâneos em qualquer hardware.
- Executar comandos invisivelmente ou sem controle do usuário.
- Exigir WSL, Docker ou Linux sem necessidade comprovada.
- Copiar código, marca, textos, telas ou assets proprietários de terceiros.

## 1.5 Cenário principal
O usuário abre o aplicativo, escolhe um slot vazio, seleciona o provedor, escolhe o workspace, define um rótulo e uma instrução inicial, revisa as permissões, inicia a sessão e acompanha a saída no cartão. Depois pode enviar uma nova mensagem, expandir o cartão, interromper ou encerrar aquela sessão.

## 1.6 Princípios
**Verdade operacional:** estado e saída refletem eventos reais.  
**Isolamento:** entrada de um cartão nunca chega a outro.  
**Transparência:** provedor, workspace, estado e permissões são visíveis.  
**Controle humano:** ações e permissões relevantes são explícitas.  
**Resiliência:** falha de uma sessão não derruba as demais.  
**Progressividade:** validar uma sessão real antes de escalar para nove.

## 1.7 Métricas de sucesso
- O usuário identifica rapidamente tarefa e provedor de cada cartão.
- Entrada e saída permanecem isoladas por sessionId.
- Encerrar uma sessão não afeta as outras.
- Falhas são exibidas sem falsos estados de sucesso.
- O aplicativo continua responsivo com saída volumosa.
- O usuário sabe quando CLI, autenticação ou workspace não estão disponíveis.
