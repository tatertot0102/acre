import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Tailwind debug probe — logs whether utilities are active
(function tailwindProbe(){
  try {
    const el = document.createElement('div');
    el.className = 'bg-green-500 p-4';
    el.style.display = 'none';
    document.body.appendChild(el);
    const bg = getComputedStyle(el).backgroundColor;
    console.log('[Tailwind probe] bg-green-500 computed as:', bg);
    document.body.removeChild(el);
  } catch (e) {
    console.warn('[Tailwind probe] could not run:', e);
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
