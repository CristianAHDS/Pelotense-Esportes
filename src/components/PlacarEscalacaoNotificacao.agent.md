# PlacarEscalacaoNotificacao (agent docs)

Transient notification renderer used by the **Escalação broadcast** overlay to briefly show a goal/card event (via `SubstituicaoCartao`) that auto-hides after a few seconds.

## Props
- `notificacao` — event object; `null`/falsy renders nothing. Fields:
  - `id` — used to re-trigger the show/hide effect (dependency).
  - `em` — epoch ms timestamp (used to discard events older than 9s).
  - `tipo` — `'gol'` | `'cartao'`
  - `cor` (`corTime`?) — team color for the carte (falls back to `#a5ef1c`).
  - `sigla` (fallback `'TIME'`), `nome`
  - `minuto` — if null, uses `tempoMinuto` prop.
  - `num`, `indice`, `entraNum`, `entraNome`
- `tempoMinuto` — current match clock string used when the event has no `minuto`.

## Behavior
- Local `atual` state mirrors the incoming `notificacao`.
- A 1s `setInterval` re-renders (`forcarTick`) so `tempoMinuto` stays live.
- Effect on `notificacao?.id`: if older than 9s (`Date.now() - em > 9000`) → ignore (`setAtual(null)`); otherwise set it and auto-clear after 6000ms.
- If `atual` is null → renders `null`.
- Builds a `dados` object and delegates rendering to `<SubstituicaoCartao />`.

## Used by
- `PlacarBroadcastEscalacao.jsx` overlay (transient event popups on the escalation broadcast).

## Conventions
- Do not add animation here — `SubstituicaoCartao` already animates in with its `Entrada` keyframe.
- Keep the auto-hide timings (9s stale / 6s visible) as constants in the component.
