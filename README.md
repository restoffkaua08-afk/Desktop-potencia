# Potencia Desktop

Desktop oficial da infraestrutura Potencia.

O Potencia Desktop é a camada visual e operacional que se conecta ao Potencia Runtime, oferecendo:

- Terminal real para Claude Code e outros agentes.
- Escritório Interativo para visualizar agentes, tarefas e skills ativas.
- Gráfico Dinâmico inspirado no Graph View do Obsidian para visualizar relações e estado.
- Comunicação em tempo real com o Potencia Runtime.

## Relação com o Potencia_IA

O Desktop não substitui o Potencia_IA.

```
Potencia_IA
   ↓
Potencia Runtime / Event Bus
   ↓
Potencia Desktop
   ├── Terminal
   ├── Escritório
   └── Gráfico
```

O núcleo permanece no repositório Potencia_IA. O Desktop é a interface visual conectada a esse núcleo.

## Status

Projeto em construção.
