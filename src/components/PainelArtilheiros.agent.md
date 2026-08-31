# PainelArtilheiros (agent docs)

Control form (painel) for the "Artilheiros" module. Edits the top-scorers list in the `artilheiros` store and imports them from the FGF.

## Store / Hook
- `usePlacarBroadcast(artilheiros)` from `../store/artilheirosStore`.
- Actions: `atualizarCampo`, `atualizarJogador`, `removerJogador`, `adicionarJogador`, `preencherDaFGF`, mostrar/`ocultar`.
- FGF: `importarArtilheirosFGF()` from `../services/fgfService`.

## Layout
- Dark card (`#0d0d0d`, `#1f1f1f` border, `margin-top:40px`), Rajdhani title.
- Título input (max 32).
- Player rows (edits `slice(0,5)`): `pos (1-99) | nome (max 24) | SeletorSigla | gols (0-99) | ✕`.
- "+ Adicionar jogador" below.

## Actions bar
- "Puxar artilheiros da FGF" (primary) → `preencherDaFGF`; feedback via `carregando`/`erro`/`aviso`.
- "Mostrar overlay" / "Ocultar overlay".

## Used by
- `ControleArtilheiros.jsx` page.
