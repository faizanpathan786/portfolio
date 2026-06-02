import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Hls from "hls.js";
import { HLS_SRC, ROLES } from "../data/site";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Resume", href: "#journal" },
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [logoHover, setLogoHover] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [roleIndex, setRoleIndex] = useState(0);

  // HLS video setup
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
      if (hls) hls.destroy();
    };
  }, []);

  // Scroll listener for navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cycle roles
  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".name-reveal", { opacity: 0, y: 50, duration: 1.2, delay: 0.1 });
      tl.from(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20, duration: 1, stagger: 0.1, delay: 0.3 },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    href: string
  ) => {
    e.preventDefault();
    setActiveLink(label);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background HLS video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <nav
          className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 ${
            scrolled ? "shadow-md shadow-black/10" : ""
          }`}
        >
          {/* Logo */}
          <a
            href="#home"
            className="group w-9 h-9 rounded-full p-px accent-gradient transition-transform"
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            onClick={(e) => handleNavClick(e, "Home", "#home")}
            style={
              logoHover
                ? { background: "linear-gradient(270deg,#89AACC,#4E85BF)" }
                : undefined
            }
          >
            <div className="w-full h-full rounded-full bg-bg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="font-display italic text-[13px]">JA</span>
            </div>
          </a>

          {/* Divider */}
          <div className="w-px h-5 bg-stroke mx-1 hidden md:block" />

          {/* Nav links */}
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleNavClick(e, label, href)}
              className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors ${
                activeLink === label
                  ? "text-text-primary bg-stroke/50"
                  : "text-muted hover:text-text-primary hover:bg-stroke/50"
              }`}
            >
              {label}
            </a>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-stroke mx-1 hidden md:block" />

          {/* Say hi button */}
          <a href="#contact" className="group relative">
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative bg-surface rounded-full backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 inline-block text-xs sm:text-sm text-text-primary">
              Say hi ↗
            </span>
          </a>
        </nav>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6">
        <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
          COLLECTION '26
        </p>

        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          Michael Smith
        </h1>

        <p className="blur-in text-muted mb-6">
          A{" "}
          <span
            key={roleIndex}
            className="font-display italic text-text-primary animate-role-fade-in inline-block"
          >
            {ROLES[roleIndex]}
          </span>{" "}
          lives in Chicago.
        </p>

        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12">
          Designing seamless digital interactions by focusing on the unique
          nuances which bring systems to life.
        </p>

        {/* CTA buttons */}
        <div className="blur-in inline-flex gap-4">
          {/* See Works — solid */}
          <a href="#work" className="group relative inline-block hover:scale-105 transition">
            <span className="absolute inset-[-2px] accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative rounded-full text-sm px-7 py-3.5 inline-block bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary transition-colors">
              See Works
            </span>
          </a>

          {/* Reach out — outlined */}
          <a href="#contact" className="group relative inline-block hover:scale-105 transition">
            <span className="absolute inset-[-2px] accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative rounded-full text-sm px-7 py-3.5 inline-block border-2 border-stroke bg-bg text-text-primary group-hover:border-transparent transition-colors">
              Reach out…
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">SCROLL</span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="accent-gradient animate-scroll-down absolute w-full h-1/2" />
        </div>
      </div>
    </section>
  );
}
