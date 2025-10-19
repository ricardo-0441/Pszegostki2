"use client"

import { motion, cubicBezier } from "framer-motion"
import { cn } from "@/lib/utils"

// 🔹 Forma animada elegante de fondo
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-gray-200/[0.3]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2, delay, ease: cubicBezier(0.23, 0.86, 0.39, 0.96) }}
    >
      <div className={cn("absolute", className)}>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ width, height }}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-gradient-to-r to-transparent",
              gradient,
              "shadow-lg"
            )}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

// 🔹 Hero principal
export default function HeroGeometric({
  badge = "Inmuebles y Seguros",
  title1 = "Ricardo Pszegotski",
  title2 = "Más de 25 años de experiencia",
}: {
  badge?: string
  title1?: string
  title2?: string
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3 + i * 0.2,
        ease: cubicBezier(0.25, 0.4, 0.25, 1),
      },
    }),
  }

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden bg-white text-gray-900 pt-20"
      id="inicio"
    >
      {/* 🔸 Fondos geométricos */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={500}
          height={100}
          rotate={10}
          className="left-[-10%] top-[20%]"
        />
        <ElegantShape
          delay={0.4}
          width={400}
          height={80}
          rotate={-15}
          className="right-[-5%] top-[60%]"
        />
      </div>

      {/* 🔸 Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center">
        <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6">
            <span className="text-sm text-gray-600 tracking-wide">{badge}</span>
          </div>
        </motion.div>

        <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            {title1}
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-6">
            {title2}
          </h2>
        </motion.div>

        <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Brindamos asesoramiento inmobiliario y seguros personalizados en Apóstoles, Misiones.
          </p>

          <div className="flex justify-center space-x-4">
            <a
              href="#servicios"
              className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors button-font"
            >
              Conoce nuestros servicios
            </a>
            <a
              href="tel:+540375815457171"
              className="px-6 py-3 border border-gray-900 rounded-full hover:bg-gray-100 transition-colors button-font"
            >
              Llamar ahora
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
