import { get, ref, set, push, update, remove } from 'firebase/database';
import { database } from './config';

export const getUserData = async (uid, path = 'profile') => {
  const snapshot = await get(ref(database, `users/${uid}/${path}`));
  return snapshot.exists() ? snapshot.val() : null;
};

export const saveUserProfile = async (uid, profile) => {
  await set(ref(database, `users/${uid}/profile`), profile);
};

export const saveScanRecord = async (uid, scan) => {
  const scanRef = ref(database, `users/${uid}/scans`);
  const newScan = push(scanRef);
  await set(newScan, scan);
  return newScan.key;
};

export const updateScanRecord = async (uid, scanId, updates) => {
  await update(ref(database, `users/${uid}/scans/${scanId}`), updates);
};

export const removeScanRecord = async (uid, scanId) => {
  await remove(ref(database, `users/${uid}/scans/${scanId}`));
};
