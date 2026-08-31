# Escudo (agent docs)

Shield/crest for a team. Renders a PNG image if a valid URL is available, otherwise falls back to a generated SVG escudo.

## Props
- `cor` (string) — fill color for the SVG fallback (used as `.campo` fill). Any CSS color.
- `sigla` (string) — team acronym; uppercased and truncated to 4 chars (`slice(0,4)`) inside the SVG `text`.
- `url` (string) — explicit image URL (escudo). If present and the image loads, it wins.
- `tamanho` (number, default `22`) — pixel size (image max-height; SVG width).

## Behavior / Gotchas
- Image branch: internal `erro` state (reset via `useEffect` whenever `url` changes); on `<img onError>` it flips to the SVG fallback. This prevents a broken `<img>` from showing when the assets/escudos file is missing.
- SVG fallback is a shield path in a `viewBox 0 0 24 27`, with `.campo` (cor), `.faixa`, `.brilho` sub-paths and a centered `text` (team color `#fff`, dark stroke via `paint-order: stroke`).
- `Moldura` container keeps fixed height = `tamanho` px so images of differing aspect ratios align.
- `aria-hidden="true"` on the SVG (decorative).
- No `useFundoTransparente` (decorative leaf, used inside cards/tables).

## Used by
- `Chaveamento`, `ListaOitavas`, `UltimaRodadaCartao`, `EscalacaoCartao`, `SubstituicaoCartao` (and other cartões) — pass URL like `/escudos/SIGLA.png`.

## Conventions
- Teams' real colors are preserved (prefer passing the team's `cor`, not a fixed gray).
- Always give a gray fallback (`#1f1f1f` / `#4b5563`) when color unknown.
