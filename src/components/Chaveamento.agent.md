# Chaveamento (agent docs)

Visual bracket (chaveamento) for the final-phase tournament phases — quartas → semi → final, with elbow connectors, score chips and a champion banner. Rendered inside `PainelChaveamento`.

## Props
- `estado` — object keyed by phase: `confrontos`, `quartas`, `semi`, `final`. Each is an array of confrontos `{ casa, visitante }` where each side is `{ sigla, nome, cor, escudo, gols, pen }`.
- `fases` (array, optional) — which phase columns to render (`'quartas'`, `'semi'`, `'final'`). When omitted/empty renders all four (`confrontos` + the three).

## Helpers (local)
- `urlEscudo(lado)` — `/escudos/SIGLA.png` for `^[A-Z]{3,4}$`.
- `vazio(lado)` — true when side is undefined or `sigla==='---'` with no name.
- `vencedorDe(c)` — compares gols, then penalties (`pen`), returning `'casa'`/`'visitante'` or null on a tie.

## Render
- `Grade` (flex, horizontal, scrollable; column under 760px) of phase `Coluna`s.
- Each column: a `RotuloPill` (e.g. "QUARTAS · 4") and `Pares` grouping confrontos by 2 (`agruparEmPares`), each `Par` drawn with vertical rail + horizontal elbow connector (hidden on the last column via `$ultimo`).
- Each `Jogo` = `CartaoJogo` with two `Lado` rows (`CASA`/`FORA`): escudo chip (28px), sigla+name, goal chip (gols + `{pen}P`), winner highlighted green / loser dimmed 0.45. Empty side → "A DEFINIR".
- Last phase: `$destaque` glow border + a `FaixaCampeao` "CAMPEÃO · SIGLA" on the winning game.

## Style
- Palette: dark `#121212/#0a0a0a` cards, accent `#a5ef1c` (`ACC`), neutral rail `rgba(165,239,28,0.3)`. Rajdhani numbers, Inter body.

## Integration
- `PainelChaveamento` renders it with `fases={['quartas','semi','final']}` for the "Fases finais" card.

## Conventions
- `vencedorDe` logic is intentionally duplicated in `ListaOitavas` — keep the two in sync if the rules change (goals then penalties).
