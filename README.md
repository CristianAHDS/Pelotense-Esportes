# Pelotense Esportes

Placar de futebol profissional estilo broadcast para transmissões ao vivo, streams e telões.

**Site publicado:** [https://pelotense-esportes.netlify.app](https://pelotense-esportes.netlify.app)

## Funcionalidades

- Placar compacto estilo TV com siglas dos times, gols, cronômetro e período
- Design flat profissional com alto contraste
- Cores presetadas com fundo e borda para cada time
- Animação de gol
- Sincronização em tempo real entre dispositivos via WebSocket
- Preview ao vivo no painel de controle
- Fundo transparente na visualização (ideal para OBS)

## Tecnologias

- React 18 + Vite
- Styled Components
- React Router (Hash)
- WebSocket + BroadcastChannel + localStorage (sync)
- Node.js (servidor de relay integrado ao Vite)

## Como usar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (app + WebSocket relay)
npm run dev
```

Abra no navegador:
- **Hub:** `http://localhost:5173`
- **Placar (display):** `http://localhost:5173/#/placar-broadcast`
- **Controle:** `http://localhost:5173/#/placar-broadcast/controle`

### Em múltiplos dispositivos

1. Inicie `npm run dev` na máquina principal
2. Nos outros dispositivos da mesma rede, acesse `http://<IP-DA-MÁQUINA>:5173`
3. Abra o placar em um e o controle em outro — tudo sincroniza automaticamente

## Build

```bash
npm run build
```

## Deploy no Netlify

O projeto já inclui `netlify.toml` e está publicado em **https://pelotense-esportes.netlify.app**. Para publicar:

1. Conecte o repositório no [Netlify](https://app.netlify.com)
2. Build command: `npm run build` (já configurado no `netlify.toml`)
3. Publish directory: `dist` (já configurado)

> **Nota:** O WebSocket relay para sincronização entre dispositivos roda apenas no servidor de desenvolvimento (`npm run dev`). No Netlify o placar funciona normalmente, mas a sincronização fica limitada ao BroadcastChannel (mesmo dispositivo).
