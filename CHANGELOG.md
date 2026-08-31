# Changelog

## 31/08/2026

### Correção: toggles e remoções não refletiam no overlay até dar refresh
- **Sintoma**: no controle, mudanças de estado que retornavam a um valor já visto (ex.: ocultar e reexibir a escalação, remover o acréscimo do cronômetro) não atualizavam ao vivo no overlay — só sumiam/apareciam após recarregar a página.
- **Causa**: `aplicarEstadoRemoto` suprimia qualquer pacote cuja serialização já estivesse em `ultimosSync`. Ao alternar uma flag para um estado anterior (escalação `true→false→true`, acréscimo `null→X→null`), o pacote novo serializava idêntico a um já registrado e era **descartado**, mesmo o overlay estando num estado diferente.
- **Correção**: removida a checagem `ultimosSync.includes(...)` (eco redundante, já tratado na camada de nuvem via `ehEcoProprio`). O guard agora compara apenas `JSON.stringify(novoEstado) === JSON.stringify(estado)` — idempotente, corrige a dupla entrega (BroadcastChannel + nuvem) sem descartar estados legítimos.
- Aplicado em todos os stores com o padrão de sincronização: `placarBroadcastEscalacaoStore`, `placarBroadcastStore`, `placarBroadcastPLStore`, `placarBroadcastBLStore`, `placarBroadcastLLStore`, `placarNormalStore`, `placarModelStore`, `placarProStore`, `placarStore`, `artilheirosStore`, `escalacaoStore`, `mataMataStore`, `penaltisStore`, `preJogoStore`, `proximasRodadasStore`, `substituicaoStore`, `tabelaStore`, `tabelaCompactaStore` e `ultimaRodadaStore`.

### Placar Broadcast Escalação: notificação de cartão sem linha no nome + padrões de reset
- **Cartão sem riscado**: o nome do jogador no card de cartão amarelo/vermelho não é mais exibido com `line-through`. A decoração só permanece na troca (linha "Sai") — `SubstituicaoCartao` agora usa prop `$riscado` no lugar do `text-decoration` baseado apenas no `$tipo`.
- **Cor padrão do placar**: a cor padrão do scoreboard agora é preta (`#1f1f1f`/`#0a0a0a`), igual ao quadradinho "Preto" da paleta — aplicada a `corCasa`/`corVisitante` e bordas.
- **Reset padrão CASA × VISITANTE**: ao resetar a partida inteira (e no estado inicial), os times iniciam como `CASA` (escalação: `siglaCasa CAS`) e `VISITANTE` — substituindo `BRA`/`PEL`/`PELOTAS`.

### Correção: relógio pulava/voltava ao mudar qualquer informação no controle
- **Sintoma**: no overlay (ex.: `/placar-broadcast-escalacao`), o cronômetro do jogo voltava/pulava sempre que outra informação era alterada no controle (escalação, cartão, nome, etc.).
- **Causa**: `aplicarEstadoRemoto` re-baseara o cronômetro a partir do snapshot `segundos` enviado no pacote de sincronização. Como esse snapshot é gerado no momento da publicação e chega defasado pela latência da nuvem (BroadcastChannel + Firebase), o `diff` excedia o limite e o relógio era reiniciado para o valor **antigo** do snapshot.
- **Correção**: agora o lado remoto **confia no `iniciadoEm`** (carimbo de época, imune à latência) para recomputar o tempo, descartando o `segundos` do pacote — mesmo comportamento já adotado no `preJogoStore`. O `segundos` só é usado para re-basear quando não há referência de tempo confiável (estado antigo/corrompido).
- Aplicado em todos os stores de placar: `placarBroadcastEscalacaoStore`, `placarBroadcastStore`, `placarBroadcastPLStore`, `placarBroadcastBLStore`, `placarBroadcastLLStore`, `placarNormalStore`, `placarModelStore`, `placarProStore` e `placarStore`.

### Documentação de componentes para agentes (`.agent.md`)
- Criado um arquivo `.agent.md` ao lado de cada um dos 28 componentes em `src/components/` (ex.: `Escudo.agent.md`, `PainelPlacarModel.agent.md`, `Chaveamento.agent.md`).
- Cada arquivo documenta para agentes de IA: propósito, props/API, dependências (stores/hooks/services), animações/keyframes, armadilhas e convenções específicas do componente (padrão `Entrada`, `CoresFixas`, `SeletorSigla`, `useFundoTransparente`, `forwardRef` para `BotaoSalvarImagem`, sincronização relógio/`iniciadoEm`, etc.).
- Sem impacto no build (apenas documentação; `npm run build` passa com 147 módulos).

## 28/08/2026

### Placar Broadcast Escalação: gol por jogador, tempo congelado e notificações unificadas
- **Gol pelo jogador**: novo botão ⚽ em cada jogador marca gol — muda o placar automaticamente, incrementa os gols do jogador, aciona o flash de gol no scoreboard e sobe um **card de gol**.
- **Badge de gols na escalação**: ao lado do nome do jogador aparece uma **bolinha de futebol com contador** (badge verde com o total de gols acima da bola, quando >1) — mesmo estilo dos quadradinhos de cartão.
- **Notificações unificadas (mesmo design do Substituição)**: cartão, gol e troca agora usam o mesmo `SubstituicaoCartao` (faixa do time com escudo/sigla/nome/minuto + linha do jogador). Centralizadas no **meio inferior** da tela.
  - **Gol**: ícone de **bola de futebol** na linha do jogador + **escudo do time** no lugar do antigo texto "GOOOL!".
  - **Cartão**: retângulo amarelo/vermelho na linha do jogador + rótulo "Cartão Amarelo/Vermelho".
- **Tempo congelado nas notificações**: cards de cartão, gol e troca agora guardam o **minuto de jogo** no momento do clique (não os segundos, e sem ficar subindo junto com o cronômetro). Armazenado como `minuto` e exibido como `45'`.
- Modelo de jogador ganhou campo `gols` (default/limpeza em elencos, normalização e substituições).
- Ações `marcarGol(lado, indice)` e `notificarGol` no store.

### Placar Broadcast Escalação: auto-preenchimento e ajustes
- **Auto-preenchimento da escalação pela sigla**: novo `src/lib/elencos.js` com elencos-titulares por sigla (16 clubes da Série A2). No painel de escalação, escolher um time no seletor de sigla preenche automaticamente os 11 jogadores (número + nome) e o nome do time daquele lado. Ação `preencherDeSigla` no store.
- **Card de troca com o design do Substituição**: a notificação de troca da escalação agora reutiliza o `SubstituicaoCartao` existente (faixa do time + linhas "↓ sai" e "↑ entra" com números/nomes), em vez do layout antigo.
- **Remover cartões do jogador**: os botões de cartão amarelo/vermelho agora alternam — dar se o jogador não tem, remover se já tem.
- **Layout do controle**: seções com até 3 quadros por linha (responsivo: 3→2→1); na seção de escalação o painel de controles fica mais largo (2fr) que a prévia (1fr); escalação mostra a lista toda sem corte.

### Novo módulo: Placar Broadcast Escalação (`/placar-broadcast-escalacao`)
- Cópia do `/placar-broadcast` com as escalações centralizadas no mesmo link (controle e overlay).
- Controle integrado em uma única página: placar (times/gols, cronômetro, partida) + escalação completa dos dois times + substituição, tudo no mesmo `/controle`.
- Escalações integradas ao placar:
  - Cartões (amarelo/vermelho) são atribuídos **por jogador** na escalação (botões em cada linha).
  - O cartão aparece como traço no scoreboard, como marca ao lado do jogador no grid de escalação e sobe uma **notificação de cartão** no overlay.
  - Ao confirmar uma **troca** (marcar quem sai + quem entra), a escalação é atualizada e sobe a **notificação de troca** (estilo do card de substituição), além de aparecer na prévia.
- Overlay renderiza o placar + os dois grids de escalação quando visíveis; notificações aparecem fixas no meio inferior (autodismiss).
- Estado/sync centralizado em `placarBroadcastEscalacaoStore` (localStorage + BroadcastChannel + nuvem `placar-broadcast-escalacao`).
- `EscalacaoCartao` agora renderiza marcas de cartão por jogador (retrocompatível — sem cartão não exibe nada).

### Pré-Jogo: countdown não reseta mais ao pausar (correção definitiva)
- Corrigido bug em que pausar o countdown do Pré-Jogo ainda o reiniciava (no controle e na visualização), mesmo após tentativas anteriores.
- Causa real: enquanto o countdown roda, fontes de sincronização (tick periódico e/ou snapshots "rodando" defasados já em trânsito na nuvem/BroadcastChannel/localStorage) entregavam um estado "rodando" antigo após o pause. Esse snapshot re-baseava o contador a partir do `segundos` obsoleto (ou registrava um novo `iniciadoEm`) e religava o cronômetro, desfazendo o pause e parecendo um reset.
- Correções aplicadas em `preJogoStore`:
  - Removido o tick periódico de sincronização por completo. A visualização apenas exibe (recomputa o tempo pelo `iniciadoEm` absoluto) e não publica mais nada, eliminando a fonte de snapshots "rodando" concorrentes.
  - `aplicarEstadoRemoto` nunca mais re-baseia um countdown que já tenha `iniciadoEm` válido (referência absoluta); o tempo é sempre recomputado a partir dele, ignorando o `segundos` do snapshot.
  - Estados agora carregam um carimbo `atualizadoEm` (última alteração local). `aplicarEstadoRemoto` aplica last-write-wins e rejeita estados com `atualizadoEm` menor/igual ao atual, descartando ecos antigos; o pause (mais recente) nunca é sobrescrito por um snapshot "rodando" antigo.
  - Guarda reforçada: um estado "rodando" sem `atualizadoEm` (cliente legado) só é aceito se o local ainda não tiver um estado com carimbo — assim um snapshot legado não desfaz um pause já gravado.

### Seletor de siglas nos controles
- Novos campos de sigla agora usam um seletor (`SeletorSigla`) com as siglas padrão da competição em vez de digitação manual, em todos os painéis de controle (Placar Broadcast e variantes, Placar Normal, Placar Model, Pré-Jogo, Tabela, Mata-Mata, Pênaltis, Escalação, Substituição, Artilheiros e Última Rodada).
- Valores já salvos fora da lista são preservados como opção extra no seletor.

### Pré-Jogo: countdown não reseta mais ao abrir a visualização
- Corrigido bug em que abrir o overlay de Pré-Jogo fazia o countdown em andamento voltar (reset) na tela de controle.
- Causa: o módulo só publicava o snapshot do countdown uma vez (no início), deixando o valor `segundos` defasado na nuvem/localStorage. Ao abrir a visualização, ela rebaseava o contador para esse valor antigo e o re-gravava no `localStorage` compartilhado, que propagava o reset ao controle via evento `storage`.
- Correção: `preJogoStore` agora mantém um tick periódico de sincronização (a cada 2s) enquanto o cronômetro está rodando (padrão já usado por `placarStore`), mantendo os snapshots atualizados. O tick é interrompido ao pausar, zerar, definir duração ou resetar.

### Novo módulo: Placar Model

### Novo módulo: Placar Model

- Novo overlay compacto (`/placar-model`): placar horizontal com glass morphism, barra de cor gradiente (cores dos dois times + verde), glow neon pulsante quando ao vivo, escudos, siglas, placar, cronômetro e período/estado da partida.
- Store própria (`placarModelStore`) com sincronização local (BroadcastChannel + localStorage) e na nuvem (Firebase RTDB), seguindo o padrão dos demais módulos: `getEstado`/`inscrever`/`setEstado`, cronômetro com contagem em tempo real e ações para times, gols, período, estado, cores e escudos.
- Página de controle (`/placar-model/controle`) com painéis de Times e Placar, Cronômetro e Partida, além da prévia ao vivo via `PreviaOverlay`.
- Rotas adicionadas no `App.jsx` e card na seção Scoreboards do Hub com prévia ao vivo em iframe.

### Placar Model: opções padrão dos scoreboards

- Placar Model ganhou as opções padrão dos demais scoreboards: **cartões** (amarelo/vermelho) por time (exibidos como mini-cartões abaixo da sigla no overlay), **acréscimo** (exibido ao lado do cronômetro), **ajustes de cronômetro** (±30s e ±1 min) e **cores fundo + borda** via `CORES_PRESET`.
- Painel de controle do Placar Model passou a incluir o **Painel de Substituição** (mesmo padrão dos placares Broadcast/Normal).

## 27/08/2026

### Tabela Compacta: opção dividir em 2 e aba Programas
- Nova aba "Programas" no Hub, para onde a Tabela Compacta foi movida (saiu de Gauchão A2).
- Novo controle da Tabela Compacta (`/tabela-compacta/controle`) com toggle "Separar em 2 colunas": à esquerda os 8 primeiros e à direita os 8 últimos.
- Store próprio `tabelaCompactaStore` guardando a opção de divisão, sincronizado (localStorage + BroadcastChannel + nuvem).

### Tabela Compacta · Live
- Nova tabela de classificação otimizada para livestreams (`/tabela-compacta`), com o mesmo estilo visual da tabela padrão porém mais estreita (max-width 460px).
- Removeu as colunas %, GP, GC, SG; mantém apenas #, Time, J e P, com colunas de Time/P reduzidas.
- Reusa os dados da `tabelaStore`; card adicionado ao Hub na seção Gauchão A2.

### Módulo Próxima Rodada

- Novo overlay de Próxima Rodada (agenda de jogos agendados) seguindo o padrão do projeto: store próprio, cartão visual, overlay, painel de controle e rota `/proximas-rodadas` + `/proximas-rodadas/controle`.
- Sincronizado com a FGF via `importarProximasRodadasFGF` (extrai as rodadas futuras do carrossel, após a última jogada), com cache local e mapeamento de siglas.
- Cabeçalho padrão do projeto (barra verde à esquerda, título + subtítulo, badge).
- Card adicionado ao Hub na seção Gauchão A2.

### Padronização do cabeçalho (Artilheiros e Última Rodada)

- Cartões de Artilheiros e Última Rodada passaram a usar o mesmo cabeçalho da tabela de classificação: barra verde à esquerda, título (h1) + subtítulo, e selo/badge verde à direita.

### Landing: hero com componente sobre imagem do jogo

- O mockup do placar no hero agora usa imagem real de estádio como fundo, com efeito Ken Burns (zoom/pan lento) e o placar deslizando para dentro, no estilo da home do overlays.uno.
- A imagem de fundo é escolhida conforme o time mandante sorteado (fotos de estádios em `public/img/estadios/`, uma por clube).
- Imagens de estádios de times pequenos do RS (não estádios grandes), redimensionadas para carregamento rápido.
- Conteúdo com leve esmaecimento (backdrop) para legibilidade sobre a foto.

### Landing: Artilheiros nas Ferramentas

- Card "Artilheiros" adicionado à grade de ferramentas da landing, com miniranking de goleadores (posição, jogador, clube, gols).

### Módulo Artilheiros

- Novo overlay de artilheiros (ranking de gols) seguindo o padrão do projeto: store próprio, cartão visual, overlay, painel de controle e rota `/artilheiros` + `/artilheiros/controle`.
- Sincronizado com a FGF via `importarArtilheirosFGF` (extrai a seção `.table-artilheiros`), com cache local e mapeamento de siglas dos clubes.
- Card adicionado ao Hub na seção Gauchão A2.

### Hub: seções em abas/dropdowns colapsáveis

- As seções do Hub (Scoreboards, Gauchão A2, Extras, Outros Esportes) viraram acordeões: clicar no cabeçalho expande/recolhe a grade de cards, com chevron rotativo e destaque verde no título.
- Gauchão A2 inicia aberta por padrão; demais seções começam recolhidas.

### AGENTS.md: padrão de criação de módulos documentado

- Adicionada seção "Como criar um novo módulo" com o passo a passo dos 6 artefatos (Store, Overlay, Cartão, Painel, Controle, rotas/card) e a integração com a FGF, para não precisar redescobrir o esqueleto a cada componente novo.

## 25/08/2026

### Times padrão BRA/PEL em todos os scoreboards

- Siglas padrão alteradas de PAL/BOT para BRA/PEL em todos os stores (Broadcast, PL, BL, LL, Normal) com cores correspondentes (vermelho #b91c1c / azul #1565c0).
- Placar Normal: escudos (BRA/PEL) ao lado das siglas no overlay e na prévia do controle.
- Siglas no Placar Normal agora são brancas (antes herdam a cor do time).

### Correções de sync e warnings

- Corrigido bug do Firebase `removeWrite called with nonexistent writeId` no heartbeat: `onDisconnect().remove()` substituído por `onDisconnect().set()` com os mesmos dados, evitando write IDs órfãos.
- Suprimidos warnings do React Router com future flags `v7_startTransition` e `v7_relativeSplatPath`.

### Última Rodada: sempre exibe rodada anterior

- Lógica de seleção da rodada alterada para sempre mostrar a rodada imediatamente anterior à corrente (sempre rodada-1).

### Placar Normal: design enxuto e moderno

- Redesign completo do Placar Normal com visual compacto (420px): glass morphism, barras de cor com glow neon, tipografia Rajdhani bold e animações de gol.
- Prévia ao vivo no controle atualizada para espelhar o novo layout.

### Novo módulo: Placar Normal

- Novo scoreboard tradicional horizontal ao estilo TV (`/placar-normal`): times nas pontas, placar no centro, cronômetro e período no topo, barras de cartões.
- Store própria (`placarNormalStore.js`) com sincronização local (BroadcastChannel + localStorage) e na nuvem (Firebase RTDB), seguindo o padrão dos demais módulos.
- Página de controle (`/placar-normal/controle`) com os mesmos painéis existentes: times e placar, cronômetro, partida, substituição e prévia ao vivo.
- Card adicionado na seção "Scoreboards" do Hub com prévia ao vivo em iframe.

## 24/08/2026 (8)

### Tabela e Última Rodada: botão "Salvar imagem"

- Novo botão fixo no canto superior direito das páginas `/tabela` e `/ultima-rodada` que captura o painel/cartão e baixa um PNG (nome do arquivo derivado da competição/rodada ou do título da rodada).
- Captura em escala 2x com fundo transparente nos cantos arredondados; escondido no modo prévia do hub.
- Componente compartilhado `BotaoSalvarImagem` + utilitário `src/lib/capturaImagem.js`; nova dependência `html2canvas`.
- Correção da captura da Última Rodada: `UltimaRodadaCartao` agora aceita `ref` (forwardRef) e a imagem é tirada do cartão em si, incluindo a borda verde superior e sem sobra transparente à direita.
- Captura agora desativa animações/transições no clone do DOM (`onclone`), evitando que a animação de entrada do cartão saia deslocada/transparente na foto.

### Nomes e escudos

- **"Brasil - SAF" → "Brasil"** em todo o sistema: nome canônico em `nomesClubes.js`, time padrão da Tabela (sigla BRA mantida) e prévia de oitavas da landing.
- **Escudo do Esportivo (ESP)** trocado para `https://i.imgur.com/u5q7j4R.png` na Tabela e na landing; `completarVisuais` agora aplica sempre o escudo/cor padrão por sigla (garante a troca também em estados já salvos).
- Substituído também o arquivo local `public/escudos/ESP.png` pela nova imagem — cobre a Última Rodada e todos os overlays que usam o fallback por sigla (`/escudos/SIGLA.png`).

### Nomes e siglas

- **"Brasil de Farroupilha" → "Brasil - Far"** e **"APAFUT" → "Apafut"** em todo o sistema (nome canônico em `nomesClubes.js`, time padrão da Tabela e normalização de estados salvos/FGF).
- **Sigla do Guarani "GVA" → "GUA"** em todo o sistema: `tabelaStore`, mapeamento da FGF, landing e arquivo de escudo `public/escudos/GUA.png`; `completarVisuais` migra automaticamente a sigla antiga nos estados já salvos.
- Migração `GVA→GUA` também no store da **Última Rodada** (`normalizarEstado`): estados antigos salvos em localStorage e sincronizados passam a exibir a sigla correta.

### Nomes de clubes atualizados

- **Brasil de Pelotas → Brasil - SAF** e **Guarani-RS → Guarani - VA** em todo o sistema: cadastro de times da Tabela (siglas BRA/GVA mantidas) e prévia de oitavas da landing ("BRA · Brasil-PE" → "BRA · Brasil-SAF").
- Sufixo "-RS" removido de **Esportivo** e **Santa Cruz**: nomes atualizados na Tabela e nas prévias/classificação da landing.
- **Normalização automática de nomes** (`src/lib/nomesClubes.js`): qualquer variação conhecida desses clubes (ex.: "Brasil de Pelotas", "Guarani", "Esportivo-RS") é convertida para o nome canônico em todas as entradas de estado — estado salvo antigo no localStorage, sync por aba/nuvem, digitação no controle e dados importados da FGF (classificação e casamento de slugs/nomes da última rodada).

## 24/08/2026 (6)

### Home: marca só com o logotipo

- O cabeçalho da landing agora exibe apenas o logotipo, sem o texto "PELOTENSE ESPORTES" ao lado; arquivo reformatado (prettier) sem mudanças de comportamento.

## 24/08/2026 (5)

### Última Rodada: rodada corrente + ocultar classificação

- O módulo agora identifica a **rodada corrente** automaticamente: a mais recente com resultados e, quando ela termina, passa a valer a seguinte (hoje: RODADA 8).
- Jogos ainda não disputados entram com placar vazio (– × –), listando a rodada completa.
- Correção definitiva dos times trocados: o clube agora é resolvido pelo slug do link do jogo da FGF (nome canônico), com casamento por igualdade > sufixo > contenção — validado 16/16 contra a página real.
- Cache local reversionado (v3) para descartar dados antigos errados.
- Novo botão "Ocultar/Mostrar classificação" no controle; a faixa de classificação some do overlay quando oculta.
- Cabeçalho do cartão de Última Rodada ganhou o mesmo fade neon do cabeçalho da /tabela.

## 24/08/2026 (4)

### Última Rodada: parser da FGF blindado

- A escolha da rodada agora exige que ao menos metade dos jogos (mínimo 4) tenham placar numérico — evita pegar rodadas futuras ou parciais.
- Blocos especiais do carrossel ("JOGOS ADIADOS", "Classificação Geral") são explicitamente ignorados.
- Cache local reversionado (v2) para descartar qualquer pacote antigo salvo no navegador.

## 24/08/2026 (3)

### Última Rodada com todos os times

- A classificação agora recebe **todos os times da tabela** ao puxar da FGF (não só os 6 primeiros) e virou uma faixa full-width abaixo dos jogos, com escudos quebrando em linhas conforme a quantidade.
- Jogos também sem limite fixo: todos os confrontos realizados da rodada são preenchidos.
- Controle ganhou botões "+ Adicionar jogo", "+ Adicionar time" e ✕ para remover linha individual.

## 24/08/2026 (2)

### Correções

- **Tela branca no controle de Substituição**: a prévia ao vivo foi montada sem o import do componente (`PreviaOverlay is not defined`) — import adicionado e auditoria automática de uso/import rodada em todas as páginas e componentes.
- **Seleção de cor removida onde não faz sentido**: Tabela, Pênaltis, Mata-Mata (inclui oitavas/quartas/semi/final) não têm mais escolha de cor — as cores dos escudos continuam vindo do cadastro de times da tabela.
- **Campo de nome ampliado no controle de Pênaltis** (largura mínima de 220px por lado).

### Novidades

- **Escalação ganhou campo de Técnico** por time (casa/visitante): editável no controle, exibido como linha "TÉC · NOME" no rodapé do cartão do overlay.
- **Última Rodada integrada à FGF**: botão "Puxar dados da FGF" no controle busca automaticamente os jogos realizados da última rodada disputada (placares + escudos via mapeamento nome→sigla) e a classificação atual — mesma página do site da FGF usada pela tabela, com cache local de 3 minutos. A classificação do overlay agora mostra cada escudo com o **número da posição embaixo**, e o painel passou a editar posição (nº) em vez de pontos.
- **Home atualizada**: carrossel de demonstração ganhou dois slides novos — Escalação (dois cartões com jogadores entrando em cascata) e Última Rodada (resultados com escudos + faixa de posições) — totalizando 5 demonstrações rotativas.

## 24/08/2026

### Correções

- **Campos que voltavam sozinhos ao valor anterior (revert) eliminados na raiz**: toda edição local abre uma janela de proteção de 1,2s na camada de nuvem — entregas defasadas do Realtime Database recebidas nesse intervalo são descartadas. Com isso, digitar nome/sigla/cor não é mais desfeito por ecos atrasados nem por disputa de posse entre abas (complementa as blindagens anteriores: dedupe em anel de 16 estados nos stores e tolerâncias ampliadas no claim de controle).
- **Título do controle da Tabela corrigido**: dizia "Controle · Pênaltis" desde a criação (copiado do painel de pênaltis); agora exibe "Controle · Tabela".

### Novidades

- **Novo módulo Última Rodada** (`/ultima-rodada` + `/ultima-rodada/controle`): cartão com os resultados dos últimos jogos (escudos, siglas e placar de cada confronto) e a classificação dos times após a rodada (posição, escudo, sigla e pontos). Controle com título editável, 6 jogos e 6 posições, botões mostrar/ocultar, prévia ao vivo e card no hub.
- **Cores fixas em todos os controles**: o seletor nativo de cor (`type="color"`, propenso ao bug de voltar à cor anterior) foi substituído pela paleta fixa de 12 cores já usada nos placares broadcast — Escalação, Substituição, Pênaltis, Mata-Mata, Tabela, Placar de Futebol e Placar Profissional. Componente `CampoCor` removido.
- **Prévia ao vivo nos controles** que não tinham (`PreviaOverlay`): Escalação, Substituição, Pênaltis, Tabela e Mata-Mata ganham iframe com o overlay real da sala atual (além dos mini-previews já existentes nos 4 placares broadcast).

## 23/08/2026

### Sincronização na nuvem (multi-dispositivo)

- **Novo módulo Escalação** (`/escalacao` + `/escalacao/controle`): grid 11x1 por time com escudos, números, nomes e formação editável (4-3-3 padrão, seleção entre formações comuns). Controle com seções lado a lado para casa/visitante (cor, nome, sigla, formação e os 11 jogadores cada), seguindo o mesmo design dos painéis existentes. Overlay transparente para OBS, sincronizado via nuvem/BroadcastChannel/localStorage como os demais módulos, com card no hub.
- **Acréscimo manual nos 4 controles**: chips fixos (+1 a +10) substituídos por campo numérico com botões −/+ (aceita qualquer minuto de 0 a 99) e botão "Sem" para remover — no placar padrão, PL, BL e LL.
- **Placar padrão**: chip de acréscimo agora fica colado à faixa do tempo (2px de folga, mesma altura), sem sobrepor nem formar faixa dupla.
- **Exclusividade de controle por sala**: só um dispositivo publica por vez (`salas/{sala}/controle` com claim transacional, heartbeat de 8s e liberação automática via `onDisconnect`); demais controles viram espectadores com indicador no header e botão "Assumir". Publicações feitas antes de assumir ficam em buffer e são enviadas ao assumir — elimina o conflito/flicker quando dois aparelhos controlam juntos.
- **Acréscimo corrigido nos 4 placares broadcast**: chip sempre montado alternando opacidade (fade suave) em vez de montar/desmontar — elimina o resquício de sombra/box fantasma ao clicar em "Sem" (artefato de camada GPU/OBS com `filter: drop-shadow`).
- **Placar padrão**: acréscimo ganhou caixa própria (mesmo estilo das ligas PL/BL/LL) e offset de 40px para não sobrepor a faixa do cronômetro (transparência empilhada formava área mais escura).
- **Firebase Realtime Database** substitui o WebSocket local como camada de sincronização entre overlay e controle — agora funciona entre dispositivos diferentes no link do Netlify, não só no mesmo navegador.
- Todos os 10 stores migrados (`placar`, `placar-pro`, `placar-broadcast` PL/BL/LL/padrão, `tabela`, `mata-mata`, `penaltis`, `substituicao`): publicam o estado na nuvem em cada mudança e recebem atualizações remotas, mantendo BroadcastChannel + localStorage como caminho local rápido.
- **Salas (`?sala=nome`)**: dispositivos na mesma URL de sala compartilham estado; salas diferentes ficam isoladas (permite partidas simultâneas). Sem parâmetro, usa a sala `padrao`.
- **CampoSala no Header** dos controles e hub: campo para digitar a sala (recarrega a página ao aplicar) e botão "Copiar link" para levar a URL com sala ao OBS/outro computador.
- Prévias do hub herdam a sala da página (`&sala=`) para refletir o estado correto.
- Estado publicado como JSON serializado no Realtime Database (`salas/{sala}/{canal}`), evitando perda de `null`/arrays; eco das próprias publicações é filtrado.
- Configuração via variáveis `VITE_FIREBASE_*` (ver `.env.example`) — sem chaves configuradas, o site continua funcionando só com sincronização local.
- Plugin WebSocket do Vite removido (`vite.config.js`), dependência `ws` desinstalada.
- **README** e **AGENTS.md** atualizados com a nova arquitetura de sincronização (Firebase RTDB, salas, `CampoSala`, variáveis de ambiente e armadilhas relacionadas).

### Novidades

- **Landing** em `/` com seções Sync, Classificação ao vivo, OBS, Fluxo, CTA e Rodapé; sistema passa para `/hub`.
- **Demonstração animada na landing**: mockup de navegador que alterna automaticamente entre Placar Broadcast (cronômetro correndo), Classificação (linhas entrando em cascata) e Fases Finais (bracket com pulso neon e faixa CAMPEÃO), com chips flutuantes, pontos de navegação e links para todos os módulos — substituindo a grade de miniaturas.
- **Roteamento limpo**: migração de HashRouter para BrowserRouter (URLs sem `#`); links "Voltar ao hub" e copiar-link corrigidos.
- **Identidade visual unificada**: paleta neon `#a5ef1c` sobre fundo escuro no hub, controles e overlays.
- **Sorteio dos jogos da home** refeito a cada visita (confrontos VER × PAS no hero e nos painéis).
- **Mata-mata reformulado**, dividido em duas páginas:
  - `/mata-mata` — tabela das **oitavas** (`PainelOitavas` + `ListaOitavas`).
  - `/fases-finais` — **chaveamento** quartas → final (`PainelChaveamento` + `Chaveamento`) com conectores em cotovelo, chips de placar/pênalti e faixa **CAMPEÃO**.
- **Store do mata-mata** (`mataMataStore`): fases extras (quartas/semi/final), avanço automático dos vencedores entre fases, migração de estado antigo, `limparFase` e placares zerados em todas as fases.
- **Controle do mata-mata**: abas por fase (Oitavas/Quartas/Semi/Final), edição da fase ativa, "Limpar fase" e preenchimento rápido pelos classificados da tabela.
- **Hub**: cards "Oitavas de Final" e "Fases Finais · Chaveamento" com prévia ao vivo (altura própria por card) e link de controle compartilhado.

### Correções

- Chips flutuantes da demo ancorados à janela do mockup — o chip "GOL DO VERANÓPOLIS" não sobrepõe mais os pontos e links abaixo da demonstração.
- Grade de ferramentas da landing removida em favor da demonstração animada (elimina a quebra de spans com 7 blocos).
- Chaveamento não empilha mais na prévia do hub (breakpoint alinhado à largura do iframe).
- Escudos ausentes resolvidos pelo fallback de sigla do componente `Escudo`.

## Sessões anteriores

- Módulos Substituição e Pênaltis com controles completos nos placares PL/BL/LL e previews ao vivo no hub.
- Ligas PL/BL/LL, tabela do Gauchão A2 com escudos reais e correções de sincronização.
