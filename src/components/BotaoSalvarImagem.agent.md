# BotaoSalvarImagem (agent docs)

Floating fixed button (top-right) that captures a referenced DOM element to a PNG and downloads it.

## Props
- `alvo` — a React ref (object with `.current`) pointing at the element to capture (usually the cartão rendered with `forwardRef`).
- `nome` (string) — file base name; passed to `slugArquivo()` from `../lib/capturaImagem` to build a safe slug before saving.

## Behavior
- Uses `salvarImagemElemento(elemento, slug)` from `../lib/capturaImagem` (html2canvas-based).
- Internal `salvando` state disables the button and shows "Salvando…" while capturing.
- Errors are caught and `console.warn`-ed; never throws.
- Styled: fixed `top:16px; right:16px; z-index:40;` pill, `#a5ef1c` background, dark text, hover lift.

## Integration
- Overlay pages that want image export (`Tabela`, etc.) mount `<BotaoSalvarImagem alvo={ref} nome="..." />` and attach `ref` to the cartão via `forwardRef`.
- Requires a `ref`-exposed cartão — see `UltimaRodadaCartao` (uses `forwardRef`) as the pattern.

## Conventions
- Keep it optional per overlay (per AGENTS.md: "BotaoSalvarImagem (opcional)").
- Only capture the overlay card itself, never the whole page (html2canvas over the transparent overlay would include page chrome).
