import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { toastOptions } from './utils/sonner.utils.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="bottom-center" theme='system' toastOptions={toastOptions}/>
    </BrowserRouter>
  </StrictMode>,
)