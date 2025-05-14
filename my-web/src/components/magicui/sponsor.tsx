"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Array de logos (puedes agregar más svg o imágenes)
const logos: React.ReactNode[] = [
  // Notion
  <svg key="notion" width="129" height="48" viewBox="0 0 129 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    {/* ... path data ... */}
  </svg>,
  // Stripe
  <svg key="stripe" width="80" height="48" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    {/* ... path data ... */}
  </svg>,
  // Dropbox
  <svg key="dropbox" width="163" height="48" viewBox="0 0 163 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    {/* ... */}
  </svg>,
  // Shopify
  <svg key="shopify" width="127" height="48" viewBox="0 0 127 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    {/* ... */}
  </svg>,
  // Slack
  <svg key="slack" width="122" height="48" viewBox="0 0 122 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    {/* ... */}
  </svg>,
];

export const Logos: React.FC = () => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Ajusta la visibilidad según ancho
  useEffect(() => {
    const updateVisible = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const itemWidth = 160; // ancho aprox de cada logo + margen
      const perView = Math.max(1, Math.floor(width / itemWidth));
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.start + perView, logos.length)
      }));
    };
    updateVisible();
    const obs = new ResizeObserver(updateVisible);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [visibleRange.start]);

  const next = () => {
    const count = visibleRange.end - visibleRange.start;
    const start = Math.min(logos.length - count, visibleRange.start + count);
    setVisibleRange({ start, end: start + count });
  };

  const prev = () => {
    const count = visibleRange.end - visibleRange.start;
    const start = Math.max(0, visibleRange.start - count);
    setVisibleRange({ start, end: start + count });
  };

  const visibleCount = Math.max(1, visibleRange.end - visibleRange.start);
  const pageCount = Math.ceil(logos.length / visibleCount);
  const currentPage = Math.floor(visibleRange.start / visibleCount);

  return (
    <section id="logos" className="py-32 px-5 bg-background">
      <p className="text-lg font-medium text-center">
        Nos respaldan empresas de renombre
      </p>

      <div className="relative mt-5" ref={containerRef}>
        <div className="flex overflow-hidden">
          {logos.slice(visibleRange.start, visibleRange.end).map((logo, idx) => (
            <motion.div
              key={visibleRange.start + idx}
              className="flex-shrink-0 w-40 mx-4 opacity-70 hover:opacity-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {logo}
            </motion.div>
          ))}
        </div>

        {visibleRange.start > 0 && (
          <motion.button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow text-secondary hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}

        {visibleRange.end < logos.length && (
          <motion.button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow text-secondary hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </div>

      {/* Paginación */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const start = i * visibleCount;
                setVisibleRange({ start, end: start + visibleCount });
              }}
              className={`w-3 h-3 rounded-full ${
                i === currentPage ? 'bg-secondary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Logos;
