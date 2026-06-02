import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPLORATION_IMAGES } from "../data/site";

gsap.registerPlugin(ScrollTrigger);

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const leftImages = EXPLORATION_IMAGES.filter((_, i) => i % 2 === 0);
  const rightImages = EXPLORATION_IMAGES.filter((_, i) => i % 2 !== 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      gsap.to(leftColRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.to(rightColRef.current, {
        yPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!activeImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImage]);

  const renderCard = (src: string, index: number) => (
    <div
      key={src}
      onClick={() => setActiveImage(src)}
      className={`pointer-events-auto cursor-pointer aspect-square w-full max-w-[320px] mx-auto rounded-3xl overflow-hidden border border-stroke bg-surface ${
        index % 2 === 0 ? "rotate-2" : "-rotate-2"
      }`}
    >
      <img src={src} alt="" className="w-full h-full object-cover" />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="explorations"
      className="relative min-h-[300vh] bg-bg"
    >
      {/* Layer 1 — Pinned center */}
      <div
        ref={contentRef}
        className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">
            Explorations
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-display text-text-primary mt-4">
          Visual <span className="italic">playground</span>
        </h2>

        <p className="text-sm md:text-base text-muted max-w-md mt-4">
          A space for experiments, side-quests, and ideas that didn't fit
          anywhere else.
        </p>

        <div className="group relative mt-8">
          <span className="absolute inset-[-1px] accent-gradient rounded-full opacity-0 group-hover:opacity-100" />
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block bg-bg px-5 py-2.5 rounded-full text-sm"
          >
            Dribbble ↗
          </a>
        </div>
      </div>

      {/* Layer 2 — Parallax columns */}
      <div className="absolute inset-0 z-20 flex items-start justify-center pointer-events-none">
        <div className="max-w-[1400px] w-full px-6 grid grid-cols-2 gap-12 md:gap-40">
          <div ref={leftColRef} className="flex flex-col gap-12 md:gap-24">
            {leftImages.map((src, i) => renderCard(src, i))}
          </div>
          <div ref={rightColRef} className="flex flex-col gap-12 md:gap-24">
            {rightImages.map((src, i) => renderCard(src, i))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
        >
          <img
            src={activeImage}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
          />
        </div>
      )}
    </section>
  );
}
