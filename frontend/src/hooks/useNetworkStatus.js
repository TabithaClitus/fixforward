import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    isLocalHub: false, // Simulated: Can we reach the local edge server?
    mode: navigator.onLine ? 'CLOUD' : 'OFFLINE'
  });

  useEffect(() => {
    const handleOnline = () => setStatus(s => ({ ...s, isOnline: true, mode: 'CLOUD' }));
    const handleOffline = () => setStatus(s => ({ ...s, isOnline: false, mode: 'MESH' }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Heartbeat to check for Local Hub (simulated)
    const checkLocalHub = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/health`, { timeout: 1000 });
        if (res.ok) {
          setStatus(s => ({ ...s, isLocalHub: true, mode: status.isOnline ? 'CLOUD' : 'LOCAL_HUB' }));
        }
      } catch (e) {
        setStatus(s => ({ ...s, isLocalHub: false }));
      }
    };

    const interval = setInterval(checkLocalHub, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [status.isOnline]);

  return status;
};
