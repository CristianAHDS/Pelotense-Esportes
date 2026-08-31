# EscalacaoCartao (agent docs)

Lineup carte for one side (casa/fora) of the "Escalação" overlay — a dark vertical card with the team's players, goals and cards, plus their formation/coach. No `forwardRef` (used live, not image-exported).

## Props
- `dados` — state from `escalacaoStore`:
  - `corCasa`/`corFora`, `siglaCasa`/`siglaFora`, `nomeCasa`/`nomeFora`
  - `formacaoCasa`/`formacaoFora`, `tecnicoCasa`/`tecnicoFora`
  - `jogadores` — indexed by lado `{ casa: [], fora: [] }`; each `{ num, nome, gols, cartoes: { amarelo, vermelho } }`
- `lado` — `'casa' | 'fora'` (drives which side's fields to render).

## Exports
- Also exports `urlEscudoTime(escudo, sigla)` (shared by `SubstituicaoCartao`).

## Render
- `Cartao` width 380px (320px under 420px), 6px `#a5ef1c` left border, black bg, `Entrada` entrance animation.
- Topo: escudo + sigla + full team name + formation pill (Rajdhani, `#a5ef1c`).
- Player rows (max 11, `slice(0,11)`): number in green, name (empty placeholder `Jogador N` in `.vazio`), and marks: ⚽ per goal, yellow/red mini card rectangles.
- Coach row (if `tecnico`): "TÉC" label + name.
- `corContraste(hex)` computes black/white for text over a team color (here used for choice but the cartão uses fixed `#000` topo).

## Used by
- `Escalacao.jsx` overlay — renders two `EscalacaoCartao` side by side (`casa` + `fora`).

## Conventions
- Does not use `usePlacarBroadcast` itself (rendered by the overlay with the store state passed as `dados`).
- Note the `TÃ‰C` label is literally that (uppercase TÉC encoded) — preserve.
