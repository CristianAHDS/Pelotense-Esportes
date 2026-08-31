# PreviaOverlay (agent docs)

Live iframe preview of an overlay, embedded inside the corresponding control page. Lets the operator see the actual overlay with current room state without opening OBS.

## Props
- `rota` (string, required) — the overlay route path, e.g. `/ultima-rodada`, `/placar`.
- `altura` (number, default `360`) — iframe height in px.

## Behavior
- `src = ${window.location.origin}${rota}?previa=1${sala ne 'padrao' ? '&sala=' + sala : ''}`.
- Includes `?previa=1` so the overlay renders in compact preview layout.
- Reads `salaAtual()` and passes the sala to the iframe so both control + preview share the same room.
- **↻ Recarregar** button bumps a `chave` state to remount the iframe (`key={chave}`) forcing a fresh reload.
- Header bar: pulsing green dot (`#a5ef1c` `pulsar` keyframes) + "Prévia ao vivo" label + reload.
- iframe background is a repeating checkerboard so transparency is visible.

## Conventions
- The iframe only *listens* to the room state; it never publishes. Keep it that way.
- `altura`/`preview` shown on `Hub` cards are separate — this component is only used inside control pages (`Controle*` via `src/pages`).
