# PainelRodadaAtual (agent docs)

Control form (painel) for the "Rodada Atual" module. Edits the `rodadaAtual` store with the current round's games and their live scores, plus a "Puxar Rodada Atual do SuperPlacar" importer.

## Store / Hook
- `usePlacarBroadcast(rodadaAtual)` from `../store/rodadaAtualStore`.
- Uses actions: `atualizarCampo`, `atualizarRodada`, `atualizarJogo`, `adicionarRodada`, `removerRodada`, `adicionarJogo`, `removerJogo`, `preencherDaRodada`, `mostrar`, `ocultar`.
- Dados: `importarRodadaAtualSuperPlacar({ forcar: true })` from `../services/superPlacarService` (sem FGF).

## Layout
- Dark card (`#0d0d0d`, `#1f1f1f` border), Rajdhani title with green `●`.
- Título input (max 32).
- One `SecaoRodada` per round: round title input + "+ Jogo" + remove.
- Game rows: `casaSigla | casaGols | × | foraGols | foraSigla | ✕remover` (goals via `EntradaNum` 0-99).
- "+ Adicionar rodada" below the sections.

## Actions bar
- "Puxar Rodada Atual do SuperPlacar" (primary) with loading/error/aviso feedback — always fetches the round currently shown on SuperPlacar (no manual round number).
- "Mostrar overlay" / "Ocultar overlay".

## Gotchas
- Local state: `carregando`, `erro`, `aviso` (inside the component).
- `preencherDaRodada` expects `{ titulo, jogos }` where `jogos = [{ casaSigla, casaGols, foraGols, foraSigla }]`.
- O overlay (`RodadaAtual.jsx`) atualiza sozinho do SuperPlacar a cada 30s; o painel tem o botão manual.

## Used by
- `ControleRodadaAtual.jsx` page.
