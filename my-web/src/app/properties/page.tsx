"use client";

import { useState, useEffect } from 'react';

// Iconos SVG personalizados
const Icons = {
  ChevronLeft: ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Home: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  Building: ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  ),
  MapPin: ({ size = 14, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Calendar: ({ size = 12, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  MessageCircle: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  ),
  X: ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
};

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
// PropertyModal - Modal expandido con toda la información
// -----------------------
function PropertyModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const images = getImageUrl(property.imagen_url);
  const Icon = property.tipo_juliano === 'casa' ? Icons.Home : Icons.Building;
  const dateStr = new Date(property.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const next = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setCurrentIndex(i => (i + 1) % images.length); 
  };
  
  const prev = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setCurrentIndex(i => (i - 1 + images.length) % images.length); 
  };

  const whatsappUrl = `https://web.whatsapp.com/send?phone=5493758457171&text=${encodeURIComponent(
    `Hola, estoy interesado en la ${property.tipo_juliano} en ${property.location} para ${property.es_alquiler ? 'alquiler' : 'venta'}.`
  )}`;

  // Extraer URL de Instagram de la descripción
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = property.descripcion.match(urlRegex);
  const instagramUrl = urls && urls.length > 0 ? urls[0] : null;

  return (
    <div
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'bg-opacity-70' : 'bg-opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-900 rounded-full p-2 text-white transition-colors z-10"
        >
          <Icons.X size={24} />
        </button>

        {/* Carrusel de imágenes */}
        <div className="relative h-96 bg-gray-100">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Foto ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dv05qzzcm/image/upload/v1753105420/propiedades/placeholder.jpg';
            }}
          />
          
          <span className="absolute top-4 left-4 bg-white bg-opacity-95 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            {property.es_alquiler ? 'Alquiler' : 'Venta'}
          </span>

          {images.length > 1 && (
            <>
              <button 
                onClick={prev} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 text-gray-800 transition-all shadow-lg"
              >
                <Icons.ChevronLeft size={24} />
              </button>
              <button 
                onClick={next} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 text-gray-800 transition-all shadow-lg"
              >
                <Icons.ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50 w-2'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8">
          {/* Título y ubicación */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="mr-3 text-gray-700">
                <Icon size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold capitalize text-gray-800">
                {property.tipo_juliano.replace('_', ' ')}
              </h2>
            </div>
            <div className="flex items-center text-gray-600 text-base">
              <div className="mr-2">
                <Icons.MapPin size={18} />
              </div>
              <span>{property.location}</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{property.descripcion}</p>
          </div>

          {/* Fecha de publicación */}
          <div className="flex items-center text-gray-500 text-sm mb-6 pb-6 border-b">
            <Icons.Calendar size={14} className="mr-2" />
            <span>Publicado el {dateStr}</span>
          </div>

          {/* Botones de acción */}
          <div className={`grid grid-cols-1 ${instagramUrl ? 'md:grid-cols-2' : ''} gap-4`}>
            <a
              href={whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              <Icons.MessageCircle size={20} />
              <span>Consultar por WhatsApp</span>
            </a>
            
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl transition-all font-semibold shadow-md hover:shadow-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Ver recorrido de la casa</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
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
  onOpenModal,
}: {
  property: Property;
  onOpenModal: (property: Property) => void;
}) {
  const Icon = property.tipo_juliano === 'casa' ? Icons.Home : Icons.Building;
  const images = getImageUrl(property.imagen_url);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onOpenModal(property)}
      className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
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
        <span className="absolute top-2 right-2 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium">
          {property.es_alquiler ? 'Alquiler' : 'Venta'}
        </span>
        {images.length > 1 && (
          <span className="absolute top-2 left-2 bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-medium">
            📷 {images.length} fotos
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="mr-2 text-gray-600">
            <Icon size={20} />
          </div>
          <h3 className="text-lg font-semibold capitalize text-gray-800">
            {property.tipo_juliano.replace('_', ' ')}
          </h3>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <div className="mr-1">
            <Icons.MapPin size={14} />
          </div>
          <span className="truncate">{property.location}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{property.descripcion}</p>
        
        <div className="mt-3 text-sm text-gray-500 font-medium">
          Click para ver más detalles →
        </div>
      </div>
    </div>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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
      <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
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
            onOpenModal={setSelectedProperty}
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

      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
}
