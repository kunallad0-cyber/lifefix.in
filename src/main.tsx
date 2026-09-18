import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LegalPage } from './components/LegalPage';
import { SiteFooter } from './components/SiteFooter';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const legalPath =
  path === '/privacy' || path === '/privacy-policy'
    ? 'privacy'
    : path === '/terms' || path === '/terms-of-service'
      ? 'terms'
      : path === '/contact'
        ? 'contact'
        : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {legalPath ? <LegalPage type={legalPath} /> : <><App /><SiteFooter /></>}
  </StrictMode>,
);
