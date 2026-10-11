(() => {
  const sphere = document.querySelector('.hero-background-sphere');
  const image = document.querySelector('.hero-artwork-image');
  const glass = document.querySelector('.hero-background-sphere-glass');

  if (sphere && image && glass) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;

      sphere.style.transform = `perspective(1800px) rotateX(${-currentY * 7.5}deg) rotateY(${currentX * 9}deg) translate3d(${currentX * 18}px, ${currentY * 13}px, 0)`;
      image.style.transform = `translate3d(${currentX * -34}px, ${currentY * -24}px, 24px) scale(1.04)`;
      glass.style.transform = `translate3d(${currentX * 16}px, ${currentY * 12}px, 36px)`;

      frame = requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      if (reducedMotion.matches || !finePointer.matches) return;
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const reset = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', reset, { passive: true });
    window.addEventListener('blur', reset, { passive: true });

    if (!reducedMotion.matches && finePointer.matches) {
      frame = requestAnimationFrame(render);
    }

    reducedMotion.addEventListener?.('change', () => {
      cancelAnimationFrame(frame);
      reset();
      sphere.style.transform = '';
      image.style.transform = '';
      glass.style.transform = '';
      if (!reducedMotion.matches && finePointer.matches) frame = requestAnimationFrame(render);
    });
  }

})();


(() => {
  const morphNoise = document.getElementById('faceMorphNoise');
  const morphDisplace = document.getElementById('faceMorphDisplace');
  const heroImage = document.querySelector('.hero-artwork-image');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!morphNoise || !morphDisplace || !heroImage || reducedMotion.matches) return;

  let raf = 0;
  const start = performance.now();

  const animateMorph = (now) => {
    const t = (now - start) / 1000;

    const freqX = 0.0088 + Math.sin(t * 0.29) * 0.0026 + Math.sin(t * 0.67) * 0.00135;
    const freqY = 0.0128 + Math.cos(t * 0.24) * 0.003 + Math.sin(t * 0.53) * 0.00145;
    const scale = 20.5 + Math.sin(t * 0.49) * 6.4 + Math.cos(t * 0.31) * 4.8;

    morphNoise.setAttribute('baseFrequency', `${freqX.toFixed(4)} ${freqY.toFixed(4)}`);
    morphDisplace.setAttribute('scale', scale.toFixed(2));

    const stretchX = 1 + Math.sin(t * 0.38) * 0.031 + Math.cos(t * 0.72) * 0.016;
    const stretchY = 1 + Math.cos(t * 0.34) * 0.036 + Math.sin(t * 0.61) * 0.014;
    const driftX = Math.sin(t * 0.41) * 12.6 + Math.cos(t * 0.22) * 5.8;
    const driftY = Math.cos(t * 0.36) * 9.9 + Math.sin(t * 0.47) * 4.9;
    heroImage.style.transform = `translate3d(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px, 14px) scale(${stretchX.toFixed(3)}, ${stretchY.toFixed(3)}) skew(${(Math.sin(t * 0.39) * 1.35).toFixed(2)}deg, ${(Math.cos(t * 0.44) * 1.05).toFixed(2)}deg)`;

    raf = requestAnimationFrame(animateMorph);
  };

  raf = requestAnimationFrame(animateMorph);

  reducedMotion.addEventListener?.('change', () => {
    cancelAnimationFrame(raf);
    if (!reducedMotion.matches) raf = requestAnimationFrame(animateMorph);
    else heroImage.style.transform = '';
  });
})();


(() => {
  const curtain = document.querySelector('.page-transition');
  const links = Array.from(document.querySelectorAll('.portal-link'));
  if (!curtain) return;

  const revealPage = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => curtain.classList.add('is-ready'));
    });
  };

  const hidePage = (url) => {
    curtain.classList.remove('is-ready');
    curtain.classList.add('is-leaving');
    window.setTimeout(() => {
      window.location.href = url;
    }, 260);
  };

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      hidePage(link.href);
    });
  });

  window.addEventListener('pageshow', () => {
    curtain.classList.remove('is-leaving');
    revealPage();
  });

  window.addEventListener('pagehide', () => {
    curtain.classList.remove('is-ready');
    curtain.classList.add('is-leaving');
  });

  revealPage();
})();
