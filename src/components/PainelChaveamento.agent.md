# PainelChaveamento (agent docs)

Stateless presentational card that wraps `Chaveamento` (the fases-finais bracket) with a header, footer and a "Sincronizado em tempo real" live badge. Used on the landing page / hub.

## Props
- `estado` — bracket data (see `Chaveamento`): keyed `quartas`, `semi`, `final` (+ optional `confrontos`).

## Render
- `Cartao` (max-width 1280px) with gradient surface, translucent border, rounded 16px, deep shadow.
- `TituloSecao`: header with 4px `#a5ef1c` left accent, `<h2>Fases finais</h2>` (Inter 800) and a Rajdhani right span "QUARTAS · SEMIFINAL · FINAL".
- `Rolagem` (overflow-x auto) wrapping `<Chaveamento estado={estado} fases={['quartas','semi','final']} />`.
- `Rodape`: legend "Vencedor do confronto" (green square swatch) + `SeloAoVivo` "Sincronizado em tempo real" with a pulsing red dot (`pulsoChaveamento` keyframes, `theme.cores.perigo`).

## Used by
- `LandingPage` (fases-finais section).

## Conventions
- Purely presentational; reads from a prop, no store subscription.
- Distinct from `PainelOitavas` (oitavas table).
