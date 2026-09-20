# PROTSEG — Landing Page

Landing page de vendas da PROTSEG (Grupo ProtegeR), empresa de segurança
eletrônica com 34 anos de mercado, sediada em Maceió/AL e presente em
praticamente todo o Brasil (exceto SP e RJ). Projeto conduzido pela
Doze Digital Marketing.

- **Repositório:** `github.com/YuriVictor22/protseg-lp` (privado)
- **Deploy:** Netlify, deploy contínuo a partir da branch `main`
- **Domínio final:** ainda a definir (não é `protseg.com.br`, que pertence
  a outra empresa)

---

## 1. Stack

HTML5 + CSS puro (sem framework/preprocessor, só variáveis CSS nativas) +
JavaScript vanilla. Sem build step — é só abrir o `index.html` direto no
navegador ou publicar as pastas como estão.

- **Fonte:** [Sora](https://fonts.google.com/specimen/Sora) (Google
  Fonts) — única fonte do projeto inteiro, usada em pesos diferentes
  conforme o papel (400/500 corpo, 600 destaques, 700/800 títulos).
  Peso máximo disponível é 800 (não existe 900).
- **Ícones:** SVGs inline desenhados à mão, sem biblioteca externa (ex.:
  ícone do Instagram no rodapé, ícones dos pilares na seção Solução).

---

## 2. Estrutura de arquivos

```
protseg-lp/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   │   ├── variables.css       — cores, tipografia, espaçamento, breakpoints
│   │   ├── global.css          — reset, tags base, utilitário .sr-only
│   │   ├── components.css      — botões, header, footer, .reveal
│   │   └── sections/
│   │       ├── hero.css
│   │       ├── solucao.css     — inclui a antiga seção "Problema" (fundida)
│   │       ├── prova-social.css
│   │       ├── como-funciona.css — inclui a Calculadora (fundida)
│   │       ├── calculadora.css   — só os componentes do wizard
│   │       ├── faq.css
│   │       └── fechamento.css
│   ├── js/
│   │   └── main.js             — header scroll, reveal, carrossel, calculadora
│   ├── images/
│   └── icons/
```

**Arquivos que existiram mas foram removidos** na reestruturação (ver
seção 4): `problema.css`, `diferencial.css`, `videomonitoramento.css`,
`publicos.css`.

---

## 3. Estrutura da página (atual)

1. **Header** — logo + botão "Fale com um especialista" (WhatsApp). Sem
   menu de navegação.
2. **Hero** — foto de fundo real (fachada da PROTSEG + moto de resposta)
   com card flutuante de CTA por cima.
3. **Solução** — título + parágrafo de introdução (os "3 furos" dos
   sistemas comuns, condensados em texto) + 4 pilares em sequência
   numerada com ícones.
4. **Prova Social** — selos de reputação, carrossel automático de 6
   depoimentos reais (Google), logos de clientes corporativos.
5. **Como Funciona + Calculadora** — 4 etapas do processo (layout de
   peso decrescente: 1ª etapa grande, as outras 3 menores) + wizard
   interativo de 3 perguntas que termina num link de WhatsApp
   pré-preenchido. Fundo em degradê vermelho → preto.
6. **FAQ** — 6 perguntas em acordeão.
7. **Fechamento** — CTA final, fundo preto.
8. **Footer** — logo, menu (A solução / Clientes / Monte seu sistema /
   Dúvidas), copyright, ícone do Instagram, imagem decorativa (mão +
   celular com o perfil do Instagram) que "vaza" por cima do fim da
   página no desktop.

---

## 4. Reestruturação (redução de seções)

A LP tinha originalmente 10 seções + header com menu completo. Depois de
retorno do cliente de que a página estava "grande demais" para uma LP
focada só em venda, foi pesquisada a estrutura mais recomendada para LP
de vendas (~6-9 seções, sem menu de navegação competindo com os CTAs) e
a página foi reduzida para 7 seções + header enxuto:

| Seção removida | Onde o conteúdo foi absorvido |
|---|---|
| Blocos por Público (residencial/empresarial) | Virou 1 frase no texto do card da Hero |
| Diferencial (mesmo consultor no pós-venda) | Virou destaque em `<strong>` dentro da 3ª etapa de "Como Funciona" |
| Problema (3 furos dos sistemas comuns) | Virou o parágrafo de introdução da seção Solução |
| Videomonitoramento — App | Virou uma pergunta nova no FAQ ("Consigo acompanhar as câmeras pelo celular?") |
| Menu completo do header | Reduzido a só logo + botão de WhatsApp, em todas as telas |

---

## 5. Design system

### Cores (`variables.css`)
- `--color-red: #DC2626` / `--color-red-dark: #B91C1C` / `--color-red-light: #FEE2E2`
- `--color-black: #0F1115`
- `--color-graphite: #3F4753` / `--color-graphite-light: #6B7280`
- `--color-offwhite: #F7F5F2` / `--color-white: #FFFFFF`
- `--color-border: #E4E0DA`

### Tipografia
Fonte única (Sora) em 3 papéis diferentes via variável, todos apontando
pra Sora: `--font-display`, `--font-body`, `--font-mono`.

### Espaçamento
Escala em base 8px: `--space-1` (0.5rem) até `--space-8` (8rem).

### Breakpoints oficiais (não inventar um novo — usar sempre estes)
```
≤480px   → celulares pequenos / zoom alto
≥640px   → tablets e celulares largos
≥760px   → grids de 3 colunas / troca mobile↔desktop da Hero e do Header
≥820px   → composições amplas
≥980px   → layouts de 2 colunas
≥1100px  → grids de 5 colunas
```

---

## 6. Padrões técnicos importantes

### Sistema de animação `.reveal` / `.repetir`
Elementos com classe `.reveal` começam invisíveis e sobem+aparecem
quando entram na tela (`IntersectionObserver` em `main.js`). Por
padrão, anima **uma vez só**. Elementos que também têm a classe
`.repetir` voltam ao estado escondido ao sair da tela, pra animar de
novo toda vez que a pessoa rolar por cima (usado nos passos de "Como
Funciona" e nos cards de vídeo-monitoramento antigos).

### Card flutuante da Hero ("vazamento" sobre a seção seguinte)
No desktop (≥760px), o card de CTA da Hero usa `margin-bottom` negativo
pra "vazar" visualmente por cima do início da seção Solução, criando o
efeito de card quebrando a fronteira entre as duas seções. Isso exige
3 peças sempre sincronizadas:
1. `.hero { z-index: 2; }` — garante que a Hero (e o card) desenhe por
   cima da seção seguinte.
2. `.hero-card { margin-bottom: -35px; }` (valor atual) — o vazamento em si.
3. `.solucao { padding-top: calc(var(--space-7) + 35px); }` no
   `@media (min-width: 760px)` — compensa o espaço, senão o título da
   Solução fica embaixo do card.

**Se mudar o valor do vazamento, os dois arquivos (`hero.css` e
`solucao.css`) precisam mudar juntos, com o mesmo número.** No mobile
esse efeito não existe — lá é tudo empilhado normal (foto curta, depois
o card, sem sobrepor nada).

### Header responsivo (2 formatos bem diferentes)
- **Mobile (<760px):** cartão pequeno flutuante, só com a logo, no
  canto superior esquerdo, por cima da foto da Hero. Sem barra, sem
  menu.
- **Desktop (≥760px):** barra completa no topo, com logo + botão de
  WhatsApp (sem menu).

A troca entre os dois formatos acontece no mesmo breakpoint (760px) que
a Hero troca de "empilhada" pra "foto de fundo em tela cheia" — os dois
precisam mudar juntos.

### Imagem única da Hero servindo mobile e desktop
Não existem duas imagens diferentes — é a mesma foto
(`hero-protseg-fachada.jpg`), só que com `object-position` diferente
por breakpoint: `left 35%` no mobile (ancorada pela esquerda, pra não
cortar o texto que já vem desenhado na imagem) e `center 35%` no
desktop.

### Botões menores no mobile + texto encurtado
Existe uma classe `.btn-mobile-esconder` que esconde palavras
dispensáveis (como "grátis" e "agora") só abaixo de 480px, deixando os
botões mais curtos sem precisar de dois textos diferentes no HTML.

---

## 7. Pendências conhecidas (não bloqueantes)

- [ ] Confirmar o nome oficial do app na loja (aparece "Grupo PROTEGER"
  no mockup usado, mas não foi confirmado)
- [ ] Nota real do Google Meu Negócio + número de avaliações (hoje o
  texto só diz "nota máxima", sem número)
- [ ] Autorização de uso de cada logo de cliente corporativo mostrado
  na Prova Social
- [ ] Domínio novo pra hospedar a LP definitivamente
- [ ] Imagem de Open Graph (`assets/images/og-protseg.jpg`) —
  referenciada no `<head>` mas ainda não criada
- [ ] Testar nas 5 resoluções oficiais (320×568, 375×667, 768×1024,
  1366×768, 1920×1080) depois da reestruturação
- [ ] Revisar todos os links internos (âncoras `#solucao`,
  `#prova-social`, `#calculadora`, `#faq`) depois de qualquer nova
  mudança estrutural

---

## 8. Fluxo de trabalho

```powershell
git status                          # ver o que mudou
git add .
git commit -m "descrição do que mudou"
git push
```

Sempre testar localmente (`Ctrl+F5` pra evitar cache, principalmente
depois de mudar fontes ou imagens) antes de subir. Ao colar CSS/HTML de
uma resposta pra outra, abrir um arquivo por vez — colar tudo junto
sem querer já causou bugs de mistura de arquivos nesse projeto mais de
uma vez.
