"use client";
import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Mail, Phone, MapPin, Briefcase, X } from 'lucide-react';

// Componente principal
export default function StaffDisplay() {
  const [activeStaff, setActiveStaff] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const staffRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Datos del equipo inmobiliario
  const staffMembers = [
    {
      id: 1,
      name: "Héctor Ricardo Pszegotski (H)",
      position: [
        "Productor Asesor Nacional de Seguros Matrícula Nº 50536",
        "Martillero Público – Matrícula Nº 306",
        "Corredor Público – Matrícula Nº 42",
        "Comisionista Ganadero – Matrícula Nº 9760"
      ],
      email: "ricardo@inmueblesrp.com.ar",
      phone: "+54 9 11 1234 5678",
      specialty: "Propiedades de lujo y terrenos comerciales",
      image: "/api/placeholder/400/400"
    },
    {
      id: 2,
      name: "Estela Inés Vanzini de Pszegotski",
      position: [
        "Administradora de Inmuebles",
        "Gestión de cobranzas de Locaciones"
      ],
      email: "estela@inmueblesrp.com.ar",
      phone: "+54 9 11 2345 6789",
      specialty: "Administración de alquileres",
      image: "/api/placeholder/400/400"
    },
    {
      id: 3,
      name: "Héctor Ricardo Pszegotski (P)",
      position: [
        "Gestor de Informes de deudas",
        "Ventas"
      ],
      email: "hector@inmueblesrp.com.ar",
      phone: "+54 9 11 3456 7890",
      specialty: "Asesoramiento financiero inmobiliario",
      image: "/api/placeholder/400/400"
    },
    {
      id: 4,
      name: "Patricia Atamañuk",
      position: [
        "Secretaria Ejecutiva",
        "Ventas y cobranzas de Seguros",
        "Ventas de espacios y publicaciones en diario \"El Territorio\""
      ],
      email: "patricia@inmueblesrp.com.ar",
      phone: "+54 9 11 4567 8901",
      specialty: "Mercadeo y publicidad",
      image: "/api/placeholder/400/400"
    },
    {
      id: 5,
      name: "Pszegotski, Hector Ricardo (N)",
      position: [
        "Martillero Público y Corredor de Comercio"
      ],
      email: "ricardopsz96@gmail.com",
      phone: "+54 9 11 5678 9012",
      specialty: "Tasaciones y subastas",
      image: "/api/placeholder/400/400"
    },
    {
      id: 6,
      name: "Pszegotski, Ignacio Josias",
      position: [
        "Productor Asesor de Seguros"
      ],
      email: "ignacio@inmueblesrp.com.ar",
      phone: "+54 9 11 6789 0123",
      specialty: "Seguros inmobiliarios",
      image: "/api/placeholder/400/400"
    }
  ];

  // Configuración de la intersección observer para animación al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Obtener el id del elemento que entró en la vista
            const id = parseInt(entry.target.getAttribute('data-id') || '0');
            setVisibleItems(prev => [...prev, id]);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    // Observar cada ref de staff
    staffRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    // Observar el scroll para mostrar/ocultar el botón de volver arriba
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      staffRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Función para volver al inicio de la página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Encabezado */}
      <div className="bg-gray-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Nuestro Equipo</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-300">
          Profesionales inmobiliarios con experiencia y dedicación para ayudarte a encontrar la propiedad de tus sueños
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffMembers.map((member, index) => (
            <div
              key={member.id}
              ref={el => { staffRefs.current[index] = el; }}
              data-id={member.id}
              className={`transform transition-all duration-700 ${
                visibleItems.includes(member.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-16 opacity-0'
              }`}
            >
              <StaffCard 
                member={member} 
                isActive={activeStaff === member.id}
                onClick={() => setActiveStaff(activeStaff === member.id ? null : member.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botón para volver arriba */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
          showScrollTop ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        } hover:opacity-100 hover:bg-gray-900`}
      >
        <ArrowUp size={20} />
      </button>

      {/* Modal detallado para el miembro seleccionado */}
      {activeStaff && (
      <StaffDetailModal 
        member={staffMembers.find(m => m.id === activeStaff)!} 
        onClose={() => setActiveStaff(null)} 
      />
    )}
  </div>
  );
}

// Componente de tarjeta individual
interface StaffCardProps {
  member: {
    id: number;
    name: string;
    position: string[];
    email: string;
    phone: string;
    specialty: string;
    image: string;
  };
  isActive: boolean;
  onClick: () => void;
}

function StaffCard({ member, isActive, onClick }: StaffCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
        isActive ? 'ring-2 ring-gray-800 scale-105' : 'hover:shadow-xl hover:-translate-y-2'
      }`}
      onClick={onClick}
    >
      {/* Imagen con overlay */}
      <div className="relative h-72 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 transition-opacity ${
          isActive ? 'opacity-80' : 'opacity-60'
        }`} />
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
        />
        
        {/* Nombre y cargo principal */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
          <h3 className="text-xl font-bold mb-1">{member.name}</h3>
          <p className="text-sm opacity-90">{member.position[0]}</p>
        </div>
      </div>

      {/* Información básica visible */}
      <div className="p-4">
        <div className="flex items-center text-gray-600 mt-2">
          <Mail size={16} className="mr-2 text-gray-400" />
          <a href={`mailto:${member.email}`} className="text-gray-700 hover:text-gray-900 text-sm truncate">
            {member.email}
          </a>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {isActive ? 'Haz clic para cerrar' : 'Haz clic para más detalles'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Modal con detalles completos
interface StaffDetailModalProps {
  member: {
    id: number;
    name: string;
    position: string[];
    email: string;
    phone: string;
    specialty: string;
    image: string;
  };
  onClose: () => void;
}

function StaffDetailModal({ member, onClose }: StaffDetailModalProps) {
  // Prevenimos que el scroll de fondo siga funcionando
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          {/* Imagen de portada */}
          <div className="h-48 sm:h-64 bg-gray-200 relative">
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
          {/* Botón de cerrar */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30"
          >
            <X size={20} />
          </button>
          
          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <div className="rounded-full h-32 w-32 border-4 border-white overflow-hidden bg-gray-100">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="pt-20 px-8 pb-8">
          <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
          
          <div className="mt-6 space-y-6">
            {/* Posiciones */}
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3">Cargos y Certificaciones</h3>
              <ul className="space-y-2">
                {member.position.map((pos, idx) => (
                  <li key={idx} className="flex items-start">
                    <Briefcase size={16} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{pos}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contacto */}
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3">Información de Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail size={16} className="mr-3 text-gray-400" />
                  <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                    {member.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-3 text-gray-400" />
                  <a href={`tel:${member.phone}`} className="text-gray-700 hover:text-gray-900">
                    {member.phone}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Especialidad */}
            <div>
              <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3">Especialidad</h3>
              <div className="flex items-start">
                <MapPin size={16} className="mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{member.specialty}</p>
              </div>
            </div>
            
            {/* Botón de contacto */}
            <div className="pt-4">
              <a 
                href={`mailto:${member.email}`}
                className="block w-full bg-gray-900 text-white py-3 rounded-lg text-center font-medium hover:bg-gray-800 transition-colors"
              >
                Contactar directamente
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}