/**
 * SCCIN Cognitive Disaster Intelligence Network (v4.0)
 * Upgraded with Dynamic Trust Evolution and Authority Layering.
 */

const OFFICIAL_KEYWORDS = [
  'government', 'authority', 'evacuate', 'warning', 'broadcast', 
  'meteorological', 'relief', 'camp', 'district', 'official',
  'mandatory', 'high-alert', 'emergency', 'ndrf', 'sdma'
];

const FAKE_PATTERNS = [
  'miracle', 'instantly', 'forever', 'everyone', 'everywhere',
  '100%', 'certified by nasa', 'secret cure', 'run to the hills',
  'network towers falling', 'magical', 'drink warm water'
];

export const analyzeContentWithEvolution = (alertOrText, reports = []) => {
  if (!alertOrText) return null;
  
  // Handle polymorphic input (Object or String)
  let alert = typeof alertOrText === 'string' 
    ? { message: alertOrText, title: '', verified: false } 
    : alertOrText;

  const content = alert.message.toLowerCase() + alert.title.toLowerCase();
  let baseScore = alert.verified ? 70 : 40;
  
  // 1. Initial Logic (Linguistic + Keywords)
  const officialHits = OFFICIAL_KEYWORDS.filter(word => content.includes(word));
  const fakeHits = FAKE_PATTERNS.filter(word => content.includes(word));
  
  let score = baseScore + (officialHits.length * 10) - (fakeHits.length * 25);

  // 2. Trust Evolution (Dynamic confirmation)
  // Each similar report boosts confidence by 5%
  const reportBoost = Math.min(25, (reports.length * 5));
  score += reportBoost;

  // 3. Authority Signature
  if (alert.isAuthorityVerified) score = 98; // Hard verified

  const confidence = Math.max(0, Math.min(100, score));

  let classification = "Suspicious";
  if (confidence >= 80) classification = "Verified";
  else if (confidence <= 35) classification = "Fake";

  return {
    classification,
    confidence: confidence / 100,
    evolution: {
      initial: baseScore,
      confirmations: reports.length,
      boost: reportBoost
    },
    breakdown: {
      source: alert.verified ? 90 : 40,
      pattern: 50 + (officialHits.length * 10) - (fakeHits.length * 20),
      consistency: 40 + reportBoost
    },
    reason: classification === 'Verified' ? "Corroborated by multiple data nodes." : "Inconsistent pattern matching.",
    isAuthorityVerified: alert.isAuthorityVerified || (confidence > 95),
    timestamp: Date.now()
  };
};

export const analyzeContentOffline = analyzeContentWithEvolution;

export const getTrustScore = (alert) => {
  const analysis = analyzeContentWithEvolution(alert);
  return Math.floor(analysis.confidence * 100);
};

export const getAuthoritySigil = (alert) => {
  if (alert.verified || alert.isAuthorityVerified) {
    return {
      label: "Official District Command",
      org: "Disaster Management Cell",
      status: "Verified Authority"
    };
  }
  return null;
};

export const suggestAlertFromReports = (reports) => {
  const recentReports = reports.slice(0, 5);
  const clusterCount = recentReports.filter(r => 
    r.content.toLowerCase().includes('water') || 
    r.content.toLowerCase().includes('flood') || 
    r.content.toLowerCase().includes('rising')
  ).length;

  if (clusterCount >= 2) {
    return {
      suggested: true,
      title: "Potential Flood Activity",
      message: "Multiple community reports indicate rising water levels in your vicinity.",
      priority: "Medium",
      confidence: 0.85
    };
  }
  return null;
};
