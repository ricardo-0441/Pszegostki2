"use client";

import React from 'react';
import Link from 'next/link';

// === ICONS ===
const IconFingerprint: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1C7.031 1 3 5.031 3 10v2a1 1 0 002 0v-2c0-4.411 3.589-8 8-8s8 3.589 8 8v2a1 1 0 002 0v-2c0-4.969-4.031-9-9-9zm0 4a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1zm0 14c-4.411 0-8-3.589-8-8a1 1 0 10-2 0c0 5.969 4.031 10 9 10s9-4.031 9-10a1 1 0 10-2 0c0 4.411-3.589 8-8 8z"/>
  </svg>
);

const IconFacebook: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.3h-1.2c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z"/>
  </svg>
);

const IconInstagram: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11.37A4 4 0 1112.63 8a4 4 0 013.37 3.37z"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const IconLinkedIn: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const IconEnvelope: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"/>
    <rect x="3" y="8" width="18" height="12"/>
  </svg>
);

const IconPhone: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l.4 2M7 10h10l.4-2h2M16 14H8l-.4 2H4m2 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
  </svg>
);

const IconLocation: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.1046 0 2-.8954 2-2s-.8954-2-2-2-2 .8954-2 2 .8954 2 2 2z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s8-7.5 8-13c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 5.5 8 13 8 13z"/>
  </svg>
);

// === FOOTER ===
const Footer: React.FC = () => {
  const siteName = "Ricardo Pszegotski - Inmuebles y Seguros";
  const subheading = "Empresa familiar con más de 25 años en Apóstoles";
  const quickLinks = [
    { text: "Inicio", url: "/" },
    { text: "Nosotros", url: "/about" },
    { text: "Servicios", url: "/services" },
    { text: "Contacto", url: "/contact" },
  ];
  const email = "info@inmueblesrp.com.ar";
  const telephone = "+54 03758-15457171";
  const address = "Av. 9 de Julio 1119, Apóstoles, Misiones, Argentina (N3350)";
  const socials = [
    { icon: <IconFacebook />, url: "https://facebook.com/inmueblesrp" },
    { icon: <IconInstagram />, url: "https://instagram.com/inmueblesrp" },
    { icon: <IconLinkedIn />, url: "https://linkedin.com/company/inmueblesrp" },
  ];

  return (
    <footer className="bg-white text-gray-600 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo + Subheading */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors">
            <IconFingerprint />
            <h3 className="text-xl font-semibold">{siteName}</h3>
          </Link>
          <p className="text-sm">{subheading}</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.text}>
                <Link
                  href={link.url}
                  className="hover:text-gray-800 transition-colors hover:underline"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Socials */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Contacto</h4>
          <Link href={`mailto:${email}`} className="flex items-center gap-2 text-sm hover:text-gray-800 transition-colors">
            <IconEnvelope />
            {email}
          </Link>
          <Link href={`tel:${telephone}`} className="flex items-center gap-2 text-sm hover:text-gray-800 transition-colors">
            <IconPhone />
            {telephone}
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconLocation />
            <span>{address}</span>
          </div>
          <div className="mt-4 flex space-x-4">
            {socials.map((s, i) => (
              <Link
                key={i}
                href={s.url}
                aria-label="Red social"
                className="transform transition-transform hover:scale-110"
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Divider + Credits */}
      <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {siteName}. Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
