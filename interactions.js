const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

if (!reducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(
    ".hero-copy, .ticker, .split > h2, .big, .project, .work, .tile, .rows li, .edu, .contact"
  ).forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });

  if (finePointer) {
    const tiltTargets = document.querySelectorAll(".portrait, .project, .work, .tile");
    tiltTargets.forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.setProperty("--rx", `${-y * 5}deg`);
        element.style.setProperty("--ry", `${x * 7}deg`);
      });

      element.addEventListener("pointerleave", () => {
        element.style.removeProperty("--rx");
        element.style.removeProperty("--ry");
      });
    });
  }

  document.querySelector(".portrait")?.classList.add("is-floating");
}
