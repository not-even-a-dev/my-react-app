import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { initDatabase } from './db/database';
import './styles/globals.css';

// Initialize database before rendering app
initDatabase()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch((error) => {
    console.error('Failed to initialize app:', error);
  });

