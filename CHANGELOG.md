# Changelog

## 23/08/2026

### Novidades
- **Landing** em `/` com seções Sync, Classificação ao vivo, OBS, Fluxo, CTA e Rodapé; sistema passa para `/hub`.
- **Demonstração animada na landing**: mockup de navegador que alterna automaticamente entre Placar Broadcast (cronômetro correndo), Classificação (linhas entrando em cascata) e Fases Finais (bracket com pulso neon e faixa CAMPEÃO), com chips flutuantes, pontos de navegação e links para todos os módulos — substituindo a grade de miniaturas.
- **Roteamento limpo**: migração de HashRouter para BrowserRouter (URLs sem `#`); links "Voltar ao hub" e copiar-link corrigidos.
- **Identidade visual unificada**: paleta neon `#a5ef1c` sobre fundo escuro no hub, controles e overlays.
- **Sorteio dos jogos da home** refeito a cada visita (confrontos VER × PAS no hero e nos painéis).
- **Mata-mata reformulado**, dividido em duas páginas:
  - `/mata-mata` — tabela das **oitavas** (`PainelOitavas` + `ListaOitavas`).
  - `/fases-finais` — **chaveamento** quartas → final (`PainelChaveamento` + `Chaveamento`) com conectores em cotovelo, chips de placar/pênalti e faixa **CAMPEÃO**.
- **Store do mata-mata** (`mataMataStore`): fases extras (quartas/semi/final), avanço automático dos vencedores entre fases, migração de estado antigo, `limparFase` e placares zerados em todas as fases.
- **Controle do mata-mata**: abas por fase (Oitavas/Quartas/Semi/Final), edição da fase ativa, "Limpar fase" e preenchimento rápido pelos classificados da tabela.
- **Hub**: cards "Oitavas de Final" e "Fases Finais · Chaveamento" com prévia ao vivo (altura própria por card) e link de controle compartilhado.

### Correções
- Grade de ferramentas da landing removida em favor da demonstração animada (elimina a quebra de spans com 7 blocos).
- Chaveamento não empilha mais na prévia do hub (breakpoint alinhado à largura do iframe).
- Escudos ausentes resolvidos pelo fallback de sigla do componente `Escudo`.

## Sessões anteriores
- Módulos Substituição e Pênaltis com controles completos nos placares PL/BL/LL e previews ao vivo no hub.
- Ligas PL/BL/LL, tabela do Gauchão A2 com escudos reais e correções de sincronização.
