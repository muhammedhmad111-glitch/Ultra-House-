import { collection, getDocs, query, doc, setDoc, deleteDoc, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Banner } from '../types';

const COLLECTION_NAME = 'banners';

export const getBanners = async (onlyActive = false, type?: 'hero' | 'promo') => {
  try {
    let q = query(collection(db, COLLECTION_NAME));
    const constraints = [];
    
    if (onlyActive) {
      constraints.push(where('isActive', '==', true));
    }
    
    if (type) {
      constraints.push(where('type', '==', type));
    }
    
    if (constraints.length > 0) {
      q = query(collection(db, COLLECTION_NAME), ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    const banners: Banner[] = [];
    
    querySnapshot.forEach((doc) => {
      banners.push({ ...doc.data() as Banner, id: doc.id });
    });
    
    return banners;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
};

export const addBanner = async (banner: Omit<Banner, 'id'>) => {
  try {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const id = docRef.id;
    
    const dataToSave = {
      ...banner,
      id,
      createdAt: serverTimestamp()
    };
    
    await setDoc(docRef, dataToSave);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const updateBanner = async (id: string, banner: Partial<Banner>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...banner,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
};

export const deleteBanner = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
};

export const seedBanners = async () => {
  const banners = [
    {
      title: 'Elevate Your Home With Premium Style',
      subtitle: 'Discover our curated collection of minimalist furniture and decor designed to bring comfort and elegance to your space.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
      link: '/products',
      buttonText: 'Shop Collection',
      isActive: true,
      type: 'hero' as const
    }
  ];

  for (const banner of banners) {
    await addBanner(banner);
  }
};
