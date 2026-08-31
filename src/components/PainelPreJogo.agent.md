# PainelPreJogo (agent docs)

Control form (painel) for the "Pré-Jogo" module — a countdown timer plus which two teams/escudos are shown. Edits the `preJogoStore`.

## Store / Hook
- Builds `LOJA = { getEstado, inscrever }` locally and passes it to `usePlacarBroadcast(LOJA)` (does NOT import the store object directly).
- Actions imported from `../store/preJogoStore`: `definirTime`, `definirDuracao`, `alternarCronometro`, `zerarCronometro`, `mostrar`, `ocultar`, `resetar`, `segundosRestantes`, `formatarTempo`.

## Layout
- Dark card, Rajdhani title "Pré-Jogo" with green `●`.
- Two-column grade.
- **Timer**: big live display (`formatarTempo(segundosRestantes(cronometro))`, green when running), duration chips (`DURACOES_MIN` = 30..150 min), ▶/⏸ Iniciar/Pausar + ⟲ Zerar (Zerar disabled while running).
- **Times e escudos**: a `SeletorSigla` per side (casa / visitante) calling `definirTime(lado, sigla)`.

## Actions bar
- Mostrar overlay / Ocultar overlay / Resetar.

## Gotchas
- Local `tick` state re-renders every 500ms (live countdown preview).
- `definirDuracao(m * 60)` stores seconds.
- All local UI state lives inside the component, not module scope.

## Used by
- `ControlePreJogo.jsx` page.
