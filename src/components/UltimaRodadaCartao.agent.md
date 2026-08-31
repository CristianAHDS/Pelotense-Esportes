# UltimaRodadaCartao (agent docs)

Cartão for the "Última Rodada" overlay — the results of the latest round plus a classification strip. Uses `forwardRef` so `BotaoSalvarImagem` can capture it.

## Props
- `dados` — the store state from `ultimaRodadaStore`:
  - `titulo` (string, default `'ÚLTIMA RODADA'`)
  - `jogos[]` — each `{ casaSigla, foraSigla, casaGols, foraGols }`
  - `classificacaoVisivel` (bool, default truthy)
  - `posicoes[]` — each `{ sigla, pos }`

## Dependencies
- `getEstado` from `../store/tabelaStore` — builds a `sigla -> nome` map to display full team names next to escudos.
- `Escudo` + `/escudos/SIGLA.png` URLs (`urlEscudo` only returns a URL for `^[A-Z]{3,4}$`).

## Style / Animations
- Root `Quadro` uses `Entrada` keyframes (`translateY(-16px)` → 0, plus fade) with `0.4s cubic-bezier(0.2,0.9,0.25,1)`.
- Top bar: gradient green tint, 4px `#a5ef1c` left accent, big Rajdhani `h1` + Inter `sub`, and a green pill "RESULTADOS".
- Score rows: Rajdhani tabular-nums, score in `#a5ef1c`; team blocks justify by side (`casa` left, `fora` right).
- Empty state: "Sem jogos cadastrados" when no row has a sigla.
- Classification strip (only if `classificacaoVisivel !== false` and at least one `posouco.sigla`): chips with escudo (size 30) + `Nº` position in green.
- Curly-brace check `jogo.casaGols === '' ? '–' : jogo.casaGols` — empty strings render dash.

## Used by
- Overlay page `UltimaRodada.jsx` (via `usePlacarBroadcast(ultimaRodada)`).

## Conventions
- Keep `forwardRef` so image capture works.
- Escudo fallback color `#1f1f1f` (neutral) since the cartão doesn't carry per-team colors.
