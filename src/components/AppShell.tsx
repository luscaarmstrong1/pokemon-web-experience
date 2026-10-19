import React from 'react';
import { AppSidebar } from './AppSidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell-root">
      {/* Background dinâmico global full-viewport */}
      <div className="app-viewport-bg" />

      {/* Sidebar persistente unificada */}
      <AppSidebar />

      {/* Região principal fluida */}
      <main className="app-shell-main" id="main-content">
        {children}
      </main>

      <style>{`
        .app-shell-root {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          position: relative;
          background: #07090E;
        }

        .app-shell-main {
          flex: 1;
          height: 100vh;
          margin-left: 82px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .app-shell-root {
            flex-direction: column-reverse;
          }
          .app-shell-main {
            margin-left: 0;
            margin-bottom: 64px;
            height: calc(100vh - 64px);
          }
        }
      `}</style>
    </div>
  );
};
