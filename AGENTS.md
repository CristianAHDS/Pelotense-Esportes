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

## Como criar um novo módulo (padrão)
Copiar o esqueleto do módulo `ultimaRodada` (mais simples) ou `tabela`. Sempre 6 artefatos + integração:

1. **Store** `src/store/<nome>Store.js` — clonar `ultimaRodadaStore.js` e trocar: `STORAGE_KEY`, `CHANNEL_NAME`, `MSG_TIPO`, `CANAL_NUVEM`, `estadoPadrao`, ações e export. Padrão: `getEstado`, `inscrever`, `setEstado`, `normalizarEstado`, persistir + BroadcastChannel + `publicarNuvem`/`inscreverNuvem`. Hook de consumo: `src/hooks/usePlacarBroadcast.js` recebe a loja (`{ getEstado, inscrever }`).
2. **Overlay** `src/pages/<Nome>.jsx` — clonar `UltimaRodada.jsx`: `useFundoTransparente()`, `usePlacarBroadcast(store)`, `?previa=1` compacta, `BotaoSalvarImagem` (opcional).
3. **Cartão** `src/components/<Nome>Cartao.jsx` — render visual do overlay (estilo das tabelas: topo com barra acento verde `#a5ef1c`, `Escudo`, fontes Rajdhani/Inter). Use `forwardRef` para o `BotaoSalvarImagem`.
4. **Painel** `src/components/Painel<Nome>.jsx` — formulário de edição do `Controle*` (estilo `PainelUltimaRodada`: `Cartao`, `Entrada`, `Botao`). Sem `useState` no topo do módulo (fora de componente) — sempre dentro do componente.
5. **Controle** `src/pages/Controle<Nome>.jsx` — clonar `ControleUltimaRodada.jsx`: `Header`, `<Painel<Nome> />`, `<PreviaOverlay rota="/<nome>" />`.
6. **Rotas + card** — `src/App.jsx` (rota overlay + `/controle`) e `src/pages/Hub.jsx` (card na seção Gauchão A2, com `accent`, `glow`, `preview`/`altura` quando houver preview).

**Integração com dados da FGF** (`src/services/fgfService.js`): adicionar função `importar<Nome>FGF` reutilizando `obterHtml()` + cache com `TTL_CACHE_MS` + `localStorage`, e mapear siglas via `SIGLAS_FGF_PARA_PADRAO` + `mapaNomeParaSigla`/`casarSigla`. Preencher o store com ação própria (ex.: `preencherDaFGF`).

## CHANGELOG
Toda tarefa concluída → `CHANGELOG.md` (seção da data). Formato: título + descrição. Nunca apagar entradas.

## Armadilhas
- Iframes prévia: 720–760px → media queries abaixo disso
- `nth-child` fixo quebra com add/remove de cards
- Mudar assinatura de ação → atualizar todos os controles
- Nuvem: JSON serializado (string), não objeto cru
- `VITE_*`: cadastrar/alterar no Netlify = novo deploy
- Sem `VITE_FIREBASE_DATABASE_URL`: sync nuvem é no-op
