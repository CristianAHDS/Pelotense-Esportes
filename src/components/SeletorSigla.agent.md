# SeletorSigla (agent docs)

Pre-built `<select>` for picking a team sigla (acronym) from a fixed list of Gauchão A2 teams. Exported alongside the `SIGLAS_PADRAO` constant.

## Exports
- `SIGLAS_PADRAO` (array of 16 siglas): `APA, AIM, BAG, BFR, BRA, ESP, GAU, GLO, GRA, GUA, LAJ, PAS, PEL, SCR, UFR, VER`.
- `SeletorSigla ({ value, onChange, placeholder })` — the select component.

## Props
- `value` (string) — current sigla (case-insensitive; uppercased internally).
- `onChange` (fn `(sigla) => void`) — called with the raw option value.
- `placeholder` (string, default `'SIGLA'`) — shown as the empty `""` option.

## Behavior / Gotchas
- If the current `value` is NOT in `SIGLAS_PADRAO`, it is **unshifted to the top** of the options so a custom/legacy sigla is never lost from the dropdown.
- Dark styling (bg `#000`, border `#262626`, focus border `#a5ef1c`, uppercase). Wrapped by callers inside a fixed-width `<div style={{ width: 90 }}>` (see painéis).
- Do not translate the siglas; they are the canonical team codes used across stores/FGF mapping.
