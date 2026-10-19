import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';

export const OfflinePage: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [tcgDownloaded, setTcgDownloaded] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [baixando, setBaixando] = useState<boolean>(false);
  const [storageEstimate, setStorageEstimate] = useState<{ usage: string; quota: string }>({
    usage: '—',
    quota: '—',
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Checar espaço de armazenamento via Storage API
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        const usageMB = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
        const quotaMB = ((est.quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageEstimate({ usage: `${usageMB} MB`, quota: `${quotaMB} MB` });
      });
    }

    // Checar se cartas TCG já estão em cache
    if ('caches' in window) {
      caches.match('/data/cartas_tcg.json').then((res) => {
        if (res) setTcgDownloaded(true);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const baixarPacoteTCG = async () => {
    if (!('caches' in window) || baixando) return;
    setBaixando(true);
    setDownloadProgress(10);

    try {
      const cache = await caches.open('pokemon-offline-data-v1');
      setDownloadProgress(35);
      const res = await fetch('/data/cartas_tcg.json');
      setDownloadProgress(75);
      await cache.put('/data/cartas_tcg.json', res);
      setDownloadProgress(100);
      setTcgDownloaded(true);
      setBaixando(false);
    } catch {
      setBaixando(false);
    }
  };

  const limparPacoteTCG = async () => {
    if (!('caches' in window)) return;
    const cache = await caches.open('pokemon-offline-data-v1');
    await cache.delete('/data/cartas_tcg.json');
    setTcgDownloaded(false);
    setDownloadProgress(0);
  };

  return (
    <div className="pk-palco">
      {/* Topo / Header unificado */}
      <AppHeader
        paginaAtual="offline"
        titulo="CENTRAL OFFLINE & PWA"
        subtitulo="GERENCIAMENTO DE CACHE E INSTALAÇÃO"
      />

      <div className="offline-content-container">
        <div className="vidro offline-card">
          {/* Status de Conexão */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#8A93A3', fontWeight: 800 }}>ESTADO DA REDE</span>
              <div style={{ fontSize: '18px', fontWeight: 900, color: isOnline ? '#22C55E' : '#EF4444', marginTop: '2px' }}>
                {isOnline ? '● Conectado à Internet' : '○ Modo Offline Ativo'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#8A93A3', fontWeight: 800 }}>ARMAZENAMENTO UTILIZADO</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {storageEstimate.usage} / {storageEstimate.quota}
              </div>
            </div>
          </div>

          {/* Pacotes de Recursos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ color: '#FFCB05', fontSize: '14px', letterSpacing: '.1em' }}>PACOTES DE DADOS OFFLINE</h4>

            {/* Pacote 1: Essencial */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,.04)', borderRadius: '10px' }}>
              <div>
                <b style={{ color: '#fff', fontSize: '13px' }}>Pacote Essencial (1.302 Pokémons, Arena, Tipos, Quiz, Safari)</b>
                <p style={{ color: '#8A93A3', fontSize: '11px', marginTop: '2px' }}>
                  Incluído no Service Worker. Funciona 100% offline em qualquer dispositivo.
                </p>
              </div>
              <span style={{ color: '#22C55E', fontWeight: 900, fontSize: '12px' }}>✓ Instalado</span>
            </div>

            {/* Pacote 2: Galeria TCG Expandida */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,.04)', borderRadius: '10px' }}>
              <div>
                <b style={{ color: '#fff', fontSize: '13px' }}>Galeria TCG Completa (17.539 Cartas Pokémon TCG)</b>
                <p style={{ color: '#8A93A3', fontSize: '11px', marginTop: '2px' }}>
                  Download sob demanda para economizar tráfego de dados e espaço no aparelho (~6 MB).
                </p>
              </div>
              <div>
                {tcgDownloaded ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#22C55E', fontWeight: 900, fontSize: '12px' }}>✓ Em Cache</span>
                    <button
                      type="button"
                      className="bt bt-sec"
                      style={{ height: '28px', padding: '0 10px', fontSize: '10px' }}
                      onClick={limparPacoteTCG}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={baixando}
                    className="bt bt-gold"
                    style={{ height: '32px', fontSize: '11px' }}
                    onClick={baixarPacoteTCG}
                  >
                    {baixando ? `Baixando (${downloadProgress}%)` : 'Baixar Cartas'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dicas de Instalação PWA */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '14px' }}>
            <h4 style={{ color: '#FFCB05', fontSize: '14px', letterSpacing: '.1em', marginBottom: '8px' }}>
              COMO INSTALAR NO CELULAR OU PC (PWA)
            </h4>
            <ul style={{ color: '#C9CFDA', fontSize: '12px', lineHeight: 1.6, paddingLeft: '20px' }}>
              <li><b>No Computador (Chrome/Edge):</b> Clique no ícone de computador/instalação na barra de endereço ou em "Menu › Instalar Pokédex Web Experience".</li>
              <li><b>No Celular (Android/Chrome):</b> Toque nos três pontinhos e selecione "Adicionar à tela inicial" ou "Instalar aplicativo".</li>
              <li><b>No iPhone/iPad (iOS/Safari):</b> Toque no botão Compartilhar e selecione "Adicionar à Tela de Início".</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .offline-content-container {
          position: relative;
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 16px 20px 24px;
          overflow-y: auto;
          box-sizing: border-box;
          z-index: 10;
        }
        .offline-card {
          width: 100%;
          max-width: 800px;
          height: fit-content;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};
