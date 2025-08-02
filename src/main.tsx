import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register as registerSW } from './utils/serviceWorker'

// Initialize security systems
import { securityMonitor } from './utils/security-monitoring'
import { securityHeaders } from './utils/security-headers'
import { performanceMonitor } from './utils/performance-monitoring'

// Make security systems globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).securityMonitor = securityMonitor;
  (window as any).securityHeaders = securityHeaders;
  (window as any).performanceMonitor = performanceMonitor;
}

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for offline functionality
registerSW({
  onSuccess: () => {
    console.log('App is ready for offline use');
    performanceMonitor.markFeatureUsage('service_worker_registered');
  },
  onUpdate: () => {
    console.log('New app update available');
    performanceMonitor.markFeatureUsage('app_update_available');
    // You could show a toast notification here
  }
});
