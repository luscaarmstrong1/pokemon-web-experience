# Pokédex Web Experience ⚡

Aplicação web independente, de alta fidelidade visual (1:1), reproduzindo integralmente em tecnologia web moderna (React + TypeScript + Vite + PWA) o conceituado relatório de Pokédex em Power BI originalmente criado por **Kelven Cardoso**.

---

## 🎮 Módulos Implementados

1. **Pokédex Completa**
   - Base oficial com **1.302 registros** (formas base, Mega Evoluções, Gigantamax e formas regionais) extraídos diretamente da PokeAPI.
   - Navegação lateral com filtros em cascata por Geração (Gen 1 a 9), Tipo (18 tipos) e Lendários/Míticos (★), além de busca por texto/ID em tempo real.
   - Área central (Hero Stage) com arte oficial em alta resolução, badges elementares, flutuação do sprite, iluminação dinâmica e fundo temático de partículas CSS específicas para cada tipo (brasas em Fogo, bolhas em Água, raios em Elétrico, etc.).
   - Modos **Normal**, **✨ Shiny** (paleta alternativa, efeitos cintilantes e nome com acabamento dourado) e **🃏 Cartas TCG** (galeria com mais de 17.500 cartas com efeito holográfico de refração animado em CSS).
   - Radar de atributos hexagonal em SVG com barras de status proporcionais.
   - Matriz de fraquezas, resistências e imunidades com cálculo de multiplicadores compostos (4×, 2×, ½×, ¼× e 0×).
   - Painel de Evolução interativa com transição animada (`@keyframes evo-novo` com silhuetas, raios e clarão).
   - Painel de Formas Alternativas com seleção direta.

2. **Arena Pokémon (Batalhas 1x1 e 3x3)**
   - Sistema de batalha completo em turnos, com cálculo oficial de atributos em Nível 50, STAB, multiplicadores de tipos, acertos críticos e variação de dano.
   - Inteligência Artificial competitiva que avalia golpes, fraquezas do oponente e toma decisões táticas de ataque e substituição de Pokémon.
   - Mega Evolução e Gigantamax (com golpes Max e duração de 3 turnos).
   - Simulação preditiva de 1.000 batalhas em Monte Carlo para prever a probabilidade de vitória de cada equipe em tempo real.

3. **Tipos e Eficácia**
   - Roda interativa dos 18 tipos em SVG com setas de vantagem e fraqueza traçadas dinamicamente com curvas de Bézier cúbicas.
   - Modos Ataque e Defesa (com suporte a tipos combinados).
   - Matriz 18×18 com realce cruzado de linhas/colunas.
   - Ranking completo das 171 combinações defensivas possíveis.
   - Calculadora interativa de dano resultante.

4. **Quiz ("Quem é esse Pokémon?")**
   - Silhueta escura com revelação progressiva.
   - Modos de 4 opções ou Digitação com normalização de acentos.
   - Temporizador de 20 segundos por pergunta, sistema de 3 dicas progressivas, sequências de vitórias e recordes salvos localmente (`localStorage`).

5. **Safari RPG**
   - Minijogo em Canvas 2D em estilo pixel art GBA clássico (30×20 tiles).
   - Movimentação do treinador com física de colisão (setas, WASD ou D-Pad virtual).
   - Encontros no mato alto com chance de Pokémon Shiny e lendários.
   - Sistema de captura com Pokébola, Grande Bola, Ultra Bola e Frutas.
   - Mochila e inventário persistentes durante a sessão.

6. **PWA & Capacidade Offline**
   - Service Worker configurado via Vite PWA / Workbox com precache do shell da aplicação, dados e ícones.
   - Painel Offline com gerenciamento de armazenamento e download sob demanda da base de cartas TCG.
   - Execução autônoma sem requisições à internet após a primeira carga.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** & **TypeScript**
- **Vite** (Build ultrarrápido)
- **Vite Plugin PWA** & **Workbox**
- **React Router Dom**
- **Canvas 2D** & **SVG Vetorial**
- **Vitest** (Testes unitários automatizados)

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/luscaarmstrong1/pokemon-web-experience.git

# Acesse a pasta do projeto
cd pokemon-web-experience

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Execute a suíte de testes
npm test

# Gere o build de produção
npm run build
```

---

## 📄 Créditos e Fontes de Dados

- **Projeto de Referência em Power BI**: Desenvolvido por [Kelven Cardoso](https://github.com/kelven-cardoso/BI_Pokemon).
- **Implementação Web Independente**: Desenvolvida por **Lucas Armstrong** (`luscaarmstrong1`).
- **Dados e Sprites de Pokémon**: [PokeAPI](https://pokeapi.co/) e [PokeAPI GraphQL](https://beta.pokeapi.co/graphql/v1beta).
- **Dados do Pokémon TCG**: [PokemonTCG/pokemon-tcg-data](https://github.com/PokemonTCG/pokemon-tcg-data).
- **Ícones dos Tipos**: [partywhale/pokemon-type-icons](https://github.com/partywhale/pokemon-type-icons) (Licença MIT).
- *Aviso Legal*: Pokémon e todas as marcas associadas pertencem à Nintendo, Game Freak e The Pokémon Company. Este projeto possui finalidade exclusivamente educacional e demonstrativa, sem fins lucrativos.
