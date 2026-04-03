import { collection, getDocs, query, doc, setDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Category } from '../types';

const COLLECTION_NAME = 'categories';

export const getCategories = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const categories: Category[] = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({ ...doc.data() as Category, id: doc.id });
    });
    
    return categories;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
};

export const addCategory = async (category: Omit<Category, 'id'>) => {
  try {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const id = docRef.id;
    
    const dataToSave = {
      ...category,
      id,
      createdAt: serverTimestamp()
    };
    
    // Remove undefined fields
    Object.keys(dataToSave).forEach(key => {
      if ((dataToSave as any)[key] === undefined) {
        delete (dataToSave as any)[key];
      }
    });

    await setDoc(docRef, dataToSave);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const updateCategory = async (id: string, category: Partial<Category>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const dataToUpdate = {
      ...category,
      updatedAt: serverTimestamp(),
    };

    // Remove undefined fields
    Object.keys(dataToUpdate).forEach(key => {
      if ((dataToUpdate as any)[key] === undefined) {
        delete (dataToUpdate as any)[key];
      }
    });

    await updateDoc(docRef, dataToUpdate);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
};

export const seedCategories = async () => {
  const categories = [
    { name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Lighting', slug: 'lighting', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Home Decor', slug: 'decor', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Kitchenware', slug: 'kitchen', image: 'https://images.unsplash.com/photo-1591130901020-ef93581c446c?q=80&w=1000&auto=format&fit=crop' },
  ];

  for (const category of categories) {
    await addCategory(category);
  }
};
