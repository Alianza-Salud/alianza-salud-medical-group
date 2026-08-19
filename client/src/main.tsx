import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// =========================================================================
// CAMBIO DE PALETA VISUAL DE MARCA:
// - './index.css'  -> Paleta 1: Verde Esmeralda Médico Puro
// - './index2.css' -> Paleta 2: Familia Corporativa (Sky Blue #0ea5e9 + Teal + Amber)
// - './index3.css' -> Paleta 3: Dorado Editorial / Premium (#C9932B + Navy + Marfil)
// - './index4.css' -> Paleta 4: Dorado Vibrante / Juvenil (#FFB700 + Coral + Turquesa)
// - './index5.css' -> Paleta 5: Dorado & Terracota Cálido (#D9A544 + #E08D6D + #5C9C93 + Crema #FBF8F3)
// =========================================================================
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
