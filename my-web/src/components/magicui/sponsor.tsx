"use client";
import { useState, useEffect, useRef } from 'react';

// Iconos SVG personalizados
const Icons = {
  ChevronLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
};

// Array de logos (puedes agregar más svg o imágenes)
const logos: React.ReactNode[] = [
  // Notion
  <svg key="notion" width="129" height="48" viewBox="0 0 129 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    <path d="M20.0185 4.90039L5.86133 6.36523C4.64648 6.48828 4.27148 6.73438 3.52148 7.60742L0.770508 10.9785C0.145508 11.7285 0.0205078 12.0059 0.0205078 12.9082V40.4668C0.0205078 42.1816 0.645508 42.9316 2.48633 42.8047L18.8906 41.4648C20.3535 41.3379 20.8535 40.959 21.4785 40.084L44.3594 9.20703C45.2344 8.08203 45.6094 7.45703 45.6094 6.80078V4.52539C45.6094 3.24805 45.1094 2.74805 43.7656 2.87305L24.6426 4.52539C22.8018 4.65039 21.8496 5.02539 20.0185 4.90039Z" fill="currentColor"/>
    <path d="M20.0185 4.90039L5.86133 6.36523C4.64648 6.48828 4.27148 6.73438 3.52148 7.60742L0.770508 10.9785C0.145508 11.7285 0.0205078 12.0059 0.0205078 12.9082V40.4668C0.0205078 42.1816 0.645508 42.9316 2.48633 42.8047L18.8906 41.4648C20.3535 41.3379 20.8535 40.959 21.4785 40.084L44.3594 9.20703C45.2344 8.08203 45.6094 7.45703 45.6094 6.80078V4.52539C45.6094 3.24805 45.1094 2.74805 43.7656 2.87305L24.6426 4.52539C22.8018 4.65039 21.8496 5.02539 20.0185 4.90039Z" stroke="currentColor" strokeWidth="0.5"/>
  </svg>,
  // Stripe
  <svg key="stripe" width="80" height="48" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    <path fillRule="evenodd" clipRule="evenodd" d="M38.0406 17.5537C38.0406 15.8153 39.2254 14.9209 41.3694 14.9209C44.1726 14.9209 47.7262 15.8662 50.5294 17.5537V9.55012C47.5006 7.96712 44.4974 7.21875 41.3694 7.21875C33.7694 7.21875 28.6406 11.4105 28.6406 18.3481C28.6406 28.8617 43.2662 27.0721 43.2662 31.5913C43.2662 33.6313 41.7534 34.5513 39.4062 34.5513C36.3518 34.5513 32.4694 33.2281 29.3926 31.2393V39.3705C32.6982 41.1089 36.0294 42.0033 39.4062 42.0033C47.2598 42.0033 52.7134 37.9393 52.7134 30.8505C52.687 19.5721 38.0406 21.8409 38.0406 17.5537Z" fill="currentColor"/>
  </svg>,
  // Dropbox
  <svg key="dropbox" width="163" height="48" viewBox="0 0 163 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    <path d="M46.7852 10.3438L36.3906 16.9688L25.9961 10.3438L15.6016 16.9688L25.9961 23.5938L36.3906 16.9688L46.7852 23.5938L57.1797 16.9688L46.7852 10.3438Z" fill="currentColor"/>
    <path d="M15.6016 30.2188L25.9961 36.8438L36.3906 30.2188L25.9961 23.5938L15.6016 30.2188Z" fill="currentColor"/>
    <path d="M36.3906 30.2188L46.7852 36.8438L57.1797 30.2188L46.7852 23.5938L36.3906 30.2188Z" fill="currentColor"/>
  </svg>,
  // Shopify
  <svg key="shopify" width="127" height="48" viewBox="0 0 127 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    <path d="M33.8438 8.90625C33.7812 8.84375 33.6875 8.8125 33.625 8.8125C33.5625 8.8125 31.5312 8.71875 31.5312 8.71875C31.5312 8.71875 29.9688 7.21875 29.7812 7.03125C29.5938 6.84375 29.2188 6.90625 29.0625 6.9375C29.0625 6.9375 28.7188 7.0625 28.125 7.25L28.0625 7.21875C27.7812 6.46875 27.375 5.8125 26.8125 5.25C25.4062 3.84375 23.5625 3.1875 21.5625 3.21875C21.5312 3.21875 21.5 3.21875 21.4688 3.21875C21.3438 3.09375 21.2188 2.96875 21.0938 2.875C19.9062 1.875 18.4375 1.46875 16.875 1.71875C14.0312 2.15625 11.2188 4.53125 9.15625 8.5625C7.71875 11.375 6.65625 14.8125 6.5 17.25C3.03125 18.25 0.5625 19.0312 0.5 19.0625C-0.5625 19.375 -0.59375 19.4062 -0.71875 20.4062C-0.8125 21.1875 -1 40.9688 -1 40.9688L27.875 45.9688V8.6875C33.8438 8.90625 33.8438 8.90625 33.8438 8.90625Z" fill="currentColor"/>
  </svg>,
  // Slack
  <svg key="slack" width="122" height="48" viewBox="0 0 122 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5/6">
    <path d="M14.4062 30.0938C14.4062 32.7188 12.2812 34.8438 9.65625 34.8438C7.03125 34.8438 4.90625 32.7188 4.90625 30.0938C4.90625 27.4688 7.03125 25.3438 9.65625 25.3438H14.4062V30.0938Z" fill="currentColor"/>
    <path d="M16.7812 30.0938C16.7812 27.4688 18.9062 25.3438 21.5312 25.3438C24.1562 25.3438 26.2812 27.4688 26.2812 30.0938V38.4062C26.2812 41.0312 24.1562 43.1562 21.5312 43.1562C18.9062 43.1562 16.7812 41.0312 16.7812 38.4062V30.0938Z" fill="currentColor"/>
    <path d="M21.5312 14.4062C18.9062 14.4062 16.7812 12.2812 16.7812 9.65625C16.7812 7.03125 18.9062 4.90625 21.5312 4.90625C24.1562 4.90625 26.2812 7.03125 26.2812 9.65625V14.4062H21.5312Z" fill="currentColor"/>
  </svg>,
];

export const Logos: React.FC = () => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredButton, setHoveredButton] = useState<'prev' | 'next' | null>(null);

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
    if (isTransitioning) return;
    setIsTransitioning(true);
    const count = visibleRange.end - visibleRange.start;
    const start = Math.min(logos.length - count, visibleRange.start + count);
    setVisibleRange({ start, end: start + count });
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const count = visibleRange.end - visibleRange.start;
    const start = Math.max(0, visibleRange.start - count);
    setVisibleRange({ start, end: start + count });
    setTimeout(() => setIsTransitioning(false), 300);
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
        <div className="flex overflow-hidden justify-center">
          {logos.slice(visibleRange.start, visibleRange.end).map((logo, idx) => (
            <div
              key={visibleRange.start + idx}
              className="flex-shrink-0 w-40 mx-4 opacity-70 hover:opacity-100 transition-all duration-300"
              style={{
                animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`
              }}
            >
              {logo}
            </div>
          ))}
        </div>

        {visibleRange.start > 0 && (
          <button
            onClick={prev}
            onMouseEnter={() => setHoveredButton('prev')}
            onMouseLeave={() => setHoveredButton(null)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow text-gray-700 hover:bg-gray-100 transition-all duration-200"
            style={{
              transform: `translateY(-50%) scale(${hoveredButton === 'prev' ? 1.1 : 1})`,
            }}
          >
            <Icons.ChevronLeft />
          </button>
        )}

        {visibleRange.end < logos.length && (
          <button
            onClick={next}
            onMouseEnter={() => setHoveredButton('next')}
            onMouseLeave={() => setHoveredButton(null)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow text-gray-700 hover:bg-gray-100 transition-all duration-200"
            style={{
              transform: `translateY(-50%) scale(${hoveredButton === 'next' ? 1.1 : 1})`,
            }}
          >
            <Icons.ChevronRight />
          </button>
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentPage ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a página ${i + 1}`}
            />
          ))}
        </div>
      )}

      <style >{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Logos;