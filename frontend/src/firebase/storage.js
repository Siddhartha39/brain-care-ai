import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadFileToStorage = async (uid, folder, file) => {
  const storageRef = ref(storage, `users/${uid}/${folder}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
