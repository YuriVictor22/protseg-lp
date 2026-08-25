/* =========================================================
   PROTSEG LP — main.js
   ========================================================= */

/* ---- Header: sombra ao rolar + esconde à direita / reaparece à esquerda ---- */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ultimoScrollY = window.scrollY;
  let escondida = false;

  function esconderPelaDireita() {
    header.classList.remove('is-hidden-left');
    header.classList.add('is-hidden-right');
    escondida = true;
  }

  function mostrarPelaEsquerda() {
    // 1. Trava a transição e pula instantaneamente pro lado esquerdo,
    //    fora da tela — isso acontece rápido demais pro olho perceber
    header.classList.add('sem-transicao');
    header.classList.remove('is-hidden-right');
    header.classList.add('is-hidden-left');

    // 2. Força o navegador a "aplicar" essa posição antes de animar
    //    (senão o próximo passo já sai animado direto do ponto errado)
    void header.offsetWidth;

    // 3. Destrava a transição e tira o "escondida à esquerda":
    //    agora ela desliza suavemente de volta pro centro, entrando pela esquerda
    header.classList.remove('sem-transicao');
    header.classList.remove('is-hidden-left');
    escondida = false;
  }

  // Entrada ao carregar a página: usa o MESMO mecanismo acima (pulo
  // instantâneo pro lado esquerdo + volta suave), em vez de uma
  // "animation" CSS separada — assim não tem duas coisas competindo
  // pela propriedade "transform" ao mesmo tempo.
  function animarEntrada() {
    header.classList.add('sem-transicao', 'is-hidden-left');
    void header.offsetWidth;
    header.classList.remove('sem-transicao');
    // pequeno atraso de 1 frame garante que o navegador já "pintou"
    // a posição escondida antes de começar a animar de volta
    requestAnimationFrame(() => {
      header.classList.remove('is-hidden-left');
    });
  }

  animarEntrada();

  function onScroll() {
    const atual = window.scrollY;
    header.classList.toggle('is-scrolled', atual > 40);

    const rolandoParaBaixo = atual > ultimoScrollY;
    const passouDoTopo = atual > header.offsetHeight;

    if (rolandoParaBaixo && passouDoTopo && !escondida) {
      esconderPelaDireita();
    } else if (!rolandoParaBaixo && escondida) {
      mostrarPelaEsquerda();
    }

    ultimoScrollY = atual;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Menu mobile ---- */
(function initMobileMenu() {
  const button = document.getElementById('menu-button');
  const menu = document.getElementById('mobile-menu');
  if (!button || !menu) return;

  function abrirMenu() {
    button.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
  }

  function fecharMenu() {
    button.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }

  button.addEventListener('click', () => {
    const aberto = button.getAttribute('aria-expanded') === 'true';
    aberto ? fecharMenu() : abrirMenu();
  });

  // Fecha ao clicar em qualquer link do menu
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });

  // Fecha com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharMenu();
  });

  // Fecha sozinho se a tela virar desktop (evita menu "preso" aberto
  // depois de redimensionar a janela ou girar o celular)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 980) fecharMenu();
  });
})();

/* ---- Reveal: fade + slide ao rolar a página ---- */
(function initReveal() {
  const elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  if (!('IntersectionObserver' in window)) {
    // Sem suporte no navegador: mostra tudo direto, sem animação
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const repete = entry.target.classList.contains('repetir');

      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (!repete) {
          observer.unobserve(entry.target); // anima uma vez só (comportamento padrão)
        }
      } else if (repete) {
        // Só os elementos marcados como "repetir" voltam ao estado
        // escondido ao sair da tela, pra poder animar de novo da
        // próxima vez que a pessoa rolar até eles
        entry.target.classList.remove('is-visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

  elementos.forEach((el) => observer.observe(el));
})();

/* ---- Carrossel de depoimentos: avança sozinho a cada 5s, em loop ---- */
(function initDepoimentosCarrossel() {
  const track = document.getElementById('depoimentos-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.depoimento-card'));
  if (!cards.length) return;

  let ultimaInteracao = 0;

  // Se a pessoa arrastar/tocar no carrossel manualmente, o avanço
  // automático dá uma pausa de alguns segundos antes de voltar,
  // pra não "brigar" com o gesto dela
  track.addEventListener(
    'pointerdown',
    () => {
      ultimaInteracao = Date.now();
    },
    { passive: true }
  );

  function posicaoDoCard(card) {
    return card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  }

  function indiceMaisProximo() {
    let melhorIndice = 0;
    let menorDistancia = Infinity;
    cards.forEach((card, i) => {
      const distancia = Math.abs(posicaoDoCard(card) - track.scrollLeft);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        melhorIndice = i;
      }
    });
    return melhorIndice;
  }

  function avancar() {
    if (Date.now() - ultimaInteracao < 6000) return; // pessoa mexeu recentemente, espera um pouco

    const atual = indiceMaisProximo();
    const proximo = (atual + 1) % cards.length; // ao chegar no último, volta pro primeiro (loop)
    const alvo = cards[proximo];

    track.scrollTo({ left: posicaoDoCard(alvo), behavior: 'smooth' });
  }

  setInterval(avancar, 5000);
})();

/* =========================================================
   Calculadora ("Monte seu sistema")
   ========================================================= */
(function () {
  'use strict';

  const wizard = document.getElementById('calculadora-wizard');
  if (!wizard) return; // segurança: se a seção não existir na página, não quebra nada

  // Número da PROTSEG para onde a mensagem final vai.
  // PENDENTE: trocar pelo número real assim que o Yuri passar.
  const WHATSAPP_NUMERO = '558230367777';

  // Rótulos amigáveis por pergunta, usados para montar o resumo e a mensagem
  const ROTULOS = {
    publico: 'Perfil',
    detalhe: 'Tipo',
    situacao: 'Situação',
  };

  // Mapa de cada "tela" do wizard para o número do passo (1, 2, 3 ou 4=concluído)
  // usado só para pintar a barra de progresso.
  const MAPA_PROGRESSO = {
    '1': 1,
    '2-residencia': 2,
    '2-empresa': 2,
    '3': 3,
    'resultado': 4,
  };

  let historico = ['1'];
  let respostas = {};
  let transicionando = false; // trava clique duplo enquanto a animação roda

  function mostrarPergunta(id) {
    wizard.querySelectorAll('.pergunta').forEach((el) => {
      el.hidden = el.dataset.pergunta !== id;
    });
    atualizarProgresso(id);
  }

  function limparSelecao() {
    wizard.querySelectorAll('.opcao-btn.is-selected').forEach((el) => {
      el.classList.remove('is-selected');
    });
  }

  function atualizarProgresso(id) {
    const atual = MAPA_PROGRESSO[id] || 1;
    wizard.querySelectorAll('.progresso-passo').forEach((el) => {
      const passo = Number(el.dataset.step);
      el.classList.toggle('is-done', passo < atual);
      el.classList.toggle('is-active', passo === atual);
    });
  }

  function montarMensagem() {
    const linhas = [
      'Olá! Vim pelo site da PROTSEG e quero saber mais.',
      '',
      `• ${ROTULOS.publico}: ${respostas.publico}`,
      `• ${ROTULOS.detalhe}: ${respostas.detalhe}`,
      `• ${ROTULOS.situacao}: ${respostas.situacao}`,
    ];
    return linhas.join('\n');
  }

  function mostrarResultado() {
    const mensagem = montarMensagem();

    const resumo = document.getElementById('resultado-resumo');
    if (resumo) {
      resumo.innerHTML = `
        <strong>${ROTULOS.publico}:</strong> ${respostas.publico}<br>
        <strong>${ROTULOS.detalhe}:</strong> ${respostas.detalhe}<br>
        <strong>${ROTULOS.situacao}:</strong> ${respostas.situacao}
      `;
    }

    const linkWhatsapp = document.getElementById('resultado-whatsapp');
    if (linkWhatsapp) {
      linkWhatsapp.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
    }

    historico.push('resultado');
    mostrarPergunta('resultado');
  }

  // Clique em qualquer opção (botões de resposta)
  wizard.querySelectorAll('.opcao-btn').forEach((botao) => {
    botao.addEventListener('click', () => {
      if (transicionando) return; // ignora clique duplo enquanto já está trocando

      const perguntaAtual = botao.closest('.pergunta').dataset.pergunta;
      const valor = botao.dataset.valor;
      const proxima = botao.dataset.proxima;

      if (perguntaAtual === '1') {
        respostas.publico = valor;
      } else if (perguntaAtual.startsWith('2')) {
        respostas.detalhe = valor;
      } else if (perguntaAtual === '3') {
        respostas.situacao = valor;
      }

      // Feedback imediato: o botão escolhido pinta de vermelho...
      transicionando = true;
      botao.classList.add('is-selected');

      // ...e só depois de um instante a gente troca de pergunta,
      // pra pessoa ver que a escolha "registrou" antes da tela mudar.
      setTimeout(() => {
        if (proxima === 'resultado') {
          mostrarResultado();
        } else {
          historico.push(proxima);
          mostrarPergunta(proxima);
        }
        limparSelecao();
        transicionando = false;
      }, 260);
    });
  });

  // Clique em "Voltar" — volta pra pergunta anterior no histórico real
  // (funciona nos dois ramos, residência ou empresa, sem precisar
  // saber de qual ramo o usuário veio)
  wizard.querySelectorAll('.voltar-btn').forEach((botao) => {
    botao.addEventListener('click', () => {
      if (transicionando || historico.length <= 1) return;
      historico.pop();
      limparSelecao();
      mostrarPergunta(historico[historico.length - 1]);
    });
  });

  // Botão "Recomeçar" na tela de resultado
  const botaoReiniciar = document.getElementById('reiniciar-calculadora');
  if (botaoReiniciar) {
    botaoReiniciar.addEventListener('click', () => {
      respostas = {};
      historico = ['1'];
      limparSelecao();
      mostrarPergunta('1');
    });
  }

  // Estado inicial
  mostrarPergunta('1');
})();
