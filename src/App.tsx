import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppSidebar } from './components/AppSidebar';
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

  // Escalonamento responsivo 1:1 rigorosamente centralizado ocupando a tela cheia
  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      if (!el) return;
      const palcos = el.querySelectorAll<HTMLElement>('.pk-palco');
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Ocupa a tela inteira mantendo proporção ideal sem barras pretas desnecessárias
      const s = Math.min(w / 1280, h / 720);

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
