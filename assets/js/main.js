/**
 * AuraPulse - Precision Smartwatch JavaScript Engine
 * Controlador de Animações, Interações, Seletores, Prova Social e Conversão
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initVariantPickers();
  initWatchScreenModes();
  initPaymentCalculator();
  initCepCalculator();
  initSocialProofToast();
  initAlertsToggle();
  initCountdownTimer();
  initCheckoutModal();
  initFaqAccordion();
  initHapticAudioFeedback();
});

/**
 * 1. Animações de Scroll Estilo Framer Motion via IntersectionObserver
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.motion-fade-up, .motion-fade-in, .motion-scale-up'
  );

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * 2. Feedback Háptico / Sonoro com Web Audio API
 */
let audioCtx = null;
let soundEnabled = true;

function playHapticSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch {
    // Ignora se o navegador restringir áudio antes de interação
  }
}

function initHapticAudioFeedback() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-toggle-icon');

  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundIcon.textContent = soundEnabled ? 'volume_up' : 'volume_off';
      soundToggleBtn.classList.toggle('text-primary-container', soundEnabled);
      soundToggleBtn.classList.toggle('text-on-surface-variant', !soundEnabled);
      if (soundEnabled) playHapticSound('click');
    });
  }
}

/**
 * 3. Seletor de Variantes (Acabamentos e Tamanhos)
 */
function initVariantPickers() {
  const swatches = document.querySelectorAll('.variant-swatch');
  const variantLabel = document.getElementById('selected-variant-name');
  const heroImage = document.getElementById('hero-watch-image');

  const variantMap = {
    titanium: {
      name: 'Titânio Aeroespacial (Natural)',
      img: 'assets/images/watch-hero.png'
    },
    midnight: {
      name: 'Midnight Black (Preto Fosco)',
      img: 'assets/images/watch-premium.jpg'
    },
    starlight: {
      name: 'Starlight Silver (Prata Cirúrgica)',
      img: 'assets/images/watch-hero.png'
    }
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const variantKey = swatch.dataset.variant;
      if (!variantKey || !variantMap[variantKey]) return;

      playHapticSound('click');
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      if (variantLabel) {
        variantLabel.textContent = variantMap[variantKey].name;
      }

      // Sincroniza com o modelo 3D WebGL
      if (window.setWatchVariant3D) {
        window.setWatchVariant3D(variantKey);
      }

      if (heroImage) {
        heroImage.style.opacity = '0.3';
        heroImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
          heroImage.src = variantMap[variantKey].img;
          heroImage.style.opacity = '1';
          heroImage.style.transform = 'scale(1)';
        }, 180);
      }
    });
  });

  // Seletor de Tamanho (41mm vs 45mm)
  const sizeButtons = document.querySelectorAll('.size-selector-btn');
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playHapticSound('click');
      sizeButtons.forEach(b => {
        b.classList.remove('bg-surface-container-high', 'text-primary-container', 'shadow-sm', 'border-cyan-subtle');
        b.classList.add('text-on-surface-variant');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.remove('text-on-surface-variant');
      btn.classList.add('bg-surface-container-high', 'text-primary-container', 'shadow-sm', 'border-cyan-subtle');
      btn.setAttribute('aria-checked', 'true');
    });
  });
}

/**
 * 4. Modos Interativos do Mostrador do Relógio
 */
function initWatchScreenModes() {
  const modeButtons = document.querySelectorAll('.screen-mode-btn');
  const screenContent = document.getElementById('watch-active-screen');

  const screens = {
    cardio: `
      <div class="flex items-center gap-2">
        <svg class="w-10 h-4 text-primary-container" fill="none" viewBox="0 0 60 20">
          <path class="ecg-line" d="M0 10H14L18 3L23 17L28 7L32 12L36 10H60" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"></path>
        </svg>
        <span class="text-xs font-bold text-white">138 <span class="text-[10px] text-secondary">BPM</span></span>
      </div>
    `,
    sport: `
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-secondary text-[16px]">directions_run</span>
        <span class="text-xs font-bold text-white">Pace 3:18 <span class="text-[10px] text-primary-container">• 640 kcal</span></span>
      </div>
    `,
    notif: `
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-emerald-400 text-[16px]">chat</span>
        <span class="text-xs font-bold text-white">WhatsApp <span class="text-[10px] text-slate-300">Nova msg</span></span>
      </div>
    `
  };

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (!mode || !screens[mode] || !screenContent) return;

      playHapticSound('click');
      modeButtons.forEach(b => {
        b.classList.remove('bg-primary-container', 'text-slate-950', 'font-bold');
        b.classList.add('bg-surface-container-high', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary-container', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');

      // Sincroniza com a tela AMOLED do modelo 3D
      if (window.setWatchScreenMode3D) {
        window.setWatchScreenMode3D(mode);
      }

      screenContent.classList.add('is-switching');
      setTimeout(() => {
        screenContent.innerHTML = screens[mode];
        screenContent.classList.remove('is-switching');
      }, 150);
    });
  });
}

/**
 * 5. Calculadora Dinâmica de Pagamento (PIX vs Cartão)
 */
function initPaymentCalculator() {
  const methodButtons = document.querySelectorAll('.pay-method-btn');
  const priceDisplay = document.getElementById('price-main-val');
  const termsDisplay = document.getElementById('price-terms-val');
  const stickyPriceDisplay = document.getElementById('sticky-price-val');
  const stickyTermsDisplay = document.getElementById('sticky-terms-val');

  methodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.dataset.method;
      playHapticSound('click');

      methodButtons.forEach(b => {
        b.classList.remove('bg-surface-container-highest', 'text-primary-container', 'border-cyan-subtle');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('bg-surface-container-highest', 'text-primary-container', 'border-cyan-subtle');
      btn.classList.remove('text-on-surface-variant');

      if (method === 'pix') {
        if (priceDisplay) priceDisplay.textContent = 'R$ 177,65';
        if (termsDisplay) termsDisplay.textContent = 'À vista no PIX com 5% de desconto extra + aprovação imediata';
        if (stickyPriceDisplay) stickyPriceDisplay.textContent = 'R$ 177,65';
        if (stickyTermsDisplay) stickyTermsDisplay.textContent = 'no PIX com 5% off extra';
      } else {
        if (priceDisplay) priceDisplay.textContent = 'R$ 187,00';
        if (termsDisplay) termsDisplay.textContent = 'ou até 12x de R$ 18,70 sem juros no cartão de crédito';
        if (stickyPriceDisplay) stickyPriceDisplay.textContent = 'R$ 187,00';
        if (stickyTermsDisplay) stickyTermsDisplay.textContent = 'em até 12x sem juros';
      }
    });
  });
}

/**
 * 6. Consulta Dinâmica de CEP e Frete Grátis
 */
function initCepCalculator() {
  const cepInput = document.getElementById('shipping-cep-input');
  const cepBtn = document.getElementById('calc-cep-btn');
  const cepResult = document.getElementById('shipping-result');

  if (!cepInput || !cepBtn || !cepResult) return;

  function lookupCep() {
    const rawCep = cepInput.value.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      cepResult.innerHTML = '<span class="text-rose-400">Por favor, digite um CEP válido com 8 dígitos.</span>';
      cepResult.classList.remove('hidden');
      return;
    }

    cepBtn.disabled = true;
    cepBtn.textContent = 'Consultando...';

    fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
      .then(res => res.json())
      .then(data => {
        cepBtn.disabled = false;
        cepBtn.textContent = 'Calcular';
        if (data.erro) {
          cepResult.innerHTML = '<span class="text-rose-400">CEP não localizado. O frete grátis continua válido para todo o Brasil!</span>';
        } else {
          playHapticSound('success');
          cepResult.innerHTML = `
            <div class="flex items-center gap-2 text-secondary font-semibold">
              <span class="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Frete Grátis Sedex para ${data.localidade}/${data.uf}</span>
            </div>
            <span class="text-xs text-on-surface-variant block mt-0.5">Prazo estimado: 3 a 5 dias úteis com código de rastreamento.</span>
          `;
        }
        cepResult.classList.remove('hidden');
      })
      .catch(() => {
        cepBtn.disabled = false;
        cepBtn.textContent = 'Calcular';
        cepResult.innerHTML = `
          <div class="flex items-center gap-2 text-secondary font-semibold">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>Frete Grátis Brasil Garantido!</span>
          </div>
          <span class="text-xs text-on-surface-variant block mt-0.5">Prazo médio de 3 a 7 dias úteis com rastreio imediato.</span>
        `;
        cepResult.classList.remove('hidden');
      });
  }

  cepBtn.addEventListener('click', lookupCep);
  cepInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') lookupCep();
  });
}

/**
 * 7. Prova Social Flutuante (Toast de Compras Recentes)
 */
function initSocialProofToast() {
  const toast = document.getElementById('social-toast');
  const toastText = document.getElementById('social-toast-text');
  const toastTime = document.getElementById('social-toast-time');

  if (!toast || !toastText) return;

  const orders = [
    { name: 'Ricardo F.', city: 'Curitiba/PR', time: 'há 2 minutos' },
    { name: 'Mariana S.', city: 'Belo Horizonte/MG', time: 'há 4 minutos' },
    { name: 'Lucas A.', city: 'São Paulo/SP', time: 'há 1 minuto' },
    { name: 'Camila P.', city: 'Porto Alegre/RS', time: 'há 5 minutos' },
    { name: 'Eduardo M.', city: 'Brasília/DF', time: 'há 3 minutos' }
  ];

  let orderIndex = 0;

  function showNextToast() {
    const order = orders[orderIndex];
    toastText.innerHTML = `<strong>${order.name}</strong> de ${order.city} comprou 1x AuraPulse Pro`;
    if (toastTime) toastTime.textContent = order.time;

    toast.classList.add('is-active');

    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 4500);

    orderIndex = (orderIndex + 1) % orders.length;
  }

  // Primeiro disparo após 4 segundos, depois a cada 16 segundos
  setTimeout(showNextToast, 4000);
  setInterval(showNextToast, 16000);
}

/**
 * 8. Simulador de Alertas Interativo (Toggle Switch)
 */
function initAlertsToggle() {
  const toggleTrack = document.getElementById('alerts-toggle-track');
  const toggleStatus = document.getElementById('alerts-toggle-status');

  if (!toggleTrack) return;

  toggleTrack.addEventListener('click', () => {
    playHapticSound('click');
    const isNowActive = toggleTrack.classList.toggle('active');
    toggleTrack.setAttribute('aria-checked', isNowActive ? 'true' : 'false');
    if (toggleStatus) {
      toggleStatus.textContent = isNowActive 
        ? 'Notificações Ativas no Pulso' 
        : 'Modo Não Perturbe Ativado';
      toggleStatus.classList.toggle('text-secondary', isNowActive);
      toggleStatus.classList.toggle('text-on-surface-variant', !isNowActive);
    }
  });
}

/**
 * 9. Contador Regressivo de Escassez / Lote Promocional
 */
function initCountdownTimer() {
  const timerElement = document.getElementById('countdown-timer');
  if (!timerElement) return;

  let totalSeconds = 2 * 3600 + 47 * 60 + 18;

  function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = n => String(n).padStart(2, '0');
    timerElement.textContent = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

    if (totalSeconds > 0) {
      totalSeconds--;
    }
  }

  updateDisplay();
  setInterval(updateDisplay, 1000);
}

/**
 * 10. Modal de Checkout Rápido e Carrinho
 */
function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const triggerBtns = document.querySelectorAll('[data-path="checkout"], [data-path="cart-checkout"]');

  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    playHapticSound('click');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    playHapticSound('click');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Finalização do checkout simulada
  const finishOrderBtn = document.getElementById('finish-order-btn');
  const checkoutFeedback = document.getElementById('checkout-feedback');
  if (finishOrderBtn && checkoutFeedback) {
    finishOrderBtn.addEventListener('click', () => {
      playHapticSound('success');
      finishOrderBtn.disabled = true;
      finishOrderBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">refresh</span> Processando...';
      
      setTimeout(() => {
        finishOrderBtn.style.display = 'none';
        checkoutFeedback.classList.remove('hidden');
      }, 1200);
    });
  }
}

/**
 * 11. FAQ Accordion (Perguntas Frequentes)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      playHapticSound('click');
      const isExpanded = item.classList.contains('is-expanded');
      faqItems.forEach(other => other.classList.remove('is-expanded'));
      if (!isExpanded) {
        item.classList.add('is-expanded');
      }
    });
  });
}
