# useFundoTransparente (agent docs)

Hook that makes `html` and `body` backgrounds transparent so the app can be used as an **OBS browser source** (overlays).

## Usage
```js
useFundoTransparente()
```
Call at the top of any overlay page/component. It runs once on mount (`useEffect` with empty deps) and **restores the previous backgrounds on unmount**.

## Details
- Sets `document.documentElement.style.background = 'transparent'` and `document.body.style.background = 'transparent'`.
- Restores the exact prior inline styles in the cleanup fn — do NOT call the hook in a way that races/unmounts often, or it will flicker the overlay.
- This is what allows overlay pages (e.g. `PlacarBroadcast*`, `Tabela`, `PreJogo`, etc.) to sit transparently over a stream.

## Conventions
- Every overlay page calls this. Control pages and `Hub`/`LandingPage` do NOT.
- Overlays rendered in OBS rely on both this hook and the reset of `<body>`/`html` in CSS being no-ops, so keep the hook's cleanup symmetric.
