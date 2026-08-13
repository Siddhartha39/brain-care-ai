import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from './config';

export const registerWithEmail = async (name, email, password) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }
  return credential.user;
};

export const loginWithEmail = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};
