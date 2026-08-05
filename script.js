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

  const portals = Array.from(document.querySelectorAll('.portal-link'));
  if (!portals.length) return;

  const hoverSound = new Audio('assets/audio/Bckgrnd01.mp3');
  hoverSound.preload = 'auto';
  hoverSound.volume = 0.32;

  const backgroundSound = new Audio('assets/audio/creepy-broken-music-box-loop.mp3');
  backgroundSound.preload = 'auto';
  backgroundSound.loop = true;
  backgroundSound.volume = 0;
  let backgroundStarted = false;
  let backgroundFadeFrame = 0;

  const startBackgroundSound = async () => {
    if (backgroundStarted) return;
    try {
      await backgroundSound.play();
      backgroundStarted = true;
      const targetVolume = 0.105;
      const fadeStart = performance.now();
      const fadeDuration = 2600;
      const fadeIn = (now) => {
        const progress = Math.min(1, (now - fadeStart) / fadeDuration);
        backgroundSound.volume = targetVolume * progress;
        if (progress < 1) backgroundFadeFrame = requestAnimationFrame(fadeIn);
      };
      cancelAnimationFrame(backgroundFadeFrame);
      backgroundFadeFrame = requestAnimationFrame(fadeIn);
    } catch {
      backgroundStarted = false;
    }
  };

  let audioUnlocked = false;
  let lastPlayedAt = 0;
  const cooldownMs = 650;

  const unlockAudio = async () => {
    if (audioUnlocked) return true;

    try {
      const originalVolume = hoverSound.volume;
      hoverSound.volume = 0;
      await hoverSound.play();
      hoverSound.pause();
      hoverSound.currentTime = 0;
      hoverSound.volume = originalVolume;
      audioUnlocked = true;
      await startBackgroundSound();
      return true;
    } catch {
      hoverSound.volume = 0.32;
      return false;
    }
  };

  const playHoverSound = async () => {
    const now = Date.now();
    if (now - lastPlayedAt < cooldownMs) return;

    if (!audioUnlocked) {
      const ready = await unlockAudio();
      if (!ready) return;
    }

    try {
      hoverSound.pause();
      hoverSound.currentTime = 0;
      hoverSound.volume = 0.32;
      await hoverSound.play();
      lastPlayedAt = now;
    } catch {
      // Browser may still require a click or tap before hover audio is allowed.
    }
  };

  portals.forEach((portal) => {
    portal.addEventListener('mouseenter', playHoverSound);
    portal.addEventListener('focus', playHoverSound);
    portal.addEventListener('pointerdown', async () => {
      await unlockAudio();
    }, { passive: true });
  });

  const firstInteractionUnlock = async () => {
    await unlockAudio();
    await startBackgroundSound();
    window.removeEventListener('pointerdown', firstInteractionUnlock);
    window.removeEventListener('keydown', firstInteractionUnlock);
  };

  window.addEventListener('pointerdown', firstInteractionUnlock, { passive: true });
  window.addEventListener('keydown', firstInteractionUnlock);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      backgroundSound.pause();
    } else if (backgroundStarted) {
      backgroundSound.play().catch(() => {});
    }
  });
})();
