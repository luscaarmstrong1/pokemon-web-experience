import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PokedexPage } from './pages/Pokedex/PokedexPage';
import { ArenaPage } from './pages/Arena/ArenaPage';
import { TypesPage } from './pages/Types/TypesPage';
import { QuizPage } from './pages/Quiz/QuizPage';
import { SafariPage } from './pages/Safari/SafariPage';
import { OfflinePage } from './pages/Offline/OfflinePage';
import './styles/global.css';
import './styles/animations.css';

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Escalonamento responsivo 1:1 rigorosamente centralizado com proporção dourada
  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      if (!el) return;
      const palcos = el.querySelectorAll<HTMLElement>('.pk-palco');
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Mantém proporção perfeita de 1280x720 com margem estética de respiro
      const maxW = w * 0.96;
      const maxH = h * 0.96;
      const s = Math.min(maxW / 1280, maxH / 720);

      palcos.forEach((p) => {
        p.style.transform = `scale(${s})`;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id="app-root"
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Background imersivo dinâmico da aplicação */}
      <div className="app-viewport-bg" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PokedexPage />} />
          <Route path="/arena" element={<ArenaPage />} />
          <Route path="/tipos" element={<TypesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/safari" element={<SafariPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
