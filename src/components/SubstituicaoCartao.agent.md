# SubstituicaoCartao (agent docs)

Unified carte for the "Substituição" overlay covering three event types: substitution (troca), goal (gol) and card (cartão). No `forwardRef`.

## Exports
- `urlEscudoTime(escudo, sigla)` (shared with `EscalacaoCartao`).
- `SubstituicaoCartao({ dados })`.

## Props / data (from `substituicaoStore`)
- `tipo` — `'troca'` (default) | `'gol'` | `'cartao'`
- `corTime` (hex, default `#16a34a`), `siglaTime`, `nomeTime`, `escudoTime`, `minuto`
- `saiNum`, `saiNome`, `entraNum`, `entraNome`
- `cartaoCor` — `'amarelo'` | `'vermelho'` (used when `tipo === 'cartao'`)

## Render (per tipo)
- **troca**: topo + two rows "↓ Sai" (red arrow, struck-through name, dimmed) and "↑ Entra" (green arrow, highlighted green gradient bg).
- **gol**: topo + one row with ⚽ golf ball icon (green highlight) and the event escudo on the right.
- **cartao**: topo + one row with yellow/red card icon and label "Cartão Amarelo/Vermelho".
- All share: 6px `#a5ef1c` left border, black bg, `Entrada` animation, min-width 380px (300px under 520px).
- `corContraste(hex)` used for the topo text color over the team color.

## Used by
- `Substituicao.jsx` overlay via `usePlacarBroadcast(substituicaoStore)`.
- `PlacarEscalacaoNotificacao` builds a `dados` object to render a transient gol/cartão notificação through this same carte.

## Conventions
- The whole cartão (not just a sub-part) is what animates in — used as a live notification, so it mounts/unmounts.
