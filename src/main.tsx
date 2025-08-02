import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register as registerSW } from './utils/serviceWorker'

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for offline functionality
registerSW({
  onSuccess: () => {
    console.log('App is ready for offline use');
  },
  onUpdate: () => {
    console.log('New app update available');
    // You could show a toast notification here
  }
});
