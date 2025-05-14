"use client"

import { motion } from "framer-motion"

/**
 * Sección de Llamada a la Acción para sitio inmobiliario.
 * Coloca este componente al final de tu página para invitar a los usuarios a contactarte.
 */
export default function RealEstateCTA() {
  const title = "¿Listo para encontrar tu nuevo hogar?"
  const words = title.split(" ")
  const whatsappUrl = "https://web.whatsapp.com/send?phone=5493758457171&text="

  return (
    <div className="relative py-20 w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      {/* Fondo animado */}
      <div className="absolute inset-0 pointer-events-none">
        {[1, -1].map((pos) => (
          <FloatingPaths key={pos} position={pos} />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            {words.map((word, wi) => (
              <span key={wi} className="inline-block mr-3 last:mr-0">
                {word.split("").map((letter, li) => (
                  <motion.span
                    key={`${wi}-${li}`}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: wi * 0.1 + li * 0.02, type: "spring", stiffness: 140 }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>

          {/* Enlace a WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <span className="block rounded-xl px-8 py-5 text-lg font-medium backdrop-blur-md bg-white/95 dark:bg-black/95 text-black dark:text-white transition-all duration-300 group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10 hover:shadow-md dark:hover:shadow-neutral-800/50">
              Llamar ahora
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  )
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${200 - i * 4 * position} -${100 + i * 5}C-${200 - i * 4 * position} -${100 + i * 5} -${160 - i * 4 * position} ${120 - i * 4} ${100 - i * 4 * position} ${200 - i * 4}C${400 - i * 4 * position} ${280 - i * 4} ${450 - i * 4 * position} ${500 - i * 5} ${450 - i * 4 * position} ${500 - i * 5}`,
    width: 0.4 + i * 0.02,
  }))

  return (
    <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 450 200" fill="none">
      <title>Fondo Animado CTA</title>
      {paths.map((p) => (
        <motion.path
          key={p.id}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.width}
          strokeOpacity={0.1 + p.id * 0.02}
          initial={{ pathLength: 0.2, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
          transition={{ duration: 15 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  )
}