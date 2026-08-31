# Header (agent docs)

Top app bar used by control pages and the hub. Shows logo, title, `CampoSala`, an optional subtítulo, control-claim status, and an optional "Voltar ao hub" link.

## Props
- `subtitulo` (string) — right-side uppercase label (hidden under `640px`).
- `voltar` (boolean) — when true, renders a "← Voltar ao hub" pill link to `/hub`.

## Internal: StatusControle
- Uses `useLocation`; reads `passivo` = pathname is `/hub` or `/` (hub/landing don't claim control).
- Uses `useControleRemoto({ autoReivindicar: !passivo })`.
- Renders nothing on passive pages or when `nuvemAtiva()` is false.
- `status === 'ativo'` → green pill "● Você controla".
- `status === 'bloqueado'` → amber pill "Outro dispositivo controla" + a "Assumir" button calling `assumir`.
- Pill hidden under `900px`.

## Behavior / Gotchas
- Logo uses `LOGO_URL` from `../theme`.
- Title links to `/hub` (PELOTENSE <span>ESPORTES</span>).
- Imports `nuvemAtiva` from `../lib/sincronizacaoNuvem` — if no Fire store URL configured, control status is suppressed.

## Used by
- All `Controle*` pages and `Hub`.
- Not used by overlays (overlay pages have no browser chrome).
