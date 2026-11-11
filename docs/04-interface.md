# 4. Interface e experiência

## 4.1 Direção
Painel desktop operacional: limpo, técnico, legível e prático. Evitar estética de jogo, efeitos excessivos e animações decorativas. A interface deve priorizar informação e controle.

## 4.2 Layout
Cabeçalho compacto e grade 3×3 com nove cartões retangulares. Cada slot mantém identidade visual estável. A grade se adapta ao redimensionamento; em janela estreita, pode mudar para duas colunas, uma coluna ou modo de foco, sem alterar IDs das sessões.

## 4.3 Anatomia do cartão
1. Cabeçalho: nome da tarefa, provedor e slot.
2. Status textual e visual.
3. Workspace abreviado; caminho completo em detalhes.
4. Área de saída real em fonte monoespaçada.
5. Campo de entrada exclusivo.
6. Ações: iniciar, enviar, interromper, encerrar, expandir e limpar visualização.
7. Metadados: duração, exit code e recursos, quando medidos com confiabilidade.

## 4.4 Slot vazio
Exibe ação explícita para criar sessão. Não inicia agente ao clicar em qualquer região do cartão. Criação pede provedor, workspace, rótulo, tarefa inicial e permissões.

## 4.5 Entrada
Cada cartão possui campo próprio. O envio sempre inclui sessionId; nunca depende da posição visual ou da ordem de criação. Se o agente não aceitar entrada naquele estado, informar o motivo e preservar o texto.

## 4.6 Saída
Preservar quebras de linha, seleção e cópia. Suportar ANSI quando houver PTY. Diferenciar stdout, stderr e mensagens do Desktop. Limitar buffer em memória. Não interpretar nem renderizar HTML arbitrário recebido do processo.

## 4.7 Modo de foco
Permitir ampliar um cartão para leitura e interação. Ao voltar à grade, a sessão permanece no mesmo slot e continua ativa.

## 4.8 Acessibilidade
Navegação por teclado, foco visível, botões rotulados, contraste, escala de interface e status que não dependem apenas de cor. Ações destrutivas exigem confirmação.

## 4.9 Mensagens de erro
Diagnósticos acionáveis: CLI ausente, autenticação ausente, workspace inválido, limite atingido, falha de PTY, processo encerrado, incompatibilidade de versão. Nunca mostrar conectado ou concluído sem evidência.
