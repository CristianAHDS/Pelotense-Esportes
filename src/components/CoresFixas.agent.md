# CoresFixas (agent docs)

Fixed preset color grid used instead of a native `<input type="color">` picker. The native picker **oscillated under real-time sync**, so painéis use this fixed palette.

## Props
- `valor` (string) — current hex color (compared case-insensitively).
- `onChange` (fn `(hex) => void`) — called with the selected preset hex.

## Details
- `CORES_PRESET` = 12 named colors: Verde `#008F3D`, Azul `#1a56db`, Vermelho `#dc2626`, Amarelo `#eab308`, Laranja `#ea580c`, Roxo `#7c3aed`, Preto `#1f1f1f`, Branco `#e5e5e5`, Cinza `#4b5563`, Ciano `#0891b2`, Esmeralda `#059669`, Rosa `#db2777`.
- Active swatch gets a white border + `.a5ef1c` glow + `scale(1.08)`.
- Matched against `valor` with `.toLowerCase()` exact equality.

## Used by
- `PainelEscalacao`, `PainelSubstituicao`, `PainelEscalacaoBroadcast` (and other painéis that let the operator pick a team color).

## Conventions
- Same fix: keep the palette DRY — if team colors need extending, add to `CORES_PRESET` here only.
- Team color is stored as hex string in store state; do not introduce random hexes in forms.
