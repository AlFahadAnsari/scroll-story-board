import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CinematicFilm } from "@/cinematic/CinematicFilm";
import { SEGMENTS } from "@/cinematic/timeline";
import { Header, Preloader } from "@/components/site/Chrome";
import { useSiteMotion } from "@/lib/motion";
import { Culture, FindYourAxe, Footer, FormatsAndGrid, Performance, WhatsInside } from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AXE India — The AXE Effect" },
      { name: "description", content: "One spray changes everything. Explore Indigo Haze, Marshmallow Smoke, Aqua Bergamot, Black Vanilla and Number 10." },
      { property: "og:title", content: "AXE India — The AXE Effect" },
      { property: "og:description", content: "Scroll the AXE Effect film, then find your AXE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function StaticFilm() {
  return (
    <section aria-label="The AXE Effect">
      {SEGMENTS.filter((s) => s.copy.length && !s.lineup).map((s) => (
        <div key={s.id} className="relative flex h-[70vh] items-end overflow-hidden p-8">
          <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="relative">{s.copy.map((c) => <p key={c.text} className="text-display-lg">{c.text}</p>)}</div>
        </div>
      ))}
    </section>
  );
}

function Index() {
  const [reduced, setReduced] = useState(false);
  const [cinematic, setCinematic] = useState(true);
  const [, setLoaded] = useState(false);
  const done = useCallback(() => setLoaded(true), []);
  useSiteMotion();

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onScroll = () => {
      const r = document.getElementById("range");
      setCinematic(!r || r.getBoundingClientRect().top > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div id="top" className="bg-background text-foreground">
      <a href="#range" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-primary focus:p-3 focus:text-primary-foreground">
        Skip to products
      </a>
      {!reduced && <Preloader onDone={done} />}
      <Header cinematic={cinematic} />
      <main>
        {reduced ? <StaticFilm /> : <CinematicFilm />}
        <div className="px-6 pb-4 pt-20 text-center md:px-12">
          <a href="#range" className="btn-primary">Explore the range →</a>
        </div>
        <FindYourAxe />
        <WhatsInside />
        <Performance />
        <FormatsAndGrid />
        <Culture />
      </main>
      <Footer />
    </div>
  );
}
