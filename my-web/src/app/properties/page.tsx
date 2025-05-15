"use client";

import { useState, useEffect,  } from 'react';
import { ChevronLeft, ChevronRight, Home, Building, MapPin, Calendar, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/magicui/menu";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import  Footer  from "@/components/magicui/footer";
import WhatsappFloatingButton from '@/components/magicui/whatsapp';


// URL base para imágenes
const IMAGE_BASE = 'https://pszegostki-linberassistant.onrender.com';

// -----------------------
// Reutilizamos tu PropertyImageCarousel y PropertyCard
// (idénticos a los que pasaste)
// -----------------------
function PropertyImageCarousel({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(i => (i + 1) % images.length); };
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(i => (i - 1 + images.length) % images.length); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white">
        <X size={24} />
      </button>
      <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Foto ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white">
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                  className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

interface Property {
  id: number;
  tipo_juliano: string;
  imagen_url: string;
  created_at: string;
  es_alquiler: boolean;
  location: string;
  descripcion: string;
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
  const Icon = property.tipo_juliano === 'casa' ? Home : Building;
  const images = property.imagen_url
    ? property.imagen_url.split(',').map(u => `${IMAGE_BASE}${u.trim()}`)
    : [`${IMAGE_BASE}/api/placeholder/800/500`];
  const dateStr = new Date(property.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const [showCarousel, setShowCarousel] = useState(false);

  const whatsappUrl = `https://web.whatsapp.com/send?phone=5493758457171&text=${encodeURIComponent(
    `Hola, estoy interesado en la ${property.tipo_juliano} en ${property.location}  para ${property.es_alquiler ? 'alquiler' : 'venta'}.`
  )}`;

  return (
    <>
      
      <motion.div

        layout
        onClick={() => onClick(property.id)}
        className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden"
      >
        <div className="relative h-48 w-full">
          <img src={images[0]} alt={property.location} className="h-full w-full object-cover" />
          <span className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
            {property.es_alquiler ? 'Alquiler' : 'Venta'}
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-1">
            <Icon className="mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold capitalize text-gray-800">
              {property.tipo_juliano}
            </h3>
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="mr-1" size={14} />
            <span className="truncate">{property.location}</span>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-gray-700 text-sm mb-3">{property.descripcion}</p>
                <div className="flex gap-2 overflow-x-auto mb-3">
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Foto ${i + 1}`}
                      className="h-16 w-24 object-cover rounded cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setShowCarousel(true); }}
                    />
                  ))}
                </div>
                <div className="flex items-center text-gray-500 text-xs mb-3">
                  <Calendar className="mr-1" size={12} /> Publicado: {dateStr}
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg"
                  onClick={e => e.stopPropagation()}
                >
                  <MessageCircle size={16} /> Consultar por WhatsApp
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCarousel && (
          <PropertyImageCarousel images={images} onClose={() => setShowCarousel(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// -----------------------
// Página principal de propiedades
// -----------------------
export default function PropertiesPage() {
  const [propsList, setPropsList] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'all' | 'sale' | 'rental'>('all');
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<number| null>(null);

  // fetch
  useEffect(() => {
    fetch(`${IMAGE_BASE}/property`)
      .then(res => res.json())
      .then((data: Property[]) => setPropsList(data));
  }, []);

  // calcular tipos dinámicos
  const allTypes = Array.from(new Set(propsList.map(p => p.tipo_juliano)));

  // filtrado
  const filtered = propsList.filter(p => {
    if (mode === 'sale' && p.es_alquiler) return false;
    if (mode === 'rental' && !p.es_alquiler) return false;
    if (typeFilters.length && !typeFilters.includes(p.tipo_juliano)) return false;
    const term = search.toLowerCase();
    if (term && !(
      p.location.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    )) return false;
    return true;
  });

  return (
    <>
          {/* Cursor animado */}
          <SmoothCursor />
      <Navbar />
<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8 lg:px-16 pt-32">        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Nuestras Propiedades</h1>
        <p className="text-center text-gray-600 mb-6">Encuentra la casa o departamento ideal para ti</p>

        {/* Controles */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none"
          />

          <div className="flex gap-2">
            {(['all','sale','rental'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-full shadow-sm ${
                  mode === m ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'
                }`}
              >
                {m === 'all' ? 'Todas' : m === 'sale' ? 'Venta' : 'Alquiler'}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes de tipo */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allTypes.map(t => (
            <label key={t} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={typeFilters.includes(t)}
                onChange={() => {
                  setTypeFilters(arr =>
                    arr.includes(t) ? arr.filter(x => x!==t) : [...arr, t]
                  );
                }}
              />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              isExpanded={expanded === p.id}
              onClick={id => setExpanded(expanded === id ? null : id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-12">No se encontraron propiedades.</p>
        )}
      </div>
      <WhatsappFloatingButton />

      <Footer />
    </>
  );
}