"use client";
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Home, Building, MapPin, Calendar, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

// URL base para imágenes
const IMAGE_BASE = 'https://pszegostki-linberassistant.onrender.com';

// Componente de tarjeta de propiedad
interface Property {
  id: number;
  tipo_juliano: string;
  imagen_url: string;
  created_at: string;
  es_alquiler: boolean;
  location: string;
  descripcion: string;
}

// Componente carrusel de imágenes para una propiedad
function PropertyImageCarousel({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Control de navegación de imágenes
  const nextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % images.length);
  };
  
  const prevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <button 
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      
      <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${currentIndex === idx ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function PropertyCard({
  property,
  isExpanded,
  onClick,
}: {
  property: Property;
  isExpanded: boolean;
  onClick: (id: number) => void;
}) {
  const PropertyIcon = property.tipo_juliano === 'casa' ? Home : Building;
  const imageUrls = property.imagen_url 
    ? property.imagen_url.split(',').map(url => `${IMAGE_BASE}${url.trim()}`)
    : [`${IMAGE_BASE}/api/placeholder/800/500`];
  
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : `${IMAGE_BASE}/api/placeholder/800/500`;
  
  const formattedDate = new Date(property.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Estado para controlar la visualización del carrusel de imágenes
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  // Estado para la imagen seleccionada (para el carrusel de miniaturas)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Preparar mensaje para WhatsApp
  const propertyType = property.es_alquiler ? 'alquiler' : 'venta';
  const whatsappMessage = `Hola, estoy interesado/a en la propiedad: ${property.tipo_juliano} en ${property.location} (ID: ${property.id}) para ${propertyType}. ¿Podría darme más información?`;
  const whatsappUrl = `https://web.whatsapp.com/send?phone=5493758457171&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <motion.div
        layout
        onClick={() => onClick(property.id)}
        className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0 w-full mx-2 relative">

        <motion.div className="relative h-56 w-full">
          <motion.img
            src={mainImage}
            alt={property.location}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-medium shadow">
            {property.es_alquiler ? 'Alquiler' : 'Venta'}
          </div>
        </motion.div>

        <motion.div className="p-4">
          <div className="flex items-center mb-2">
            <PropertyIcon size={20} className="mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold capitalize text-gray-800">
              {property.tipo_juliano}
            </h3>
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="truncate">{property.location}</span>
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-3 text-gray-700 text-sm space-y-3"
            >
              <p>{property.descripcion}</p>
              
              {/* Carrusel de miniaturas */}
              {imageUrls.length > 1 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Imágenes ({imageUrls.length})</p>
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    {imageUrls.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Foto ${idx + 1}`}
                        className={`h-16 w-24 object-cover rounded cursor-pointer transition ${selectedImageIndex === idx ? 'border-2 border-blue-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(idx);
                          setShowImageCarousel(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center text-gray-500 text-xs mt-3">
                <Calendar size={14} className="mr-1" />
                Publicado: {formattedDate}
              </div>
              
              {/* Botón de contacto por WhatsApp */}
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg mt-3 hover:bg-green-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Evita que se active el onClick del card
                }}
              >
                <MessageCircle size={18} />
                Consultar por WhatsApp
              </a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Carrusel modal de imágenes */}
      <AnimatePresence>
        {showImageCarousel && (
          <PropertyImageCarousel 
            images={imageUrls} 
            onClose={() => setShowImageCarousel(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Componente principal de carrusel
export default function PropertyCarousel() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [index, setIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Property[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  // Calculamos cuántos items mostrar basado en el ancho del contenedor
  const updateVisibleItems = useCallback(() => {
    if (!carouselRef.current) return;
    
    const containerWidth = carouselRef.current.clientWidth;
    const itemWidth = 320; // Ancho aproximado de una tarjeta + margen
    const perView = Math.max(1, Math.floor((containerWidth - 40) / itemWidth));
    
    const filtered = properties.filter(p => {
      if (filterType === 'sale') return !p.es_alquiler;
      if (filterType === 'rental') return p.es_alquiler;
      return true;
    });
    
    // Ajustar el índice si es necesario
    const maxIndex = Math.max(0, Math.ceil(filtered.length / perView) - 1);
    const safeIndex = Math.min(index, maxIndex);
    if (safeIndex !== index) setIndex(safeIndex);
    
    const start = safeIndex * perView;
    setVisibleItems(filtered.slice(start, start + perView));
  }, [properties, filterType, index]);

  // Funciones para deslizar
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!startX.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) prev();
      else next();
      startX.current = null;
    }
  }, []);

  // Observador de cambios de tamaño
  useEffect(() => {
    updateVisibleItems();
    
    const observer = new ResizeObserver(() => {
      updateVisibleItems();
    });
    
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    
    return () => observer.disconnect();
  }, [updateVisibleItems]);

  // Fetch propiedades
  useEffect(() => {
    async function fetchProps() {
      try {
        const res = await fetch(`${IMAGE_BASE}/property`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setProperties(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchProps();
  }, []);

  // Actualizamos visibleItems cuando cambia el filtro
  useEffect(() => {
    updateVisibleItems();
  }, [filterType, updateVisibleItems]);

  // Navegación
  const prev = () => {
    const filtered = properties.filter(p => {
      if (filterType === 'sale') return !p.es_alquiler;
      if (filterType === 'rental') return p.es_alquiler;
      return true;
    });
    
    const containerWidth = carouselRef.current?.clientWidth || 0;
    const itemWidth = 320;
    const perView = Math.max(1, Math.floor((containerWidth - 40) / itemWidth));
    const maxIndex = Math.max(0, Math.ceil(filtered.length / perView) - 1);
    
    setIndex(i => (i <= 0 ? maxIndex : i - 1));
  };
  
  const next = () => {
    const filtered = properties.filter(p => {
      if (filterType === 'sale') return !p.es_alquiler;
      if (filterType === 'rental') return p.es_alquiler;
      return true;
    });
    
    const containerWidth = carouselRef.current?.clientWidth || 0;
    const itemWidth = 320;
    const perView = Math.max(1, Math.floor((containerWidth - 40) / itemWidth));
    const maxIndex = Math.max(0, Math.ceil(filtered.length / perView) - 1);
    
    setIndex(i => (i >= maxIndex ? 0 : i + 1));
  };

  // Loader o estado vacío
  if (!properties.length) return <div className="text-center py-8">Cargando propiedades...</div>;

  return (
    <div className="w-full py-8 relative bg-gray-100">
      {/* Encabezado del catálogo de propiedades */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Nuestras Propiedades Disponibles</h2>
        <p className="text-gray-600 mt-2">Explore nuestra selección de propiedades exclusivas para venta y alquiler</p>
      </div>
    
      <div className="flex flex-wrap justify-between items-center px-6 mb-4 gap-2">
        <div className="space-x-2">
          <button 
            onClick={() => { setFilterType('all'); setIndex(0); }}
            className={`px-3 py-1 rounded-full ${filterType==='all'? 'bg-gray-800 text-white':'bg-white text-gray-600'} shadow-sm`}
          >
            Todas
          </button>
          <button 
            onClick={() => { setFilterType('sale'); setIndex(0); }}
            className={`px-3 py-1 rounded-full ${filterType==='sale'? 'bg-gray-800 text-white':'bg-white text-gray-600'} shadow-sm`}
          >
            Venta
          </button>
          <button 
            onClick={() => { setFilterType('rental'); setIndex(0); }}
            className={`px-3 py-1 rounded-full ${filterType==='rental'? 'bg-gray-800 text-white':'bg-white text-gray-600'} shadow-sm`}
          >
            Alquiler
          </button>
        </div>
        <a href="/properties" className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow hover:bg-gray-50 transition">Ver todas las propiedades</a>
      </div>

      <div
        ref={carouselRef}
        className="relative overflow-hidden px-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <AnimatePresence initial={false} custom={index}>
          <motion.div
            key={index}
            custom={index}
            initial={{ x: 300 * (index > 0 ? 1 : -1), opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300 * (index > 0 ? 1 : -1), opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {visibleItems.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                isExpanded={expandedId === p.id}
                onClick={(id: number) => setExpandedId(expandedId === id ? null : id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={prev} 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-50 z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next} 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-50 z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Indicadores de paginación */}
      <div className="flex justify-center mt-4 space-x-1">
        {Array.from({ length: Math.ceil(
          properties.filter(p => {
            if (filterType === 'sale') return !p.es_alquiler;
            if (filterType === 'rental') return p.es_alquiler;
            return true;
          }).length / Math.max(1, Math.floor((carouselRef.current?.clientWidth || 0 - 40) / 320))
        )}).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-gray-800' : 'bg-gray-300'}`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}