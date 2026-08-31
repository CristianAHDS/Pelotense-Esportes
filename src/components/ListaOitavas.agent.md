# ListaOitavas (agent docs)

Table-format list of the round-of-16 (oitavas) matches: `JOGO · CASA · GOL × GOL · VISITANTE`. Rendered inside `PainelOitavas`.

## Props
- `confrontos` — array of `{ casa, visitante }`, each side `{ sigla, nome, cor, escudo, gols, pen }`.

## Helpers (local)
- `urlEscudo(lado)` — `/escudos/SIGLA.png` for `^[A-Z]{3,4}$`.
- `vazio(lado)` — undefined or `sigla==='---'` with no name.
- `vencedorDe(c)` — goals then penalties; `'casa'`/`'visitante'`/null.

## Render
- `Grade` (min-width 680px so it scrolls horizontally inside the painel's `Rolagem`).
- Header row: JOGO | CASA | GOL | × | GOL | VISITANTE (green `.centro` labels).
- One `LinhaJogo` per confronto: match number (`01`, `02` … with a green dot), home block (name + sigla + escudo 26px, right-aligned), goal cell (goals + `(pen)` if any), `×` separator, visitor block reversed, away goal cell.

## Highlighting
- Winner side: accent (`#a5ef1c`) name/sigla/goals via `$destaque='sim'`; loser dimmed to `0.45` (`'fora'`). Empty sides get `.vazio` (opacity 0.3).

## Integration
- `PainelOitavas` provides the bordered card + scroller + header; this is the inner list.

## Conventions
- `vencedorDe` is duplicated in `Chaveamento` — keep both in sync (goals then penalties).
