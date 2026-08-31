# PainelPlacarModel (agent docs)

Control form (painel) for the "Placar Model" module — a full match manager (times, goals, cards, colors, cronômetro, período, acréscimo, estado). Edits `placarModelStore`. Structured as three internal sub-painéis.

## Store / Hook
- `LOJA = { getEstado, inscrever }` passed to `usePlacarBroadcast(LOJA)`.
- Actions from `../store/placarModelStore`: `definirTime`, `gol`, `alternarCronometro`, `zerarCronometro`, `ajustarSegundos`, `definirPeriodo`, `definirEstadoPartida`, `definirAcrescimo`, `definirCorPreset`, `darCartao`, `removerCartao`, `alternarEscudos`, `resetarPartida`, `segundosAtuais`, `formatarTempo`.
- Uses exported constants: `PERIODOS`, `ESTADOS_PARTIDA`, `CORES_PRESET`.

## Sub-painéis
- **PainelTimes** (right or first): per home/visitor — `SeletorSigla`, goal `− / N / +` (decrement disabled at 0), card +/- controls (yellow `#eab308`, red `#ef4444`), and color swatches (`CORES_PRESET`, active matched on `cor` + `corBorda`). Uses `definirCorPreset(lado, c)` (preset carries both fill and border color).
- **PainelCronometro**: big live display (`segundosAtuais`/`formatarTempo`, green when running), Iniciar/Pausar, Zerar (disabled running), ±30s / ±1min adjust.
- **PainelPartida**: Período chips, Acréscimo stepper+input+"Sem", Estado da partida chips, Exibição "Escudos visíveis/ocultar", and a double-confirm "Resetar partida inteira" (red) with an `#f59e0b` note that it resets goals/clock/period and restores default names/colors.

## Gotchas
- Three internal components each call `usePlacarBroadcast(LOJA)` separately — keep them consistent.
- `resetarPartida` requires double-click confirm (4s window via `confirmar` state + timeout).
- All local `useState` inside components (never module top-level).

## Used by
- `ControlePlacarModel.jsx` page.
