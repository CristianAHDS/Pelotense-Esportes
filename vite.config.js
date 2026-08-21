import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { WebSocketServer } from 'ws'

function syncPlugin() {
  const estados = {}

  return {
    name: 'pelotense-sync',
    configureServer(server) {
      const wss = new WebSocketServer({ noServer: true })

      server.httpServer.on('upgrade', (req, socket, head) => {
        if (req.url.startsWith('/pelotense-sync')) {
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req)
          })
        }
      })

      wss.on('connection', (ws) => {
        console.log(`[Sync] Cliente conectado (total: ${wss.clients.size})`)

        for (const tipo of Object.keys(estados)) {
          if (estados[tipo]) {
            ws.send(JSON.stringify({ tipo, estado: estados[tipo] }))
          }
        }

        ws.on('message', (data) => {
          try {
            const msg = JSON.parse(data.toString())
            if (msg.tipo && msg.estado) {
              estados[msg.tipo] = msg.estado
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === 1) {
                  client.send(data.toString())
                }
              })
            }
          } catch (e) {
            console.warn('[Sync] Mensagem inválida:', e.message)
          }
        })

        ws.on('close', () => {
          console.log(`[Sync] Cliente desconectado (total: ${wss.clients.size})`)
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), syncPlugin()],
  server: {
    port: 5173,
    open: false
  }
})
