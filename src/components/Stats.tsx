import { motion } from "framer-motion";
import { STATS } from "../data/site";

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-5xl md:text-7xl font-display text-text-primary">
                {stat.value}
              </span>
              <span className="text-sm text-muted uppercase tracking-[0.2em] mt-3">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
