import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrandThemeProvider } from './context/BrandThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrandThemeProvider>
      <App />
    </BrandThemeProvider>
  </StrictMode>
);
