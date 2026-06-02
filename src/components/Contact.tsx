import { useEffect, useRef } from "react";
import gsap from "gsap";
import Hls from "hls.js";
import { HLS_SRC } from "../data/site";

const MARQUEE_TEXT = "BUILDING THE FUTURE • ".repeat(10);

const SOCIAL_LINKS = ["Twitter", "LinkedIn", "Dribbble", "GitHub"] as const;

export default function Contact() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
    }

    return () => {
      hls?.destroy();
    };
  }, []);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const tween = gsap.to(marquee, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section
      id="contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 text-center">
        <p className="text-xs text-muted uppercase tracking-[0.3em]">
          Get in touch
        </p>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display italic text-text-primary mt-4">
          Let's work together
        </h2>

        <div className="mt-8 inline-flex">
          <a href="mailto:hello@michaelsmith.com" className="group relative">
            <span className="absolute inset-[-2px] accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative inline-flex items-center bg-bg text-text-primary rounded-full px-7 py-3.5 text-sm">
              hello@michaelsmith.com ↗
            </span>
          </a>
        </div>
      </div>

      {/* GSAP marquee */}
      <div className="relative z-10 mt-16 md:mt-20 overflow-hidden">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap text-5xl md:text-7xl font-display italic text-text-primary/10"
        >
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-stroke">
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted">Available for projects</span>
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-6">
          © 2026 Michael Smith
        </p>
      </div>
    </section>
  );
}
