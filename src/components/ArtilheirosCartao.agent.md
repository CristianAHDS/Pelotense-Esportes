# ArtilheirosCartao (agent docs)

Cartão for the "Artilheiros" overlay — top scorers ranking. Uses `forwardRef` for `BotaoSalvarImagem` capture.

## Props
- `dados` — state from `artilheirosStore`:
  - `titulo` (string, default `'ARTILHEIROS'`)
  - `jogadores[]` — each `{ nome, sigla, gols }`

## Dependencies
- `getEstado` from `../store/tabelaStore` — `sigla -> nome` map to show the full club name under each player.
- `Escudo` + `/escudos/SIGLA.png` URLs.

## Render
- Topo: gradient green tint header, 4px `#a5ef1c` left accent, `h1` title + sub "Goleadores · Temporada {ano}", green pill "GOLS".
- Grid columns: `44px 28px 1fr 72px` — rank, escudo, player name+club, goals.
- Ranks `1º..Nº` (only `slice(0,5)`), score/goals in `#a5ef1c`; empty gols (`''`) renders `–`.
- Empty state: "Sem artilheiros cadastrados" when no player has a `nome`.
- `Entrada` animation (`translateY(-16px)`→0, `0.4s`), base width `min(620px, 100%)`.

## Used by
- Overlay page `Artilheiros.jsx` via `usePlacarBroadcast(artilheirosStore)`.

## Conventions
- Keep `forwardRef`. Escudo fallback `#1f1f1f`.
