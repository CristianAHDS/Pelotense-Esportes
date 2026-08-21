# Pelotense Esportes

Placar de futebol profissional estilo broadcast para transmissões ao vivo, streams e telões.

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
