"use client";
import React from 'react';

// URL base para la API
const API_BASE = 'https://pszegostki-linberassistant.onrender.com';

// Placeholder para imágenes faltantes
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x500/e5e7eb/9ca3af?text=Sin+Imagen';

// Interfaz de propiedad
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
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  MessageCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  ),
  X: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

// Función para procesar URLs de imágenes
function processImageUrls(imagen_url: string | null): string[] {
  if (!imagen_url) return [PLACEHOLDER_IMAGE];
  
  if (imagen_url.includes('cloudinary.com')) {
    return imagen_url.split(',').map(url => url.trim()).filter(url => url.length > 0);
  }
  
  return [PLACEHOLDER_IMAGE];
}

// Modal de carrusel de imágenes
interface ImageCarouselProps {
  images: string[];
  onClose: () => void;
  initialIndex?: number;
}

function ImageCarouselModal({ images, onClose, initialIndex = 0 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'bg-opacity-70' : 'bg-opacity-0'}`}
      onClick={handleBackdropClick}
    >
      <button 
        className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 text-white transition-all z-10"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <Icons.X />
      </button>
      
      <div className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain transition-opacity duration-300"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={goToPrev}
              className="absolute left-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 text-white transition-all"
              aria-label="Imagen anterior"
            >
              <Icons.ChevronLeft />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 text-white transition-all"
              aria-label="Imagen siguiente"
            >
              <Icons.ChevronRight />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-white w-8' : 'bg-white bg-opacity-40'}`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Tarjeta de propiedad
interface PropertyCardProps {
  property: Property;
  isExpanded: boolean;
  onClick: (id: number) => void;
}

function PropertyCard({ property, isExpanded, onClick }: PropertyCardProps) {
  const PropertyIcon = property.tipo_juliano === 'casa' ? Icons.Home : Icons.Building;
  const imageUrls = processImageUrls(property.imagen_url);
  const mainImage = imageUrls[0];
  
  const [showImageCarousel, setShowImageCarousel] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [imageScale, setImageScale] = React.useState(false);

  const formattedDate = new Date(property.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  const propertyType = property.es_alquiler ? 'alquiler' : 'venta';
  const whatsappMessage = `Hola, estoy interesado/a en la propiedad: ${property.tipo_juliano} en ${property.location} (ID: ${property.id}) para ${propertyType}. ¿Podría darme más información?`;
  const whatsappUrl = `https://web.whatsapp.com/send?phone=5493758457171&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div
        onClick={() => onClick(property.id)}
        className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 w-full"
      >
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={mainImage}
            alt={property.location}
            className={`h-full w-full object-cover transition-transform duration-300 ${imageScale ? 'scale-110' : 'scale-100'}`}
            onMouseEnter={() => setImageScale(true)}
            onMouseLeave={() => setImageScale(false)}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium shadow">
            {property.es_alquiler ? 'Alquiler' : 'Venta'}
          </div>
          {imageUrls.length > 1 && (
            <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
              {imageUrls.length} fotos
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="mr-2 text-gray-600">
              <PropertyIcon />
            </div>
            <h3 className="text-lg font-semibold capitalize text-gray-800">
              {property.tipo_juliano}
            </h3>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <div className="mr-1">
              <Icons.MapPin />
            </div>
            <span className="truncate">{property.location}</span>
          </div>

          {isExpanded && (
            <div className="mt-3 text-gray-700 text-sm space-y-3 animate-fadeIn">
              <p>{property.descripcion}</p>
              
              {imageUrls.length > 1 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Imágenes ({imageUrls.length})</p>
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    {imageUrls.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Foto ${idx + 1}`}
                        className={`h-16 w-24 object-cover rounded cursor-pointer transition-all flex-shrink-0 hover:opacity-80 ${selectedImageIndex === idx ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setSelectedImageIndex(idx);
                          setShowImageCarousel(true);
                        }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {property.video_url && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Video disponible</p>
                  <a 
                    href={property.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    Ver video de la propiedad
                  </a>
                </div>
              )}
              
              <div className="flex items-center text-gray-500 text-xs mt-3">
                <div className="mr-1">
                  <Icons.Calendar />
                </div>
                Publicado: {formattedDate}
              </div>
              
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg mt-3 hover:bg-green-600 transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                }}
              >
                <Icons.MessageCircle />
                Consultar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
      
      {showImageCarousel && (
        <ImageCarouselModal 
          images={imageUrls} 
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageCarousel(false)} 
        />
      )}
    </>
  );
}

// Componente principal
export default function PropertyCarousel() {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [filterType, setFilterType] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = React.useState(4);
  
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const touchStartX = React.useRef<number>(0);

  // Calcular items por página según el ancho
  React.useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(1);
      else if (width < 1024) setItemsPerPage(2);
      else if (width < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Fetch propiedades
  React.useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/property`);
        if (!response.ok) throw new Error('Error al cargar propiedades');
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError('Error al cargar las propiedades. Inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Filtrar propiedades
  const filteredProperties = React.useMemo(() => {
    return properties.filter(p => {
      if (filterType === 'sale') return !p.es_alquiler;
      if (filterType === 'rental') return p.es_alquiler;
      return true;
    });
  }, [properties, filterType]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  // Navegación
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextPage();
      } else {
        goToPrevPage();
      }
    }
  };

  // Cambiar filtro
  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="w-full py-8 bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
          <p className="text-gray-600 mt-4">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="w-full py-8 bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No se encontraron propiedades disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-gray-100">
      <div className="text-center mb-6 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nuestras Propiedades Disponibles</h2>
        <p className="text-gray-600">Explore nuestra selección de propiedades exclusivas para venta y alquiler</p>
      </div>
    
      <div className="flex flex-wrap justify-between items-center px-6 mb-6 gap-3">
        <div className="flex gap-2">
          <button 
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filterType === 'all' 
                ? 'bg-gray-800 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          <button 
            onClick={() => handleFilterChange('sale')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filterType === 'sale' 
                ? 'bg-gray-800 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Venta
          </button>
          <button 
            onClick={() => handleFilterChange('rental')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filterType === 'rental' 
                ? 'bg-gray-800 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Alquiler
          </button>
        </div>
        <a 
          href="/properties" 
          className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow hover:shadow-md transition-all"
        >
          Ver todas las propiedades
        </a>
      </div>

      <div 
        ref={carouselRef}
        className="relative px-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-hidden">
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-500"
            style={{ 
              transform: `translateX(-${currentPage * 100}%)`,
              gridAutoFlow: 'column',
              gridTemplateColumns: `repeat(${filteredProperties.length}, minmax(0, 1fr))`
            }}
          >
            {visibleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isExpanded={expandedId === property.id}
                onClick={(id) => setExpandedId(expandedId === id ? null : id)}
              />
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <>
            <button 
              onClick={goToPrevPage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
              aria-label="Anterior"
            >
              <Icons.ChevronLeft />
            </button>
            <button 
              onClick={goToNextPage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
              aria-label="Siguiente"
            >
              <Icons.ChevronRight />
            </button>
          </>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentPage 
                  ? 'w-8 bg-gray-800' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a página ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <style >{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}