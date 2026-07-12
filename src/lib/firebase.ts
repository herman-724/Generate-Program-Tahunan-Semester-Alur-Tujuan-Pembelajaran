import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Read from the auto-generated config
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  app, 
  auth, 
  signOut, 
  onAuthStateChanged
};
export type { User };
