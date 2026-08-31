# PainelSubstituicao (agent docs)

Control form (painel) for the "Substituição" module — edits the substitution notification card. Parameterized over the store (`loja` prop, default `substituicaoPro`).

## Props
- `loja` — a store object exposing `{ rotulo, atualizarCampo, mostrar, ocultar }` + a `usePlacarBroadcast`-compatible shape. Default `substituicaoPro` from `../store/substituicaoStore`. Because it's parameterized, the same panel serves multiple substituição store variants (e.g. pro / shift).

## Data edited (state fields)
- `corTime` (`CoresFixas`), `nomeTime` (max 24), `siglaTime` (`SeletorSigla`), `minuto` (free text, max 6, placeholder `67'`).
- `saiNum` (0-99) + `saiNome` (max 22) — "Jogador que sai ↓".
- `entraNum` (0-99) + `entraNome` (max 22) — "Jogador que entra ↑".

## Actions
- "Mostrar na tela" / "Ocultar da tela" (toggle) via `mostrar`/`ocultar`.

## Title
- Shows `loja.rotulo.toUpperCase()` (e.g. "SUBSTITUIÇÃO").

## Used by
- `ControleSubstituicao.jsx` (and any variant controls) passing the respective store.

## Conventions
- All calls use `loja.atualizarCampo(...)` (parameterized), not a hard-coded store.
- Keep `usePlacarBroadcast(loja)` parameterized so reuse stays correct.
