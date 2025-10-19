"use client";

import React, { useRef, useEffect, useState } from 'react';

// Iconos SVG personalizados
const Icons = {
  home: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  insurance: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

type Service = { 
  id: string; 
  title: string; 
  description: string; 
};

interface ServiceCardProps {
  service: Service;
  icon: React.ReactNode;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, icon, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`flex-shrink-0 w-72 sm:w-80 lg:w-64 xl:w-72 bg-white rounded-xl p-6 m-3 shadow hover:shadow-lg transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">{icon}</div>
        <span className="text-sm font-semibold text-gray-600">#{service.id}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
      <p className="text-gray-600 text-sm">{service.description}</p>
    </div>
  );
};

export default function Services() {
  const realEstateRef = useRef<HTMLDivElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [realEstateTransform, setRealEstateTransform] = useState(0);
  const [insuranceTransform, setInsuranceTransform] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Animación del header
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          setHeaderVisible(true);
        }
      }

      // Animación de sección inmobiliaria (izquierda a derecha)
      if (realEstateRef.current) {
        const rect = realEstateRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
        const transformValue = -50 + (progress * 50);
        setRealEstateTransform(transformValue);
      }

      // Animación de sección seguros (derecha a izquierda)
      if (insuranceRef.current) {
        const rect = insuranceRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
        const transformValue = 50 - (progress * 50);
        setInsuranceTransform(transformValue);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = {
    realEstate: [
      { id: '01', title: 'Asesoramiento Inmobiliario', description: 'Asesoramiento profesional personalizado para compra, venta y alquiler de propiedades.' },
      { id: '02', title: 'Negocios Inmobiliarios', description: 'Compra, venta y alquiler de inmuebles adaptados a tus necesidades.' },
      { id: '03', title: 'Tasaciones de Inmuebles', description: 'Valoraciones precisas para toda operación inmobiliaria.' },
      { id: '04', title: 'Consignaciones Ganaderas', description: 'Gestión y venta de ganado con asesoría especializada.' },
      { id: '05', title: 'Publicaciones en El Territorio', description: 'Difunde tus propiedades en el principal medio regional.' },
    ],
    insurance: [
      { id: '06', title: 'Seguros Generales', description: 'Cobertura integral para proteger tus bienes.' },
      { id: '07', title: 'Seguros para Personas', description: 'Protección adaptada a salud y vida.' },
      { id: '08', title: 'Seguros Ciclomotor', description: 'Cobertura obligatoria y adicional para motos.' },
      { id: '09', title: 'Seguros Embarcaciones', description: 'Protección para actividades náuticas.' },
      { id: '10', title: 'Hogar y Comercio', description: 'Cobertura para viviendas y locales comerciales.' },
      { id: '11', title: 'Seguros de Eventos', description: 'Protección para actividades y eventos.' },
      { id: '12', title: 'ART (Riesgos de Trabajo)', description: 'Cumple con normativas laborales.' },
      { id: '13', title: 'Seguros de Caución', description: 'Garantías para operaciones comerciales.' },
      { id: '14', title: 'Responsabilidad Civil', description: 'Protección ante reclamos profesionales.' },
    ],
  };

  return (
    <section id="servicios" className="py-20 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">NUESTROS SERVICIOS</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Asesoramiento inmobiliario y seguros personalizados con enfoque profesional y humano.
          </p>
        </div>

        {/* Inmobiliario */}
        <div
          ref={realEstateRef}
          className="mb-16 transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${realEstateTransform}%)` }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Servicios Inmobiliarios</h3>
          <div className="flex flex-wrap justify-center items-stretch">
            {services.realEstate.map((svc, index) => (
              <ServiceCard 
                key={svc.id} 
                service={svc} 
                icon={<Icons.home />} 
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Seguros */}
        <div
          ref={insuranceRef}
          className="mb-16 transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${insuranceTransform}%)` }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Servicios de Seguros</h3>
          <div className="flex flex-wrap justify-center items-stretch">
            {services.insurance.map((svc, index) => (
              <ServiceCard 
                key={svc.id} 
                service={svc} 
                icon={<Icons.insurance />} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}