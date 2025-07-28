"use client";

import { useState, useEffect,  } from 'react';
import { ChevronLeft, ChevronRight, Home, Building, MapPin, Calendar, MessageCircle, X, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/magicui/menu";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import  Footer  from "@/components/magicui/footer";
import WhatsappFloatingButton from '@/components/magicui/whatsapp';

// URL base para el API
const API_BASE = 'https://pszegostki-linberassistant.onrender.com';

// Configuración de Cloudinary
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dv05qzzcm';
const PLACEHOLDER_IMAGE = `${CLOUDINARY_BASE}/image/upload/v1753105420/propiedades/placeholder.jpg`;

// Función para procesar URLs de imágenes desde Cloudinary
function getImageUrls(imageUrl: string | null): string[] {
  if (!imageUrl) {
    return [PLACEHOLDER_IMAGE];
  }

  // Si ya contiene cloudinary, procesamos las URLs
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.split(',').map(url => url.trim()).filter(url => url.length > 0);
  }

  // Si es una URL relativa o de otro servidor, usamos placeholder
  return [PLACEHOLDER_IMAGE];
}

// Función para procesar URL de video desde Cloudinary
function getVideoUrl(videoUrl: string | null): string | null {
  if (!videoUrl) return null;
  
  // Si ya es una URL completa de Cloudinary, la retornamos
  if (videoUrl.includes('cloudinary.com')) {
    return videoUrl;
  }
  
  // Si es una URL relativa, construimos la URL de Cloudinary
  // Asumiendo que los videos están en la carpeta 'propiedades/videos'
  if (videoUrl.startsWith('/') || !videoUrl.includes('http')) {
    const videoName = videoUrl.split('/').pop()?.split('.')[0] || 'video';
    return `${CLOUDINARY_BASE}/video/upload/v1753105420/propiedades/videos/${videoName}.mp4`;
  }
  
  return videoUrl;
}

// Función para optimizar imágenes de Cloudinary con transformaciones
function getOptimizedImageUrl(imageUrl: string, transformation = 'w_800,h_600,c_fill,q_auto,f_auto'): string {
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // Insertar transformaciones en la URL de Cloudinary
  return imageUrl.replace('/upload/', `/upload/${transformation}/`);
}

// Función para generar thumbnail de video
function getVideoThumbnail(videoUrl: string): string {
  if (!videoUrl.includes('cloudinary.com')) {
    return PLACEHOLDER_IMAGE;
  }
  
  // Convertir URL de video a thumbnail
  return videoUrl.replace('/video/upload/', '/image/upload/').replace(/\.(mp4|avi|mov|wmv)$/, '.jpg');
}

// -----------------------
// PropertyImageCarousel component
// -----------------------
function PropertyImageCarousel({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const next = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setCurrentIndex(i => (i + 1) % images.length); 
    setLoading(true);
  };
  
  const prev = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setCurrentIndex(i => (i - 1 + images.length) % images.length); 
    setLoading(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        className="fixed top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors z-10"
      >
        <X size={24} />
      </button>
      
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent"></div>
          </div>
        )}
        
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={getOptimizedImageUrl(images[currentIndex], 'w_1200,h_800,c_fit,q_auto,f_auto')}
            alt={`Imagen ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              setLoading(false);
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prev} 
              className="absolute left-4 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next} 
              className="absolute right-4 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setCurrentIndex(i); 
                    setLoading(true);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
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
  const images = getImageUrls(property.imagen_url);
  const videoUrl = getVideoUrl(property.video_url);
  const dateStr = new Date(property.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const [showCarousel, setShowCarousel] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const whatsappUrl = `https://web.whatsapp.com/send?phone=5493758457171&text=${encodeURIComponent(
    `Hola, estoy interesado en la ${property.tipo_juliano} en ${property.location} para ${property.es_alquiler ? 'alquiler' : 'venta'}.`
  )}`;

  return (
    <>
      <motion.div
        layout
        onClick={() => onClick(property.id)}
        className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={getOptimizedImageUrl(images[0], 'w_400,h_300,c_fill,q_auto,f_auto')} 
            alt={property.location} 
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              if (!imageError) {
                setImageError(true);
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }
            }}
          />
          
          {/* Badge de tipo de operación */}
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${
            property.es_alquiler 
              ? 'bg-blue-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {property.es_alquiler ? 'Alquiler' : 'Venta'}
          </span>
          
          {/* Badge de video */}
          {videoUrl && (
            <span className="absolute top-3 left-3 bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Video size={12} />
              Video
            </span>
          )}
          
          {/* Contador de imágenes */}
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
              {images.length} fotos
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center mb-2">
            <Icon className="mr-2 text-gray-600" size={20} />
            <h3 className="text-lg font-semibold capitalize text-gray-800">
              {property.tipo_juliano.replace('_', ' ')}
            </h3>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="mr-1 flex-shrink-0" size={14} />
            <span className="truncate">{property.location}</span>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Descripción */}
                <p className="text-gray-700 text-sm mb-4 whitespace-pre-wrap leading-relaxed">
                  {property.descripcion}
                </p>
                
                {/* Galería de imágenes */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Imágenes</h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((src, i) => (
                      <div key={i} className="relative flex-shrink-0">
                        <img
                          src={getOptimizedImageUrl(src, 'w_120,h_80,c_fill,q_auto,f_auto')}
                          alt={`Foto ${i + 1}`}
                          className="h-16 w-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setShowCarousel(true); 
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video si existe */}
                {videoUrl && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Video</h4>
                    <video 
                      controls 
                      className="w-full h-40 object-cover rounded-lg"
                      poster={getVideoThumbnail(videoUrl)}
                      onError={() => setVideoError(true)}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Tu navegador no soporta video HTML5.
                    </video>
                    {videoError && (
                      <p className="text-red-500 text-xs mt-1">Error al cargar el video</p>
                    )}
                  </div>
                )}

                {/* Fecha de publicación */}
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  <Calendar className="mr-1" size={12} /> 
                  Publicado: {dateStr}
                </div>
                
                {/* Botón de WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors font-medium"
                  onClick={e => e.stopPropagation()}
                >
                  <MessageCircle size={16} /> 
                  Consultar por WhatsApp
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCarousel && (
          <PropertyImageCarousel 
            images={images} 
            onClose={() => setShowCarousel(false)} 
          />
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
        // Ordenar por fecha de creación, más recientes primero
        const sortedData = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPropsList(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching properties:', err);
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
      p.descripcion.toLowerCase().includes(term) ||
      p.tipo_juliano.toLowerCase().includes(term)
    )) return false;
    return true;
  });

  if (loading) {
    return (
      <>
        <SmoothCursor />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando propiedades...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <X className="text-red-500" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-8 lg:px-16 pt-32">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Nuestras Propiedades</h1>
          <p className="text-gray-600 text-lg">Encuentra la casa o departamento ideal para ti</p>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por ubicación, descripción o tipo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full lg:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex gap-2 justify-center lg:justify-end">
              {(['all','sale','rental'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    mode === m 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {m === 'all' ? 'Todas' : m === 'sale' ? 'Venta' : 'Alquiler'}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros por tipo */}
          {allTypes.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Filtrar por tipo:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allTypes.map(t => (
                  <label key={t} className="inline-flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={typeFilters.includes(t)}
                      onChange={() => {
                        setTypeFilters(arr =>
                          arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t]
                        );
                      }}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="capitalize text-sm text-gray-700">{t.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="max-w-6xl mx-auto mb-6">
          <p className="text-gray-600">
            {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="max-w-6xl mx-auto">
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
        </div>

        {/* Estado vacío */}
        {filtered.length === 0 && (
          <div className="text-center mt-12 max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Home className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron propiedades</h3>
            <p className="text-gray-500 mb-6">No hay propiedades que coincidan con los filtros seleccionados.</p>
            <button 
              onClick={() => {
                setSearch('');
                setMode('all');
                setTypeFilters([]);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
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
