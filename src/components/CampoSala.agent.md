# CampoSala (agent docs)

Input + button in the `Header` that shows the current "sala" (sync room) and lets the operator set a different room or copy the room link for OBS.

## Dependencies
- `salaAtual()` from `../lib/sincronizacaoNuvem` — returns the current sala (from `?sala=`, default `'padrao'`).
- `useLocation` from react-router to re-sync the input when the route changes.

## Behavior
- Input synced to `salaAtual()` on mount and whenever `location` changes.
- **Aplicar** (on blur / Enter → blur): sanitizes the value (`[^a-z0-9_-]`, `toLowerCase`, `slice(0,32)`), and if different from current, `window.location.assign(montarUrl(...))` — a full page nav that rebuilds the query string (keeps other params, drops `sala`).
- **Copiar link** button: writes current `window.location.href` to clipboard (uses `navigator.clipboard`, falls back to a hidden textarea + `document.execCommand('copy')`), shows a transient "Copiado!" / "Erro ao copiar" feedback (1.6s timeout).
- Button hidden under `max-width: 900px`; label/input shrink on small screens.

## Used by
- `Header` (which appears on control pages and hub).

## Conventions
- The title/tooltip explains: "Dispositivos com a mesma sala compartilham o estado em tempo real".
- Changing sala reloads the page; do not try to mutate state in-place across rooms.
