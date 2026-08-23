# Pelotense Esportes

Plataforma de graficação ao vivo para transmissões de futebol: placares broadcast, classificação sincronizada com a FGF e chaveamento de mata-mata — tudo em tempo real, pronto para OBS, streams e telões.

**Site publicado:** [https://pelotense-esportes.netlify.app](https://pelotense-esportes.netlify.app)

## Módulos

| Rota | Descrição |
| --- | --- |
| `/` | Landing institucional do projeto |
| `/hub` | Catálogo do sistema, com prévias ao vivo de cada overlay |
| `/placar-broadcast` · `/controle` | Placar completo com cronômetro e período (layouts padrão, PL, BL e LL) |
| `/tabela` · `/controle` | Classificação do Gauchão A2 sincronizada com o site da FGF |
| `/mata-mata` | Confrontos das oitavas de final em formato tabela |
| `/fases-finais` | Chaveamento quartas → final, com avanço automático dos vencedores e selo de campeão |
| `/substituicao` · `/controle` | Cartão animado de substituições |
| `/penaltis` · `/controle` | Disputa de pênaltis cobrança a cobrança |

Cada overlay tem sua página de controle na rota `/controle` correspondente.

## Tecnologias

- React 18 + Vite
- Styled Components
- React Router (`BrowserRouter`, URLs limpas sem hash)
- WebSocket + BroadcastChannel + localStorage (sincronização entre abas e dispositivos)
- Node.js (relay WebSocket integrado ao Vite)

## Como usar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (app + relay WebSocket)
npm run dev
```

Abra no navegador:
- **Landing:** `http://localhost:5173`
- **Hub:** `http://localhost:5173/hub`
- **Placar:** `http://localhost:5173/placar-broadcast`
- **Controle do placar:** `http://localhost:5173/placar-broadcast/controle`

### Em múltiplos dispositivos

1. Inicie `npm run dev` na máquina principal
2. Nos outros dispositivos da mesma rede, acesse `http://<IP-DA-MÁQUINA>:5173`
3. Abra o overlay em um dispositivo e o controle em outro — tudo sincroniza automaticamente

## Build

```bash
npm run build
```

## Deploy no Netlify

O projeto já inclui `netlify.toml` e está publicado em **https://pelotense-esportes.netlify.app**. Para publicar:

1. Conecte o repositório no [Netlify](https://app.netlify.com)
2. Build command: `npm run build` (já configurado no `netlify.toml`)
3. Publish directory: `dist` (já configurado)

> **Nota:** O relay WebSocket para sincronização entre dispositivos roda apenas no servidor de desenvolvimento (`npm run dev`). No Netlify os overlays funcionam normalmente, mas a sincronização fica limitada ao BroadcastChannel (mesmo dispositivo).

## Histórico de mudanças

Veja [CHANGELOG.md](./CHANGELOG.md) para o registro detalhado de tarefas e correções.
