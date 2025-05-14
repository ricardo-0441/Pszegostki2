"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Íconos (reemplaza con tus SVG reales si los tienes)
const icons = {
  home: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  insurance: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

type Service = { id: string; title: string; description: string };

const ServiceCard: React.FC<{ service: Service; icon: React.ReactNode }> = ({ service, icon }) => (
  <motion.div
    className="flex-shrink-0 w-72 sm:w-80 lg:w-64 xl:w-72 bg-white rounded-xl p-6 m-3 shadow hover:shadow-lg transition-shadow duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-full bg-blue-100 text-blue-600">{icon}</div>
      <span className="text-sm font-semibold text-gray-600">#{service.id}</span>
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
    <p className="text-gray-600 text-sm">{service.description}</p>
  </motion.div>
);

export default function Services() {
  const realEstateRef = useRef<HTMLDivElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: realEstateProgress } = useScroll({
    target: realEstateRef,
    offset: ['start end', 'end start'],
  });
  const { scrollYProgress: insuranceProgress } = useScroll({
    target: insuranceRef,
    offset: ['start end', 'end start'],
  });

  const realEstateX = useTransform(realEstateProgress, [0, 1], ['-50%', '0%']);
  const insuranceX = useTransform(insuranceProgress, [0, 1], ['50%', '0%']);

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
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">NUESTROS SERVICIOS</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Asesoramiento inmobiliario y seguros personalizados con enfoque profesional y humano.
          </p>
        </motion.div>

        {/* Inmobiliario */}
        <motion.div
          ref={realEstateRef}
          style={{ x: realEstateX }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Servicios Inmobiliarios</h3>
          <div className="flex flex-wrap justify-center items-stretch">
            {services.realEstate.map((svc) => (
              <ServiceCard key={svc.id} service={svc} icon={icons.home} />
            ))}
          </div>
        </motion.div>

        {/* Seguros */}
        <motion.div
          ref={insuranceRef}
          style={{ x: insuranceX }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Servicios de Seguros</h3>
          <div className="flex flex-wrap justify-center items-stretch">
            {services.insurance.map((svc) => (
              <ServiceCard key={svc.id} service={svc} icon={icons.insurance} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
