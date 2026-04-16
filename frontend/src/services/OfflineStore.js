import Dexie from 'dexie';

export const db = new Dexie('SCCIN_OfflineDB');

db.version(1).stores({
  alerts: '++id, title, priority, timestamp',
  reports: '++id, content, location, timestamp, synced',
  settings: 'key, value'
});

export const saveAlert = async (alert) => {
  await db.alerts.put(alert);
};

export const getCachedAlerts = async () => {
  return await db.alerts.orderBy('timestamp').reverse().toArray();
};

export const queueReport = async (report) => {
  await db.reports.add({ ...report, timestamp: new Date(), synced: 0 });
};

export const getUnsyncedReports = async () => {
  return await db.reports.where('synced').equals(0).toArray();
};

export const markReportSynced = async (id) => {
  await db.reports.update(id, { synced: 1 });
};
