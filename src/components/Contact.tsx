import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Hls from "hls.js";
import { HLS_SRC } from "../data/site";

const MARQUEE_TEXT = "BUILDING THE FUTURE • ".repeat(10);

const SOCIAL_LINKS = ["Twitter", "LinkedIn", "Dribbble", "GitHub"] as const;

const CONTACT_EMAIL = "faizan514pathan@gmail.com";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      botcheck: data.get("botcheck") ? "1" : "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please try again or email me directly.");
    }
  }

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

        {/* Contact form (Web3Forms — no backend) */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-xl mx-auto text-left"
        >
          {/* Honeypot for spam bots */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="w-full rounded-xl bg-surface/60 border border-stroke px-4 py-3 text-sm text-text-primary placeholder:text-muted outline-none focus:border-text-primary/40 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email"
                className="w-full rounded-xl bg-surface/60 border border-stroke px-4 py-3 text-sm text-text-primary placeholder:text-muted outline-none focus:border-text-primary/40 transition-colors"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell me about your project…"
              className="w-full rounded-xl bg-surface/60 border border-stroke px-4 py-3 text-sm text-text-primary placeholder:text-muted outline-none focus:border-text-primary/40 transition-colors resize-y"
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-[-2px] accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative inline-flex items-center gap-2 bg-bg text-text-primary rounded-full px-7 py-3.5 text-sm">
                {status === "sending" ? "Sending…" : "Send message"}
                <span aria-hidden="true">→</span>
              </span>
            </button>

            <div aria-live="polite" className="min-h-[1.25rem] text-sm">
              {status === "success" && (
                <p className="text-green-400">
                  Thanks! Your message is on its way — I'll be in touch soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400">
                  {errorMsg}{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="underline hover:text-text-primary"
                  >
                    Email me directly
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </form>
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
          © 2026 Faizan Pathan
        </p>
      </div>
    </section>
  );
}
