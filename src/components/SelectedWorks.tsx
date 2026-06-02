import { motion } from "framer-motion";
import { PROJECTS } from "../data/site";

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
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
                  Selected Work
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary mt-4">
                Featured <span className="italic">projects</span>
              </h2>
              <p className="text-sm md:text-base text-muted max-w-md mt-4">
                A selection of projects I've worked on, from concept to launch.
              </p>
            </div>

            <a
              href="#work"
              className="group relative hidden md:inline-flex items-center gap-2 rounded-full shrink-0"
            >
              <span className="absolute inset-[-1px] accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative inline-flex items-center gap-2 bg-bg px-5 py-2.5 rounded-full text-sm text-text-primary">
                View all work <span aria-hidden="true">→</span>
              </span>
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 mt-10 md:mt-14">
          {PROJECTS.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block overflow-hidden bg-surface border border-stroke rounded-3xl ${project.span} ${project.aspect}`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              />

              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-opacity duration-500 flex items-center justify-center">
                <div className="relative rounded-full p-px accent-gradient-animated">
                  <div className="bg-text-primary text-bg rounded-full px-5 py-2.5 text-sm">
                    View — <span className="font-display italic">{project.title}</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-bg/80 to-transparent">
                <p className="text-xs text-muted uppercase tracking-widest">
                  {project.category}
                </p>
                <p className="text-lg md:text-xl font-display italic text-text-primary">
                  {project.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
