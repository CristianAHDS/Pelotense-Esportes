# PainelUltimaRodada (agent docs)

Control form (painel) for the "Última Rodada" module. Edits the `ultimaRodada` store with results of the latest round and post-round classification, plus a "Puxar dados da FGF" importer.

## Store / Hook
- `usePlacarBroadcast(ultimaRodada)` from `../store/ultimaRodadaStore`.
- Uses actions: `atualizarCampo`, `atualizarJogo`, `removerJogo`, `adicionarJogo`, `atualizarPosicao`, `removerPosicao`, `adicionarPosicao`, `mostrarClassificacao`, `ocultarClassificacao`, mostrar/`ocultar`, `preencherDaFGF`.
- FGF: `importarUltimaRodadaFGF({ rodadaAlvo })` from `../services/fgfService`.

## Layout
- Dark card (`#0d0d0d`, `#1f1f1f` border, `margin-top:40px`), Rajdhani title with green `●`.
- Título input (max 32).
- Two-column grade (`minmax(320px,1fr)`):
  - **Resultados**: rows `SeletorSigla 🏠 | gol | × | gol | SeletorSigla 🏟 | ✕remover` (gols via `EntradaNum` 0-99).
  - **Classificação após a rodada**: rows `SeletorSigla | pos (1-20) | ✕remover`.
- Buttons: "+ Adicionar jogo", "+ Adicionar time".

## Actions bar
- "Puxar dados da FGF" (primary) with loading/error/aviso feedback — parses `estado.titulo` for a rodada number to fetch that round.
- Toggle "Mostrar/Ocultar classificação" (controls `classificacaoVisivel`).
- "Mostrar overlay" / "Ocultar overlay".

## Gotchas
- Local state: `carregando`, `erro`, `aviso` (NOT at module top-level — inside the component).
- `preencherDaFGF` expects `{ jogos, classificacao, titulo }` from the service.
- Errors are `console.warn`-ed + friendly message in `#f59e0b`.

## Used by
- `ControleUltimaRodada.jsx` page.
