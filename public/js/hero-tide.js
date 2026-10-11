(() => {
  const canvas = document.querySelector("#hero-tide");
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!context) return;

  const hero = canvas.parentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 700px)");
  let width = 0;
  let height = 0;
  let columns = 0;
  let rows = 0;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let inView = true;

  const draw = (time = 0) => {
    context.clearRect(0, 0, width, height);
    if (!width || !height) return;

    const cellWidth = width / (columns - 1);
    const cellHeight = (height * 0.76) / (rows - 1);

    for (let row = 0; row < rows; row += 1) {
      const depth = row / (rows - 1);
      const baseline = height * 0.12 + depth * cellHeight * (rows - 1);
      const amplitude = 4 + depth * (mobile.matches ? 17 : 25);

      for (let column = 0; column < columns; column += 1) {
        const x = column * cellWidth;
        const phase = (x / Math.max(width, 1)) * 7.2 + time * 0.62 + depth * 1.35;
        const wave = Math.sin(phase) * amplitude
          + Math.sin(phase * 0.48 - time * 0.4) * amplitude * 0.42;
        const y = baseline + wave;

        // Keep the area beneath the centered headline slightly quieter.
        const centerDistance = Math.abs(x / width - 0.5) * 2;
        const textQuiet = 0.58 + centerDistance * 0.42;
        const shimmer = 0.55 + 0.45 * ((Math.sin(phase * 1.7) + 1) * 0.5);
        const alpha = (0.065 + depth * 0.15) * textQuiet * shimmer;
        const radius = 0.8 + depth * 0.65;

        context.fillStyle = `rgba(202, 199, 190, ${alpha})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    }
  };

  const animate = (timestamp) => {
    frame = 0;
    if (reducedMotion.matches || !inView || document.hidden) return;
    if (timestamp - lastFrame >= 1000 / 30) {
      const delta = lastFrame ? Math.min(timestamp - lastFrame, 50) : 0;
      elapsed += delta / 1000;
      lastFrame = timestamp;
      draw(elapsed);
    }
    frame = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    if (reducedMotion.matches) {
      draw(0);
      return;
    }
    if (inView && !document.hidden) frame = window.requestAnimationFrame(animate);
  };

  const resize = () => {
    const bounds = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile.matches ? 1.25 : 1.5);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    // A sparse adaptive grid keeps mobile rendering comfortably light.
    columns = Math.max(24, Math.ceil(width / (mobile.matches ? 12 : 11)));
    rows = Math.max(16, Math.ceil(height / (mobile.matches ? 23 : 19)));
    draw(reducedMotion.matches ? 0 : elapsed);
    start();
  };

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(hero);
  } else {
    window.addEventListener("resize", resize, { passive: true });
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      start();
    }).observe(hero);
  }

  reducedMotion.addEventListener?.("change", start);
  mobile.addEventListener?.("change", resize);
  document.addEventListener("visibilitychange", start);
  resize();
})();
