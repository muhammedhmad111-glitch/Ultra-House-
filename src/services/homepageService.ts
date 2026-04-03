import { collection, getDocs, query, doc, setDoc, serverTimestamp, updateDoc, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

const COLLECTION_NAME = 'homepage_settings';
const DOCUMENT_ID = 'main';

export interface HomepageSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  bestSellersTitle?: string;
  bestSellersSubtitle?: string;
  testimonialsTitle?: string;
  showNewsletter?: boolean;
  updatedAt?: any;
}

export const getHomepageSettings = async (): Promise<HomepageSettings | null> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return querySnapshot.docs[0].data() as HomepageSettings;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    return null;
  }
};

export const updateHomepageSettings = async (settings: Partial<HomepageSettings>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const seedHomepageSettings = async () => {
  const settings: HomepageSettings = {
    heroTitle: 'Elevate Your Home With Premium Style',
    heroSubtitle: 'Discover our curated collection of minimalist furniture and decor designed to bring comfort and elegance to your space.',
    featuredTitle: 'Featured Collection',
    featuredSubtitle: 'Our most exclusive pieces, handpicked for their exceptional design and craftsmanship.',
    bestSellersTitle: 'Best Sellers',
    bestSellersSubtitle: 'The most loved products by our community.',
    testimonialsTitle: 'What Our Customers Say',
    showNewsletter: true
  };

  await updateHomepageSettings(settings);
};
