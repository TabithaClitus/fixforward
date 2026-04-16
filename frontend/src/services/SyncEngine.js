import { getUnsyncedReports, markReportSynced, db } from './OfflineStore';
import axios from 'axios';

class SyncEngine {
  constructor() {
    this.isSyncing = false;
    this.retryQueue = [];
    this.init();
  }

  init() {
    // Listen for connection restoration
    window.addEventListener('online', () => {
      console.log('[Sync] Connection restored. Starting auto-sync...');
      this.syncAll();
    });

    // Run a routine check every 30 seconds
    setInterval(() => this.syncAll(), 30000);
  }

  async syncAll() {
    if (this.isSyncing || !navigator.onLine) return;
    this.isSyncing = true;

    try {
      const unsynced = await getUnsyncedReports();
      if (unsynced.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`[Sync] Found ${unsynced.length} reports to upload.`);
      
      const user = JSON.parse(localStorage.getItem('sccin_user') || '{}');
      if (!user.id) throw new Error('No user context for sync');

      const response = await axios.post('http://localhost:8000/sync-reports', unsynced, {
        params: { user_id: user.id },
        timeout: 10000
      });

      if (response.data.status === 'success') {
        for (const report of unsynced) {
          await markReportSynced(report.id);
        }
        console.log('[Sync] Batch upload successful.');
      }
    } catch (error) {
      console.error('[Sync] Sync failed:', error.message);
    } finally {
      this.isSyncing = false;
    }
  }

  async queueAction(type, data) {
    // For general actions that need retry logic later
    this.retryQueue.push({ type, data, timestamp: Date.now() });
  }
}

export const syncEngine = new SyncEngine();
