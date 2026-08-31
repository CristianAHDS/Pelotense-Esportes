# PainelEscalacaoBroadcast (agent docs)

Control form (painel) for the **broadcast-integrated** lineup — the most complete escalação editor: team identity + per-player cards (yellow/red), goals and substitutions, all tied to the running placar broadcast clock. Edits `placarBroadcastEscalacaoStore` (different from the standalone `escalacaoStore` used by `PainelEscalacao`).

## Store / Hook
- `usePlacarBroadcast(placarBroadcastEscalacao)` from `../store/placarBroadcastEscalacaoStore`.
- Reads `estado.escalacao` (the lineup object) and `estado.cronometro`.
- Actions imported from the store: `FORMACOES`, `atualizarEscalacaoCampo`, `preencherDeSigla`, `atualizarJogador`, `darCartaoJogador`, `removerCartaoJogador`, `realizarSubstituicao`, `marcarGol`, `mostrarEscalacao`, `ocultarEscalacao`, `segundosAtuais`.

## Layout (per side: casa / fora)
- Cor (`CoresFixas`), Sigla (`SeletorSigla` → `preencherDeSigla`), Nome, Formação (select from `FORMACOES`), Técnico.
- Player list, each row: `EntradaNum` | nome input | yellow-card button (toggles/removes, shows count `A`) | red-card button (`V`) | ⚽ gol | ⇄ "marcar para sair" toggle.
- When a player is marked to leave (`sair[lado] !== null`), an inbound "Entra (nome) + Nº" row appears → "Confirmar troca" calls `realizarSubstituicao` with `minuto: formatarMinuto(estado.cronometro)`.

## Actions
- "Mostrar escalação na tela" / "Ocultar escalação da tela" (toggle via `estado.escalacaoVisivel`).

## Gotchas
- Local state: `sair` (`{ casa, fora }` player index) and `entra` (`{ casa, fora: { num, nome } }`) — inside the component.
- `marcarGol` / card buttons do NOT need local confirm (immediate).
- Red card on a player: no auto-sub needed; uses `removerCartaoJogador`.
- Reuses `CoresFixas` and `SeletorSigla`. `CampoNomeDois`/`NomeParte` are local helpers.
- This store is one of the 9 placar stores whose clock-reset-on-sync was fixed (trusts `iniciadoEm`).

## Used by
- `ControlePlacarBroadcastEscalacao.jsx` (broadcast lineup control).
