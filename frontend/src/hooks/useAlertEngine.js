import { useMemo } from 'react';
import { getTrustScore } from '../services/AIClient';

export const useAlertEngine = (alerts) => {
  // Sort and process alerts based on trust and priority
  const processedAlerts = useMemo(() => {
    return alerts.map(alert => ({
      ...alert,
      systemPriority: calculateSystemPriority(alert),
      intelligenceScore: getTrustScore(alert)
    }));
  }, [alerts]);

  const criticalAlert = useMemo(() => {
    // Find the single most important alert for the Hero banner
    const highPriority = processedAlerts.filter(a => a.priority === 'High');
    return highPriority.length > 0 
      ? highPriority.reduce((prev, current) => (getTrustScore(current) > getTrustScore(prev)) ? current : prev)
      : null;
  }, [processedAlerts]);

  const isDisasterMode = !!criticalAlert;

  return {
    processedAlerts,
    criticalAlert,
    isDisasterMode
  };
};

function calculateSystemPriority(alert) {
  const trust = getTrustScore(alert);
  if (trust >= 85 && alert.priority === 'High') return 'URGENT';
  if (trust >= 70) return 'VERIFIED';
  if (trust < 40) return 'UNVERIFIED';
  return 'STANDARD';
}
