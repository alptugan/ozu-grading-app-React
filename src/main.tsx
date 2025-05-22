import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ExcelProvider } from './context/ExcelContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExcelProvider>
      <App />
    </ExcelProvider>
  </StrictMode>
);