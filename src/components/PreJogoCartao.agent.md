# PreJogoCartao (agent docs)

Cartão for the "Pré-Jogo" overlay — pre-match countdown with the two opposing escudos. Uses `forwardRef` for `BotaoSalvarImagem`.

## Props
- `dados` — state from `preJogoStore`:
  - `cronometro` — the countdown object consumed by `segundosRestantes(dados.cronometro)`.
  - `timeCasa` — `{ nome, escudo }`
  - `timeVisitante` — `{ nome, escudo }`

## Dependencies
- `segundosRestantes`, `formatarTempo` from `../store/preJogoStore` (these handle the pre-game countdown math and clock formatting).
- `Escudo`.

## Behavior / Clock
- Local `tick` state re-renders every 500ms via `setInterval` so the countdown updates live.
- `tempo = formatarTempo(segundosRestantes(dados.cronometro))`.

## Render
- Dark rounded shell with a 4px green left accent (`opacity:0.85`).
- Left: big Rajdhani "PRÉ-JOGO" title + "Começa em:" label + green countdown pill (`#a5ef1c` bg, dark text, tabular-nums).
- Right: `Escudo` (tamanho 100, `cor="#a5ef1c"`) of home | `×` | away.
- Does NOT use the shared `Entrada` keyframes (it's a different visual language than table-style cartões).

## Used by
- Overlay page `PreJogo.jsx`.

## Conventions
- Keep `forwardRef`.
- Do not duplicate the countdown logic here — delegate to `preJogoStore` helpers.
