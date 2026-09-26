# RodadaAtualCartao (agent docs)

Cartão for the "Rodada Atual" overlay — current round fixtures with live scores. Uses `forwardRef` for `BotaoSalvarImagem`.

## Props
- `dados` — state from `rodadaAtualStore`:
  - `titulo` (string, default `'Rodada Atual'`) — module title (header `h1`).
  - `rodadas` (array) — each `{ titulo, jogos: [{ casaSigla, casaGols, foraGols, foraSigla }] }`.
    - `titulo` shown as the round label (`RodadaTitulo`).
    - `casaGols`/`foraGols` (string, may be empty) shown in the middle `Placar`; when both empty shows only `×`.

## Layout
- Header: `h1` title + sub "Jogos ao vivo · Temporada YYYY" + pill "AO VIVO" (pulsing).
- One `Rodada` section per entry; each game row: `BlocoTime casa | Placar | BlocoTime fora`.
- Names resolved from `tabelaStore` (`getEstado().times`, memoized once).
- Escudos via `Escudo` + `urlEscudo` (`/escudos/SIGLA.png` for 3-4 uppercase letters).

## Used by
- Overlay page `RodadaAtual.jsx` via `usePlacarBroadcast(rodadaAtual)`.
