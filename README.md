# Potencia Desktop

Interface desktop oficial do ecossistema Potencia.

O **Potencia Desktop** fornece uma interface visual para o Potencia Runtime: terminal real, visão dos agentes e recursos do Runtime, Office e Graph. Ele é uma aplicação local; o estado do usuário permanece no próprio computador.

## Arquitetura

```
Potencia Runtime
      │
 HTTP + SSE autenticado
      │
Potencia Desktop
 ┌────┼────────┐
Terminal Office Graph
```

O Desktop não substitui o Runtime. O Runtime continua sendo o núcleo e pode funcionar sem a interface.

## Requisitos

- Windows 10/11 para o instalador oficial atual;
- Potencia Runtime instalado;
- Claude Code e demais ferramentas do usuário continuam sendo independentes do Desktop.

## Instalação

### 1. Instale o Potencia Runtime

No terminal:

```powershell
py -m pip install git+https://github.com/restoffkaua08-afk/Potencia_IA.git
```

Valide:

```powershell
potencia --version
potencia doctor --workspace "C:\caminho\do\seu\projeto"
```

### 2. Inicie o Runtime no projeto

```powershell
potencia runtime --workspace "C:\caminho\do\seu\projeto"
```

### 3. Instale o Desktop

Baixe o instalador `Potencia-Desktop-<versão>-x64.exe` na página de Releases do repositório.

O instalador cria atalhos no menu Iniciar e, opcionalmente, na área de trabalho.

## Uso

1. deixe o Potencia Runtime em execução;
2. abra o Potencia Desktop;
3. confirme **Potencia conectado**;
4. use **Terminal**, **Office** ou **Graph**;
5. trabalhe normalmente no seu projeto e deixe o Runtime refletir o estado operacional.

O terminal do Desktop usa um processo real do sistema. No Windows, o shell padrão é PowerShell.

## Funcionalidades

### Terminal
- processo real via `node-pty`;
- entrada e saída interativas;
- resize;
- encerramento limpo;
- IPC mínimo entre renderer e processo principal.

### Runtime
- health check;
- autenticação por token local;
- snapshot inicial;
- SSE em tempo real;
- reconexão automática;
- compatibilidade explícita com protocolo `1`;
- validação dos dados antes de chegarem à interface.

### Office
- agentes vindos do Runtime real;
- salas e mesas;
- movimentação;
- interação;
- visualização de skills e plugins;
- nenhum agente demo estático.

### Graph
- entidades reais do Runtime;
- relações derivadas dos dados;
- zoom e pan;
- seleção e detalhes;
- modo de status.

## Segurança

O renderer não possui acesso direto ao Node.js ou ao shell.

O Desktop usa:

- `contextIsolation: true`;
- `sandbox: true`;
- `nodeIntegration: false`;
- IPC com canais específicos;
- validação de mensagens;
- bloqueio de navegação não confiável;
- autenticação do Runtime por token local.

## Desenvolvimento

```powershell
npm install
npm run rebuild
npm run typecheck
npm run build
npm run dev
```

Validação do pacote distribuível:

```powershell
npm run package:dir
```

Gerar instalador Windows:

```powershell
npm run package:win
```

Os artefatos aparecem em `release/`.

## CI

O GitHub Actions valida:

- instalação das dependências;
- rebuild do módulo nativo;
- TypeScript;
- build Electron;
- empacotamento distributável.

## Compatibilidade

O Desktop atual exige o protocolo `1` do Potencia Runtime. Uma versão incompatível é recusada em vez de tentar interpretar dados desconhecidos.

## Licença

MIT.
