# PainelOitavas (agent docs)

Stateless presentational card that wraps `ListaOitavas` with a header and horizontal scroll. Used on the landing page / hub for the round-of-16 section.

## Props
- `estado` — expects `estado.confrontos` (array of matches).

## Render
- `Cartao` (max-width 1280px) with gradient surface, 1px translucent border, rounded 16px, deep shadow.
- `TituloSecao`: header with 4px `#a5ef1c` left accent, `<h2>Oitavas de final</h2>` (Inter, 800) and a right `<span>{confrontos.length} CONFRONTOS</span>` (Rajdhani).
- `Rolagem` (overflow-x auto) wrapping `<ListaOitavas confrontos={estado.confrontos} />`.

## Dependencies
- `ListaOitavas` — the actual match table.

## Used by
- `LandingPage` (landing section for the oitavas, not a broadcast overlay).

## Conventions
- Purely presentational — reads data from a prop, does not subscribe to any store.
- Distinct from `PainelChaveamento` (which renders the bracket for fases finais).
