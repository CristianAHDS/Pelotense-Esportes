# PlacarModelCartao (agent docs)

Glassmorphism scoreboard cartão used by the "Placar Modelo" overlay — a distinct visual style (blur/glow/cor accent) from the broadcast placar. Uses `forwardRef` for `BotaoSalvarImagem`.

## Props
- `dados` — state from `placarModelStore`:
  - `timeCasa`, `timeVisitante` — `{ nome, escudo }`
  - `golsCasa`, `golsVisitante`
  - `cronometro` — used by `segundosAtuais`/`rodando`
  - `periodo`, `estadoPartida`, `acrescimo`
  - `corCasa`, `corVisitante` (hex)
  - `cartoesCasa`/`cartoesVisitante` — `{ amarelo, vermelho }`
  - `mostrarEscudos` (bool, default truthy)

## Dependencies
- `segundosAtuais`, `formatarTempo` from `../store/placarModelStore` (clock math).
- `Escudo`.
- Local `hexParaRgba(hex, a)` for the glow.

## Animations / Keyframes
- `pulsoGlow` (opacity 0.5↔1) — GlowOrb (radial gradient in team color, `blur(16px)`) + live red dot.
- `glisseScore` (`scale(1.35)`→`1`, `0.32s cubic-bezier(0.34,1.56,0.64,1)`) — plays on each goal change (tracked via `prevC/prevV` refs, 380ms window).
- `entrar` — period/acréscimo tags slide in.

## Render
- `Shell`: `rgba(10,10,10,0.55)` + `backdrop-filter: blur(16px) saturate(1.35)`, width `min(560px,100%)`.
- 2px `FaixaCor` gradient from `corCasa`→`#a5ef1c`→`corVisitante` on top.
- Home (left) / away (right, reversed) rows with escudo, sigla, mini card markers (`#eab308` yellow / `#ef4444` red), score number.
- Right meta: live dot, live-timer (`#a5ef1c` when running), `+N'` acréscimo tag (amber `#fbbf24`), and `PeriodoTag` status label.
- `rotuloStatus(estadoPartida, periodo)`: `INÍCIO`/`AO VIVO` → `periodo`; `INTERVALO` → `INT`; `ENCERRADO` → `FT`.

## Used by
- Overlay page `PlacarModel.jsx` via `usePlacarBroadcast(placarModelStore)`.

## Conventions
- Keep `forwardRef`. Do NOT use shared `Entrada` keyframes here (this cartão has its own glassmorphism language).
