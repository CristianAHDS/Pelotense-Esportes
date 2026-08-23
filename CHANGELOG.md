# Changelog

## 23/08/2026

### Sincronização na nuvem (multi-dispositivo)
- **Acréscimo manual nos 4 controles**: chips fixos (+1 a +10) substituídos por campo numérico com botões −/+ (aceita qualquer minuto de 0 a 99) e botão "Sem" para remover — no placar padrão, PL, BL e LL.
- **Placar padrão**: chip de acréscimo agora fica colado à faixa do tempo (2px de folga, mesma altura), sem sobrepor nem formar faixa dupla.
- **Exclusividade de controle por sala**: só um dispositivo publica por vez (`salas/{sala}/controle` com claim transacional, heartbeat de 8s e liberação automática via `onDisconnect`); demais controles viram espectadores com indicador no header e botão "Assumir". Publicações feitas antes de assumir ficam em buffer e são enviadas ao assumir — elimina o conflito/flicker quando dois aparelhos controlam juntos.
- **Acréscimo corrigido nos 4 placares broadcast**: chip sempre montado alternando opacidade (fade suave) em vez de montar/desmontar — elimina o resquício de sombra/box fantasma ao clicar em "Sem" (artefato de camada GPU/OBS com `filter: drop-shadow`).
- **Placar padrão**: acréscimo ganhou caixa própria (mesmo estilo das ligas PL/BL/LL) e offset de 40px para não sobrepor a faixa do cronômetro (transparência empilhada formava área mais escura).
- **Firebase Realtime Database** substitui o WebSocket local como camada de sincronização entre overlay e controle — agora funciona entre dispositivos diferentes no link do Netlify, não só no mesmo navegador.
- Todos os 10 stores migrados (`placar`, `placar-pro`, `placar-broadcast` PL/BL/LL/padrão, `tabela`, `mata-mata`, `penaltis`, `substituicao`): publicam o estado na nuvem em cada mudança e recebem atualizações remotas, mantendo BroadcastChannel + localStorage como caminho local rápido.
- **Salas (`?sala=nome`)**: dispositivos na mesma URL de sala compartilham estado; salas diferentes ficam isoladas (permite partidas simultâneas). Sem parâmetro, usa a sala `padrao`.
- **CampoSala no Header** dos controles e hub: campo para digitar a sala (recarrega a página ao aplicar) e botão "Copiar link" para levar a URL com sala ao OBS/outro computador.
- Prévias do hub herdam a sala da página (`&sala=`) para refletir o estado correto.
- Estado publicado como JSON serializado no Realtime Database (`salas/{sala}/{canal}`), evitando perda de `null`/arrays; eco das próprias publicações é filtrado.
- Configuração via variáveis `VITE_FIREBASE_*` (ver `.env.example`) — sem chaves configuradas, o site continua funcionando só com sincronização local.
- Plugin WebSocket do Vite removido (`vite.config.js`), dependência `ws` desinstalada.
- **README** e **AGENTS.md** atualizados com a nova arquitetura de sincronização (Firebase RTDB, salas, `CampoSala`, variáveis de ambiente e armadilhas relacionadas).

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
- Chips flutuantes da demo ancorados à janela do mockup — o chip "GOL DO VERANÓPOLIS" não sobrepõe mais os pontos e links abaixo da demonstração.
- Grade de ferramentas da landing removida em favor da demonstração animada (elimina a quebra de spans com 7 blocos).
- Chaveamento não empilha mais na prévia do hub (breakpoint alinhado à largura do iframe).
- Escudos ausentes resolvidos pelo fallback de sigla do componente `Escudo`.

## Sessões anteriores
- Módulos Substituição e Pênaltis com controles completos nos placares PL/BL/LL e previews ao vivo no hub.
- Ligas PL/BL/LL, tabela do Gauchão A2 com escudos reais e correções de sincronização.
