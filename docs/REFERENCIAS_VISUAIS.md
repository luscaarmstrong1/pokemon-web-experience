# Especificações e Referências Visuais — Reprodução 1:1 Pokédex Power BI

## 1. Identidade e Paleta Global

- **Resolução Base do Palco**: 1280 × 720 px (com container fixo escalado via `transform: scale(min(w/1280, h/720))`).
- **Fundo Global**: `#0B0E14` com gradientes radiais `#1A2130` e malha de pontos (`radial-gradient(rgba(255,255,255,.08) 1px, transparent 1.4px)`).
- **Cartões / Painéis Vidro**: `linear-gradient(160deg, rgba(30,36,48,.92), rgba(14,17,24,.94))` com borda `1px solid rgba(255,255,255,.08)`, `box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 18px 40px rgba(0,0,0,.35)` e raio de `18px`.
- **Destaque Primário**: Amarelo Ouro `#FFCB05`.
- **Tipografia**: `'Segoe UI', system-ui, -apple-system, sans-serif`.

---

## 2. Paleta dos 18 Tipos de Pokémon

| Tipo | Slug | Cor Hexadecimal | Classe CSS |
| :--- | :--- | :--- | :--- |
| **Normal** | `normal` | `#A8A878` | `.bg-normal`, `.c-normal`, `.gl-normal` |
| **Fogo** | `fire` | `#F08030` | `.bg-fire`, `.c-fire`, `.gl-fire` |
| **Água** | `water` | `#6890F0` | `.bg-water`, `.c-water`, `.gl-water` |
| **Planta** | `grass` | `#78C850` | `.bg-grass`, `.c-grass`, `.gl-grass` |
| **Elétrico** | `electric` | `#F8D030` | `.bg-electric`, `.c-electric`, `.gl-electric` |
| **Gelo** | `ice` | `#98D8D8` | `.bg-ice`, `.c-ice`, `.gl-ice` |
| **Lutador** | `fighting` | `#C03028` | `.bg-fighting`, `.c-fighting`, `.gl-fighting` |
| **Venenoso** | `poison` | `#A040A0` | `.bg-poison`, `.c-poison`, `.gl-poison` |
| **Terrestre** | `ground` | `#E0C068` | `.bg-ground`, `.c-ground`, `.gl-ground` |
| **Voador** | `flying` | `#A890F0` | `.bg-flying`, `.c-flying`, `.gl-flying` |
| **Psíquico** | `psychic` | `#F85888` | `.bg-psychic`, `.c-psychic`, `.gl-psychic` |
| **Inseto** | `bug` | `#A8B820` | `.bg-bug`, `.c-bug`, `.gl-bug` |
| **Pedra** | `rock` | `#B8A038` | `.bg-rock`, `.c-rock`, `.gl-rock` |
| **Fantasma** | `ghost` | `#705898` | `.bg-ghost`, `.c-ghost`, `.gl-ghost` |
| **Dragão** | `dragon` | `#7038F8` | `.bg-dragon`, `.c-dragon`, `.gl-dragon` |
| **Sombrio** | `dark` | `#705848` | `.bg-dark`, `.c-dark`, `.gl-dark` |
| **Aço** | `steel` | `#B8B8D0` | `.bg-steel`, `.c-steel`, `.gl-steel` |
| **Fada** | `fairy` | `#EE99AC` | `.bg-fairy`, `.c-fairy`, `.gl-fairy` |

---

## 3. Comportamento das Animações Específicas

1. **Evolução**:
   - `evo-antigo`: silhueta escura do Pokémon base piscando até sumir.
   - `evo-novo`: clarão invertido que cresce com escala até 1.12 e transiciona para o sprite colorido.
   - `raios`: rotação cônica de feixes de luz a 140 graus em 3 segundos.
   - `flash`: explosão radial branca e mensagem flutuante de sucesso.

2. **Partículas por Tipo**:
   - *Água / Veneno*: Bolhas ascendentes com reflexo radial.
   - *Fogo*: Brasas incandescentes com cintilação e dispersão.
   - *Elétrico*: Raios recortados em `clip-path` piscando com delay escalonado.
   - *Planta*: Folhas em rotação angular caindo suavemente.
   - *Gelo*: Flocos de neve com drop-shadow branco.
   - *Fantasma*: Almas esfumaçadas em blur radial subindo lentamente.
   - *Psíquico / Lutador*: Ondas de choque circulares expansivas.

3. **Cartas Holográficas**:
   - Gradiente angular `linear-gradient(115deg, transparent 30%, rgba(255,255,255,.35) 45%, rgba(255,140,255,.18) 50%, transparent 62%)` com `mix-blend-mode: screen` e animação horizontal contínua de 3.2s.
