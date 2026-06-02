import { motion } from "framer-motion";
import { JOURNAL } from "../data/site";

export default function Journal() {
  return (
    <section id="journal" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">
                  Journal
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary mt-4">
                Recent <span className="italic">thoughts</span>
              </h2>
              <p className="text-sm md:text-base text-muted max-w-md mt-4">
                Notes on design, engineering, and building products people love.
              </p>
            </div>

            <a
              href="#journal"
              className="group relative hidden md:inline-flex items-center gap-2 rounded-full shrink-0"
            >
              <span className="absolute inset-[-1px] accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative inline-flex items-center gap-2 bg-bg px-5 py-2.5 rounded-full text-sm text-text-primary">
                View all <span aria-hidden="true">→</span>
              </span>
            </a>
          </div>
        </motion.div>

        <div className="mt-10 md:mt-14 flex flex-col gap-4">
          {JOURNAL.map((entry, index) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group flex items-center gap-6 p-4 rounded-[40px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-colors cursor-pointer"
            >
              <img
                src={entry.image}
                alt={entry.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0"
              />

              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-display italic text-text-primary">
                  {entry.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted mt-1">
                  <span>{entry.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.date}</span>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="text-muted group-hover:text-text-primary transition-colors"
              >
                →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
