# PainelProximasRodadas (agent docs)

Control form (painel) for the "Próxima Rodada" module. Edits scheduled fixtures in the `proximasRodadas` store and imports the next round from the FGF.

## Store / Hook
- `usePlacarBroadcast(proximasRodadas)` from `../store/proximasRodadasStore`.
- Actions: `atualizarCampo`, `atualizarRodada`, `atualizarJogo`, `removerRodada`, `adicionarRodada`, `adicionarJogo`, `removerJogo`, `preencherDaFGF`, mostrar/`ocultar`.
- FGF: `importarProximasRodadasFGF()` from `../services/fgfService`.

## Layout
- Dark card (`#0d0d0d`, `#1f1f1f` border), Rajdhani title.
- Título input (max 32).
- One `SecaoRodada` per `estado.rodadas`, each with:
  - Header: rodada título input (max 24) + "+ Jogo" + ✕ remove-rodada.
  - Game rows: `Entrada (casa sigla, max 4) | × | Entrada (fora sigla, max 4) | ✕`.
- "+ Adicionar rodada" below.

## Actions bar
- "Puxar Próxima Rodada da FGF" (primary) → `preencherDaFGF`; feedback via `carregando`/`erro`/`aviso`.
- "Mostrar overlay" / "Ocultar overlay".

## Usage note
- Unlike `UltimaRodada`, the sigla inputs here are free-text `Entrada`s, not `SeletorSigla`.

## Used by
- `ControleProximasRodadas.jsx` page.
