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
- Firebase Realtime Database (sincronização em tempo real entre dispositivos)
- BroadcastChannel + localStorage (sincronização instantânea entre abas do mesmo navegador)

## Como usar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra no navegador:
- **Landing:** `http://localhost:5173`
- **Hub:** `http://localhost:5173/hub`
- **Placar:** `http://localhost:5173/placar-broadcast`
- **Controle do placar:** `http://localhost:5173/placar-broadcast/controle`

### Em múltiplos dispositivos

A sincronização roda na nuvem via **Firebase Realtime Database** — sem servidor próprio e sem precisar estar na mesma rede.

1. Copie `.env.example` para `.env.local` e preencha com as credenciais do seu projeto no [Firebase Console](https://console.firebase.google.com) (Realtime Database)
2. No controle do placar, digite uma **sala** no campo "Sala" do topo (ex.: `jogo1`) e clique em **Copiar link**
3. Cole esse link no navegador/OBS do outro computador — qualquer mudança no controle reflete em todas as telas em tempo real
4. Salas diferentes ficam isoladas: dá para operar partidas simultâneas sem conflito de estado

Sem as variáveis do Firebase, o site funciona normalmente, mas a sincronização fica limitada ao mesmo navegador (BroadcastChannel).

### Como funciona a sala (`?sala=`)

- Cada página lê o parâmetro `?sala=` da URL para decidir qual espaço de estado usar no Firebase (`salas/{sala}/{canal}`). **Sem o parâmetro, todos entram na sala `padrao`** — por isso o link simples do Netlify já sincroniza entre dispositivos sem configuração extra.
- Dispositivos com a **mesma sala** compartilham tudo em tempo real: o que é digitado no controle aparece nos overlays, prévias e OBS abertos com essa sala.
- Salas diferentes são totalmente **isoladas**: dá para transmitir dois jogos ao mesmo tempo (ex.: `?sala=jogo-a` e `?sala=jogo-b`) sem interferência.
- A troca de sala recarrega a página — os stores leem a sala apenas no carregamento. O campo "Sala" no topo dos controles faz isso automaticamente ao aplicar.
- **Exclusividade de controle**: em cada sala, apenas um dispositivo publica por vez (indicador "● Você controla" no cabeçalho). Ao interagir com um controle livre, ele assume automaticamente; se outro dispositivo estiver no comando, aparece um aviso âmbar com o botão **Assumir**. Quem não tem o controle continua recebendo todas as atualizações normalmente — assim os estados nunca "brigam" nem piscam na tela.
- Se quem controla fechar a aba ou perder a conexão, o controle é liberado sozinho em segundos (heartbeat + `onDisconnect` do Firebase).

## Build

```bash
npm run build
```

## Deploy no Netlify

O projeto já inclui `netlify.toml` e está publicado em **https://pelotense-esportes.netlify.app**. Para publicar:

1. Conecte o repositório no [Netlify](https://app.netlify.com)
2. Build command: `npm run build` (já configurado no `netlify.toml`)
3. Publish directory: `dist` (já configurado)

> **Nota:** Para a sincronização funcionar entre dispositivos no site publicado, cadastre as variáveis `VITE_FIREBASE_*` em *Site configuration → Environment variables* e dispare um novo deploy (elas só valem em builds feitos depois do cadastro). Sem elas, os overlays funcionam normalmente, mas cada dispositivo fica com estado independente.
>
> As chaves do Firebase no cliente são públicas por natureza — a segurança fica nas regras do Realtime Database (acesso liberado apenas em `salas/$sala`).

## Histórico de mudanças

Veja [CHANGELOG.md](./CHANGELOG.md) para o registro detalhado de tarefas e correções.
