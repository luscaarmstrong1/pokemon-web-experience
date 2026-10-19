import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { PokedexPage } from './pages/Pokedex/PokedexPage';
import { ArenaPage } from './pages/Arena/ArenaPage';
import { TypesPage } from './pages/Types/TypesPage';
import { QuizPage } from './pages/Quiz/QuizPage';
import { SafariPage } from './pages/Safari/SafariPage';
import { OfflinePage } from './pages/Offline/OfflinePage';
import './styles/global.css';
import './styles/animations.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<PokedexPage />} />
          <Route path="/arena" element={<ArenaPage />} />
          <Route path="/tipos" element={<TypesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/safari" element={<SafariPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

export default App;
