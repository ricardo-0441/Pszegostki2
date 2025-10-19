'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreloaderAnimation() {
  const [text, setText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = 'desarrollado por Ignacio Libutti';

  // Simula la escritura
  useEffect(() => {
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 100 + Math.random() * 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setIsComplete(true), 1200);
      return () => clearTimeout(timeout);
    }
  }, [text]);

  // Cursor parpadeando
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  // Fade out suave
  useEffect(() => {
    if (isComplete) {
      const fadeInterval = setInterval(() => {
        setOpacity(prev => (prev <= 0.05 ? 0 : prev - 0.05));
      }, 60);
      return () => clearInterval(fadeInterval);
    }
  }, [isComplete]);

  return (
    <AnimatePresence>
      {opacity > 0 && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            zIndex: 999
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center px-4">
            <div className="relative text-gray-900 font-semibold text-3xl md:text-5xl tracking-wide">
              {text.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  style={{ display: 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <span
                className={`inline-block w-1 h-6 bg-gray-900 ml-1 align-bottom ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transition: 'opacity 0.1s' }}
              />
            </div>
            {isComplete && opacity > 0.5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                style={{
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}
              >
                Cargando sitio...
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}