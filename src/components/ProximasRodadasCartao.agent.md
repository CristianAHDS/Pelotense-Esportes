# ProximasRodadasCartao (agent docs)

Cartão for the "Próxima Rodada" overlay — scheduled fixtures. Uses `forwardRef` for `BotaoSalvarImagem`.

## Props
- `dados` — state from `proximasRodadasStore`:
  - `titulo` (string, default `'Próxima Rodada'`)
  - `rodadas[]` — each `{ titulo?, jogos[] }`, each jogo `{ casaSigla, foraSigla }`

## Dependencies
- `getEstado` from `../store/tabelaStore` — `sigla -> nome` map.
- `Escudo` + `/escudos/SIGLA.png` URLs.

## Render
- Topo: green tint header, 4px `#a5ef1c` accent, `h1` + sub "Jogos · Temporada {ano}", green pill "AGENDA".
- Renders `dados.rodadas.slice(0,1)` only (the single next round), each with a `RodadaTitulo` (default "RODADA N") and game rows: home escudo+name | `×` | name+escudo away.
- Empty state: "Sem jogos agendados" when no fixture has a sigla.
- `Entrada` animation, base width `min(720px, 100%)`.

## Used by
- Overlay page `ProximasRodadas.jsx` via `usePlacarBroadcast(proximasRodadasStore)`.

## Conventions
- Keep `forwardRef`. Escudo fallback `#1f1f1f`.
