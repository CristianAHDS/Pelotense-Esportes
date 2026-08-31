# PainelEscalacao (agent docs)

Control form (painel) for the "Escalação" overlay module (grid lineup). Edits the `escalacaoStore`.

> For the broadcast-integrated lineup form see **PainelEscalacaoBroadcast** (separate store).
> This standalone panel is a simpler per-side editor (no per-player cards/goals/subs).

## Store / Hook
- `usePlacarBroadcast(escalacao)` from `../store/escalacaoStore`.
- Actions: `atualizarCampo`, `atualizarJogador`, `mostrar`, `ocultar`.

## Layout
- Themed card (`theme.cores.superficie`), Rajdhani title "📋 Escalação · Grid 11x1".
- Two-column grade of `ColunaTime` (casa / fora), each:
  - Cor (`CoresFixas`), Sigla (`SeletorSigla`), Nome (max 24), Formação (from `FORMACOES` list — `4-3-3`, `4-4-2`, `4-2-3-1`, `4-1-4-1`, `3-5-2`, `3-4-3`, `5-3-2`, `4-3-1-2`), Técnico (max 28).
  - Player rows: `EntradaNum` (0-99) + nome input (max 22), one per `estado.jogadores[lado]`.
- Action: "Mostrar na tela" / "Ocultar da tela" (toggle, primary/perigo).

## Conventions
- Grid `minmax(320px,1fr)` collapses to 1 column under 760px.
- `AtualizarJogador(lado, idx, campo, valor)`.

## Used by
- `ControleEscalacao.jsx` page.
