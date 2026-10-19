# Matriz de Engenharia Reversa — Pokédex Power BI para Aplicação Web 1:1

## 1. Visão Geral e Arquitetura de Referência
O projeto de referência de Kelven Cardoso (`BI_Pokemon`) no Power BI opera através de um modelo semântico TMDL e relatórios PBIR com custom visual **HTML Content**.
Ele utiliza 5 páginas de 1280 × 720 px:
1. **Pokédex** (Visualização central dinâmica, lista lateral com busca/filtros, atributos em radar SVG, fraquezas com multiplicadores até 4x e imunidades, evolução animada interativa e galeria holográfica de cartas TCG).
2. **Arena** (Engine de batalha 1x1 e 3x3 com IA competitiva, fórmula de dano Nível 50, STAB, cálculo de crítico, Mega Evolução e Gigantamax, efeitos visuais por tipo de golpe e simulação de 1.000 batalhas).
3. **Tipos** (Roda interativa com setas vetoriais animadas de vantagem ofensiva/defensiva, matriz 18×18 com destaques cruzados e rankings das 171 combinações defensivas).
4. **Quiz** ("Quem é esse Pokémon?" com silhueta escura, alternativas ou modo de digitação, cronômetro de 20s, 3 níveis de dicas progressivas, sequências de acerto e recordes locais persistidos).
5. **Safari** (RPG/minijogo em Canvas 30×20 tiles pixel art sem assets externos, movimentação suave com colisões, encontros no mato alto, taxas de captura da 3ª geração com Pokébola, Grande Bola, Ultra Bola e Frutas).

---

## 2. Inventário de Recursos e Dados

| Entidade / Recurso | Fonte Original | Tratamento na Aplicação Web | Status |
| :--- | :--- | :--- | :--- |
| **Pokémons (1.302 registros)** | PokeAPI GraphQL `beta.pokeapi.co` | Snapshot completo extraído e validado em `src/data/pokemon.json` | Concluído |
| **18 Tipos e Eficácia** | Tabela normalizada PokeAPI | Eficácia direta 18x18 e cores padronizadas em `src/data/arena_dados.json` | Concluído |
| **80 Golpes Balanceados** | Curadoria oficial em `Golpes.m` | Estrutura completa de golpes físicos/especiais e prioridades integrada | Concluído |
| **17.539 Cartas TCG** | `PokemonTCG/pokemon-tcg-data` | Armazenadas em `public/data/cartas_tcg.json` com lazy load e cache IndexedDB/SW | Concluído |
| **Ícones SVG dos 18 Tipos** | `partywhale/pokemon-type-icons` | Clonados e servidos estaticamente em `public/icons/*.svg` | Concluído |
| **Sprites e Animações** | PokeAPI Official Artwork / Showdown | Cadeia de resiliência (Showdown GIF → Home PNG → Artwork PNG) | Concluído |

---

## 3. Matriz de Componentes e Reprodução 1:1

| Módulo | Elemento Original | Comportamento Revertido | Implementação Web | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Pokédex** | Fundo Dinâmico | Efeitos temáticos de partículas CSS (bolhas, brasas, raios, folhas, neve, almas, poeira, etc.) sincronizados ao tipo | Componente `DynamicBackground` com shaders/keyframes CSS idênticos | Concluído |
| **Pokédex** | Lista Lateral | 3 colunas x 5 linhas com scroll, filtros de Geração (1-9), Tipo (18) e Lendários (★), busca por nome/ID | Componente `PokemonSelector` com busca em tempo real e paginação | Concluído |
| **Pokédex** | Hero Stage | Glow radial, anel rotativo com tracejado, sombra no chão, flutuação do sprite e badges de tipo | Componente `PokemonHero` com modos Normal, Shiny (ouro/brilhos) e Cartas | Concluído |
| **Pokédex** | Evolução Animada | Clique no próximo estágio desencadeia silhuetas alternadas, feixes de raios, clarão de flash e mensagem | Componente `EvolutionChain` com animação `@keyframes evo-novo` | Concluído |
| **Pokédex** | Galeria TCG | Grade com thumbnails, visualização expandida com efeito holográfico de refração animado | Componente `TcgGallery` com hover holográfico CSS 3D | Concluído |
| **Pokédex** | Radar SVG & Barras | Gráfico radar hexagonal com 6 eixos de status e barras de progresso proporcionais | Componente `StatsRadar` gerado em SVG vetorial preciso | Concluído |
| **Pokédex** | Fraquezas & Resistências | Cálculo em tempo real dos 18 tipos defensores, exibindo chips com badges 4x, 2x, 1/2x, 1/4x e 0x | Componente `WeaknessGrid` com cores oficiais | Concluído |
| **Arena** | Batalhas 1x1 e 3x3 | Sistema de turnos baseado em velocidade, prioridade de golpes, STAB, fraquezas e IA tática | Engine `battleEngine.ts` e componente `ArenaPage` | Concluído |
| **Arena** | Mega Evolução / Gigantamax | Aumento de status e golpes Max com limite de 3 turnos para Gigantamax | Suporte total integrado na engine de combate | Concluído |
| **Arena** | Simulação 1.000 Batalhas | Monte Carlo de 1.000 iterações em thread com exibição de winrate probabilístico | Função `simulateBattles` em tempo real | Concluído |
| **Tipos** | Roda de Tipos | Roda SVG interativa com setas direcionais animadas calculadas por curvas de Bézier | Componente `TypesWheel` em SVG | Concluído |
| **Tipos** | Matriz 18x18 & Rankings | Tabela cruzada com highlights de linha/coluna e lista das 171 combinações de tipos | Componente `TypesMatrix` e `TypesRankings` | Concluído |
| **Quiz** | Jogo de Silhueta | Silhueta escurecida com revelação por temporizador, modos múltipla escolha e digitação | Componente `QuizPage` com persistência local de recorde | Concluído |
| **Safari** | Mapa Pixel Art & Captura | Canvas com renderização de grama procedural, colisão, encontros no mato alto e captura Gen 3 | Componente `SafariPage` em Canvas 2D | Concluído |
| **PWA / Offline** | Cache e Service Worker | Execução sem internet, download seletivo de pacotes de dados e cards | Vite PWA Plugin com Workbox e painel Offline | Concluído |
