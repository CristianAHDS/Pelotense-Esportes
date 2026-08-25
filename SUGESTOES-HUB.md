# Sugestões — Hub e novos componentes

Documento de ideias para evoluir a central de overlays (`src/pages/Hub.jsx`) e adicionar novos módulos ao sistema. Nada aqui é obrigatório: cada item pode ser priorizado e implementado separadamente, seguindo o padrão de store + overlay + controle + rota + card do hub.

---

## 1. Novos componentes de interface (Hub)

### 1.1 Barra de busca
Campo para filtrar cards por nome/descrição (placar, tabela, substituição…). Filtra em tempo real a grade, sem precisar criar tela nova.

### 1.2 Filtro por categoria
Chips fixos no topo: `Todos · Scoreboards · Gauchão A2 · Extras`. Alterna o segmento ativo e mostra só os cards daquela categoria (com `display:none` simples).

### 1.3 Toast de confirmação no "Copiar link"
O botão `CopiarLink` já troca para `✓`, mas um toast global ("Link copiado") melhora o feedback quando a janela está longe do card.

### 1.4 Badge "Em uso / AO VIVO"
Cada overlay lê o estado do próprio store e mostra um indicador no card quando há algo configurado (ex.: placar aberto com times setados), ajudando o operador a saber o que está no ar.

### 1.5 Seletor de sala no Hub
Hoje a sala vem só da URL (`?sala=`). Um seletor no header do hub permite trocar de sala sem digitar a URL, recarregando a página (mesma lógica já usada nos módulos).

### 1.6 Botão "Abrir em modo prévia" no card
Atalho direto para `?previa=1` em aba nova, além do `Abrir` normal — útil para conferir o gráfico limpo antes de colocar na cena.

### 1.7 Mini-atalho de atalhos (roadmap)
Painel "Próximos módulos" no rodapé listando o que está em desenvolvimento, com check dos já entregues.

### 1.8 Preferência por tema/estilo
Segundo botão de ação no card (ex.: "Variações") que abre a prévia já alternando entre os layouts do Placar (padrão/PL/BL/LL).

---

## 2. Novos módulos de overlay (sugestões)

### 2.1 Cartões de cartão amarelo / vermelho
Overlay de advertência com o jogador, time e minuto, estilo tarja igual ao de substituição. Store + controle para marcar ocorrências.

### 2.2 Cronômetro / relógio de jogo independente
Overlay pequeno só com cronômetro (para quando o operador usa um placar externo), sincronizado e controlável à distância.

### 2.3 Marcadores de gol (sequência de gols)
Linha do tempo dos gols da partida (minuto por minuto), complementando o placar. Bom para VT/resumo da transmissão.

### 2.4 Punições / expulsões
Conteúdo complementar ao de cartões: expulsão com o jogador saindo de campo, integrado ao placar.

### 2.5 Informações do estádio / rodada
Overlay de "pré-jogo" com estádio, cidade, rodada e times — útil na abertura da transmissão, usando os dados já existentes no store de placar.

### 2.6 Tabela de posse e estatísticas
Percentuais de posse, finalizações e escanteios. Requer dados adicionais no store, mas agrega muito para o espectador.

### 2.7 Pódio / resultado final
Overlay de encerramento com o resultado final e os classificados, reaproveitando o chaveamento das fases finais.

### 2.8 Basquete (desbloquear)
O card "Em breve" de Basquete já existe no hub — implementar placar com pontos, faltas e posse de bola como primeiro esporte não-futebol.

### 2.9 Vôlei (desbloquear)
Placar de vôlei com sets, pontos por set e saques, completando a seção "Outros Esportes".

---

## 3. Modificações propostas no Hub atual

- **`ESPORTES`**: hoje é só um array com `titulo`/`descricao` e `className="breve"`. Ao implementar, transformar em item de módulo completo (com `rota`, `tag`, `accent`) para cair no mesmo fluxo de card dos demais.
- **Reutilizar `PreviewAoVivo`**: os cards de "Outros Esportes" não têm prévia; ao virarem módulos reais, já entram com a prévia ao vivo via iframe.
- **Larguras de prévia**: padronizar `720`/`405` para scoreboards e extras, `760` para Gauchão A2 — manter breakpoints do hub abaixo de `720px` para não quebrar os media queries das overlays.
- **Centralizar dados de módulos**: extrair os arrays `SCOREBOARDS`, `GAUCHAO_A2`, `EXTRAS` para um único arquivo de config (ex.: `src/data/modulos.js`) e consumir tanto no Hub quanto em possíveis páginas de roteiro, evitando duplicação.
- **Acessibilidade**: adicionar `aria-label` nos botões de ícone (`CopiarLink`, `FecharTV`) e foco gerenciado na sobreposição TV (já existe `autoFocus`).
- **Performance**: os iframes das prévias carregam todos ao mesmo tempo; usar `loading="lazy"` (já aplicado) e considerar pausar quando fora da viewport via IntersectionObserver para reduzir consumo.

---

## 4. Priorização sugerida

1. **Alta** — Barra de busca + filtro por categoria (1.1 e 1.2), Cartões (2.1), Cronômetro (2.2).
2. **Média** — Badge "Em uso" (1.4), Seletor de sala (1.5), Linha do tempo de gols (2.3), Basquete (2.8).
3. **Baixa** — Toast global (1.3), Prévia de variações (1.8), Estatísticas (2.6), Pódio (2.7).
