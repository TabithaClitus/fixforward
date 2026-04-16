/**
 * SCCIN Multi-layer Simulated Mesh Propagation Engine (v2.0)
 * Uses BroadcastChannel + LocalStorage for robust cross-context alert sharing.
 */

const MESH_CHANNEL = 'SCCIN_MESH_NETWORK';
const channel = new BroadcastChannel(MESH_CHANNEL);
const STORAGE_KEY = 'SCCIN_MESH_STORAGE';

// Propagation tracking
let localSpreadCount = 0;
const startTimestamp = Date.now();

export const broadcastToMesh = (type, data) => {
  const payload = {
    type,
    data,
    origin: 'Node_' + Math.floor(Math.random() * 1000),
    timestamp: Date.now(),
    spreadCount: (data.spreadCount || 0) + 1,
    timeToSpread: Date.now() - (data.initialTimestamp || Date.now())
  };

  if (!data.initialTimestamp) {
    payload.data.initialTimestamp = Date.now();
  }

  console.log(`[Mesh v2] Propagating ${type} (Spread: ${payload.spreadCount})`);
  
  // Layer 1: BroadcastChannel (Standard/Fast)
  channel.postMessage(payload);

  // Layer 2: LocalStorage (Persistence fallback)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload, _t: Date.now() }));
};

export const subscribeToMesh = (callback) => {
  // Handler for Layer 1
  const channelHandler = (event) => {
    callback(event.data);
  };
  channel.addEventListener('message', channelHandler);

  // Handler for Layer 2 (Cross-tab fallback)
  const storageHandler = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      const payload = JSON.parse(event.newValue);
      callback(payload);
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    channel.removeEventListener('message', channelHandler);
    window.removeEventListener('storage', storageHandler);
  };
};

export const getMeshStats = () => {
  return {
    uptime: Date.now() - startTimestamp,
    activeNodes: 1 + Math.floor(Math.random() * 3), // Simulated nearby nodes
    reliabilityScore: 0.98
  };
};
