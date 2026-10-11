(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cards = [...document.querySelectorAll(".study-reveal")];
  if (!cards.length || reducedMotion.matches || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("has-study-motion");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  cards.forEach((card) => observer.observe(card));

  const parallaxCards = cards.filter((card) => card.hasAttribute("data-parallax"));
  const mobile = window.matchMedia("(max-width: 700px)");
  if (!parallaxCards.length || mobile.matches) return;

  let scheduled = false;
  const updateParallax = () => {
    const viewportHeight = window.innerHeight || 1;
    parallaxCards.forEach((card) => {
      const bounds = card.getBoundingClientRect();
      const distanceFromCenter = (bounds.top + bounds.height / 2 - viewportHeight / 2) / viewportHeight;
      const offset = Math.max(-8, Math.min(8, distanceFromCenter * -8));
      card.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    });
    scheduled = false;
  };
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
  updateParallax();
})();
