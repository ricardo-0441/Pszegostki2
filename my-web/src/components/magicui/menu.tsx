"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
const Link: React.FC<LinkProps> = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(
      sectionId.toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[^\w-]/g, "")
    )
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false)
    }
  }

  const navItems = ["Sobre nosotros", "Servicios", "Propiedades"]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center py-4 px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold">
          Ricardo Pszegostki
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="nav-text hover:no-underline group transition-colors duration-200 ease-in-out"
            >
              <span className="group-hover:underline decoration-1 underline-offset-4">
                {item}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <motion.span
            style={{ display: 'block', width: '1.5rem', height: '0.125rem', backgroundColor: 'black', marginBottom: '0.25rem' }}
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
          />
          <motion.span
            style={{ display: 'block', width: '1.5rem', height: '0.125rem', backgroundColor: 'black', marginBottom: '0.25rem' }}
            animate={{ opacity: menuOpen ? 0 : 1 }}
          />
          <motion.span
            style={{ display: 'block', width: '1.5rem', height: '0.125rem', backgroundColor: 'black' }}
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: '#e5e7eb', overflow: 'hidden' }}
          >
            <div className="flex flex-col items-center py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-lg font-medium hover:underline"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}