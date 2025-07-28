"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Building, MapPin, Calendar, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/magicui/menu";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import Footer from "@/components/magicui/footer";
import WhatsappFloatingButton from '@/components/magicui/whatsapp';

// URL base para el API
const API_BASE = 'https://pszegostki-linberassistant.onrender.com';

// Función para manejar las URLs de imágenes
function getImageUrl(imageUrl: string | null): string[] {
  if (!imageUrl) {
    return ['https://res.cloudinary.com/dv05qzzcm/image/upload/v1753105420/propiedades/placeholder.jpg'];
  }

  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.split(',').map(url => url.trim()).filter(url => url.length > 0);
  }

  return ['https://res.cloudinary.com/dv05qzzcm/image/upload/v1753105420/propiedades/placeholder.jpg'];
}

// Función para manejar las URLs de videos
function getVideoUrl(videoUrl: string | null): string[] {
  if (!videoUrl) {
    return [];
  }

  if (videoUrl.includes('cloudinary.com')) {
    return videoUrl.split(',').map(url => url.trim()).filter(url => url.length > 0);
  }

  return [];
}

// -----------------------
// PropertyImageCarousel component
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
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dv05qzzcm/image/upload/v1753105420/propiedades/placeholder.jpg';
            }}
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
  imagen_url: string | null;
  video_url: string | null;
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
  const images = getImageUrl(property.imagen_url);
  const videos = getVideoUrl(property.video_url);
  const dateStr = new Date(property.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const [showCarousel, setShowCarousel] = useState(false);
  const [imageError, setImageError] = useState(false);

  const whatsappUrl = `https://web.whatsapp.com/send?phone=5493758457171&text=${encodeURIComponent(
    `Hola, estoy interesado en la ${property.tipo_juliano} en ${property.location} para ${property.es_alquiler ? 'alquiler' : 'venta'}.`
  )}`;

  return (
    <>
      <motion.div
        layout
        onClick={() => onClick(property.id)}
        className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="relative h-48 w-full">
          <img 
            src={images[0]} 
            alt={property.location} 
            className="h-full w-full object-cover"
            onError={(e) => {
              if (!imageError) {
                setImageError(true);
                (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dv05qzzcm/image/upload/v1753105420/propiedades/placeholder.jpg';
              }
            }}
          />
          <span className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
            {property.es_alquiler ? 'Alquiler' : 'Venta'}
          </span>
          {videos.length > 0 && (
            <span className="absolute top-2 left-2 bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-medium">
              📹 Video{videos.length > 1 ? `s (${videos.length})` : ''}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center mb-1">
            <Icon className="mr-2 text-gray-600" size={20} />
            <h3 className="text-lg font-semibold capitalize text-gray-800">
              {property.tipo_juliano.replace('_', ' ')}
            </h3>
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="mr-1" size={14} />
            <span className="truncate">{property.location}</span>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{property.descripcion}</p>
                
                {/* Galería de imágenes */}
                {images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto mb-3 pb-2">
                    {images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Foto ${i + 1}`}
                        className="h-16 w-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                        onClick={(e) => { e.stopPropagation(); setShowCarousel(true); }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dv05qzzcm/image/upload/v1753105420/propiedades/placeholder.jpg';
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Videos si existen */}
                {videos.length > 0 && (
                  <div className="mb-3 space-y-3">
                    {videos.map((videoSrc, i) => (
                      <div key={i} className="relative">
                        <video 
                          controls 
                          className="w-full h-32 object-cover rounded"
                          poster={images[0]}
                        >
                          <source src={videoSrc} type="video/mp4" />
                          Tu navegador no soporta video HTML5.
                        </video>
                        {videos.length > 1 && (
                          <span className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                            Video {i + 1}/{videos.length}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center text-gray-500 text-xs mb-3">
                  <Calendar className="mr-1" size={12} /> 
                  Publicado: {dateStr}
                </div>
                
                <a
                  href={whatsappUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
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
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de propiedades
  useEffect(() => {
    fetch(`${API_BASE}/property`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar propiedades');
        return res.json();
      })
      .then((data: Property[]) => {
        setPropsList(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Calcular tipos dinámicos
  const allTypes = Array.from(new Set(propsList.map(p => p.tipo_juliano)));

  // Filtrado
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

  if (loading) {
    return (
      <>
        <SmoothCursor />
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SmoothCursor />
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SmoothCursor />
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8 lg:px-16 pt-32">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Nuestras Propiedades</h1>
        <p className="text-center text-gray-600 mb-6">Encuentra la casa o departamento ideal para ti</p>

        {/* Controles de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar por ubicación o descripción..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <div className="flex gap-2">
            {(['all','sale','rental'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-full shadow-sm transition-colors ${
                  mode === m ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {m === 'all' ? 'Todas' : m === 'sale' ? 'Venta' : 'Alquiler'}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros por tipo */}
        {allTypes.length > 0 && (
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3">Filtrar por tipo:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allTypes.map(t => (
                <label key={t} className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={typeFilters.includes(t)}
                    onChange={() => {
                      setTypeFilters(arr =>
                        arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t]
                      );
                    }}
                    className="rounded border-gray-300 text-gray-800 focus:ring-gray-500"
                  />
                  <span className="capitalize text-sm">{t.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Contador de resultados */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
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
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">No se encontraron propiedades que coincidan con los filtros.</p>
            <button 
              onClick={() => {
                setSearch('');
                setMode('all');
                setTypeFilters([]);
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
      
      <WhatsappFloatingButton />
      <Footer />
    </>
  );
}
