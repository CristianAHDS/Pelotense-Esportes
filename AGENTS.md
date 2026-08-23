# AGENTS — Guia do projeto

Guia para agentes (e pessoas) trabalhando neste repositório.

## Stack
- **Vite + React 18** (JavaScript, sem TypeScript)
- **React Router** com `BrowserRouter` — rotas limpas, sem hash (`/#/...` está errado)
- **styled-components** com tema global em `src/theme.js` (cores, fontes, espaçamentos)

## Comandos
```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção (rodar antes de entregar qualquer tarefa)
npm run preview    # servir o build localmente
```

## Arquitetura

### Páginas (`src/pages/`)
- `LandingPage.jsx` — landing institucional em `/`
- `Hub.jsx` — catálogo do sistema em `/hub`, com cards e prévias ao vivo (iframes `?previa=1`)
- Overlays de transmissão: `PlacarBroadcast*` (padrão/PL/BL/LL), `Tabela`, `MataMata` (oitavas), `FasesFinais` (chaveamento), `Substituicao`, `Penaltis`
- Cada overlay tem sua página de controle: `Controle<X>.jsx` na rota `/controle`

### Stores sincronizados (`src/store/`)
Padrão compartilhado por todos os módulos:
- Estado único + `localStorage` + **BroadcastChannel** para sync entre abas (overlay ↔ controle)
- API: `getEstado()`, `inscrever(fn)`, ações que chamam `setEstado()` internamente
- O hook `src/hooks/usePlacarBroadcast.js` consome `{ getEstado, inscrever }` nas páginas

### Componentes (`src/components/`)
- `Escudo` — recebe `{ cor, sigla, url, tamanho }`; tenta `/escudos/SIGLA.png` como fallback
- `PainelOitavas`, `PainelChaveamento`, `Chaveamento`, `ListaOitavas` — mata-mata
- `Header` — usado nos controles; overlays usam botão "←" voltar para `/hub`

## Convenções
- **Paleta**: fundo escuro (#060606/#0d0d0d), acento neon **#a5ef1c**. Cores de times da A2 (ex.: `#008F3D`) são preservadas — não trocar pelo neon.
- **Fontes**: Rajdhani (títulos/números), Inter (corpo), via `theme.fontes`.
- **Overlays**: fundo transparente para OBS via `useFundoTransparente`; parâmetro `?previa=1` esconde o botão voltar e compacta o layout (usado nas prévias do hub).
- **Novos módulos**: criar store próprio seguindo o padrão acima, página de overlay + página `Controle*`, rota em `App.jsx` e card no `Hub.jsx`.
- Sem comentários no código; mensagens de commit em português, estilo resumo curto.

## Registro de tarefas (obrigatório)
- **Toda tarefa concluída deve ser registrada em `CHANGELOG.md`**, na seção da data correspondente.
- Formato: título curto da mudança + descrição objetiva do que foi feito (novidades e correções).
- Nunca apagar entradas antigas: o arquivo é o histórico acumulado do projeto.
- Ao criar/editar este guia ou o README, aprove a mesma entrega para atualizar o changelog.

## Armadilhas conhecidas
- Iframes de prévia do hub têm 720–760px de largura: breakpoints de media query precisam ficar **abaixo** disso.
- Grades com `nth-child` fixo quebram ao adicionar/remover cards — revisar spans.
- Ao mudar assinatura de ação de um store, atualizar todos os controles que a usam.
