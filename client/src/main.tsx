import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// =========================================================================
// CAMBIO DE PALETA VISUAL DE MARCA:
// - Para 'Familia Corporativa' (Sky Blue #0ea5e9 + Teal + Amber): usa './index2.css'
// - Para 'Verde Esmeralda Médico Puro': cambia la importación a './index.css'
// =========================================================================
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
