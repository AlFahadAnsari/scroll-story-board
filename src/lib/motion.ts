import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Site-wide subtle motion: reveals, parallax, tilt, magnetic buttons. Skipped for reduced motion. */
export function useSiteMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const fine = window.matchMedia("(pointer: fine)").matches;

    // reveals (staggered within a batch)
    const io = new IntersectionObserver(
      (entries) => {
        entries.filter((e) => e.isIntersecting).forEach((e, k) => {
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${k * 90}ms`;
          el.classList.add("is-revealed");
          io.unobserve(el);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // parallax
    const tweens = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]")).map((el) =>
      gsap.fromTo(el, { yPercent: -Number(el.dataset["parallax"] || 10) }, {
        yPercent: Number(el.dataset["parallax"] || 10), ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      }),
    );

    // tilt + magnetic (desktop only)
    const onMove = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      if (t) {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        t.style.setProperty("--rx", `${(x - 0.5) * 8}deg`);
        t.style.setProperty("--ry", `${(0.5 - y) * 8}deg`);
        t.style.setProperty("--px", `${x * 100}%`);
        t.style.setProperty("--py", `${y * 100}%`);
      }
      const m = (e.target as HTMLElement).closest<HTMLElement>(".btn-primary, [data-magnetic]");
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      }
    };
    const onOut = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      if (t && !t.contains(e.relatedTarget as Node)) { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); }
      const m = (e.target as HTMLElement).closest<HTMLElement>(".btn-primary, [data-magnetic]");
      if (m && !m.contains(e.relatedTarget as Node)) m.style.transform = "";
    };
    if (fine) {
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerout", onOut);
    }
    return () => {
      io.disconnect();
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);
}
