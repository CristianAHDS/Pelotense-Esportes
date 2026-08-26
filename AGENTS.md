# AGENTS.md

## Stack
Vite + React 18 (JS, sem TS) · React Router (BrowserRouter, sem hash) · styled-components (`src/theme.js`)

## Comandos
`npm install` · `npm run dev` · `npm run build` (rodar antes de entregar) · `npm run preview`

## Arquitetura

**Páginas** (`src/pages/`)
- `LandingPage.jsx` → `/` | `Hub.jsx` → `/hub` (cards com iframes `?previa=1`)
- Overlays: `PlacarBroadcast*` (padrão/PL/BL/LL), `Tabela`, `MataMata`, `FasesFinais`, `Substituicao`, `Penaltis`
- Controles: `Controle<X>.jsx` → `/controle`

**Stores** (`src/store/`) — padrão único:
- Estado + localStorage + BroadcastChannel (sync local) + Firebase RTDB (sync nuvem via `src/lib/sincronizacaoNuvem.js`)
- Salas: `salas/{sala}/{canal}`, sala vem de `?sala=` (padrão `padrao`)
- Controle exclusivo: `useControleRemoto` + claim em `salas/{sala}/controle` com heartbeat
- API: `getEstado()`, `inscrever(fn)`, ações via `setEstado()` | Hook: `src/hooks/usePlacarBroadcast.js`

**Componentes** (`src/components/`)
- `Escudo({ cor, sigla, url, tamanho })` — fallback `/escudos/SIGLA.png`
- `PainelOitavas`, `PainelChaveamento`, `Chaveamento`, `ListaOitavas` — mata-mata
- `Header` — controles e hub; inclui `CampoSala` ("Copiar link" para OBS)

## Convenções
- Paleta: fundo #060606/#0d0d0d, acento #a5ef1c. Cores de times preservadas
- Fontes: Rajdhani (títulos), Inter (corpo) via `theme.fontes`
- Overlays: fundo transparente (`useFundoTransparente`), `?previa=1` compacta layout
- Novos módulos: store próprio + overlay + `Controle*` + rota em `App.jsx` + card no `Hub.jsx`
- Sem comentários; commits em português

## CHANGELOG
Toda tarefa concluída → `CHANGELOG.md` (seção da data). Formato: título + descrição. Nunca apagar entradas.

## Armadilhas
- Iframes prévia: 720–760px → media queries abaixo disso
- `nth-child` fixo quebra com add/remove de cards
- Mudar assinatura de ação → atualizar todos os controles
- Nuvem: JSON serializado (string), não objeto cru
- `VITE_*`: cadastrar/alterar no Netlify = novo deploy
- Sem `VITE_FIREBASE_DATABASE_URL`: sync nuvem é no-op
