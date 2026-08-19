import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// =========================================================================
// CAMBIO DE PALETA VISUAL DE MARCA:
// - './index.css'  -> Paleta 1: Verde Esmeralda Médico Puro
// - './index2.css' -> Paleta 2: Familia Corporativa (Sky Blue #0ea5e9 + Teal + Amber)
// - './index3.css' -> Paleta 3: Dorado Editorial / Premium (#C9932B + Navy + Marfil)
// =========================================================================
import './index3.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
