import { collection, getDocs, query, where, doc, getDoc, setDoc, serverTimestamp, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/sampleData';

const COLLECTION_NAME = 'products';

export const getProducts = async (category?: string) => {
  try {
    let q = query(collection(db, COLLECTION_NAME));
    if (category && category !== 'all') {
      q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
    }
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt;
      products.push({ ...data as Product, id: doc.id, createdAt });
    });
    
    // If no products in Firestore, return sample data
    if (products.length === 0) {
      return SAMPLE_PRODUCTS;
    }
    
    return products;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return SAMPLE_PRODUCTS;
  }
};

export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const createdAt = data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt;
      return { ...data as Product, id: docSnap.id, createdAt };
    } else {
      // Fallback to sample data
      return SAMPLE_PRODUCTS.find(p => p.id === id) || null;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
    return SAMPLE_PRODUCTS.find(p => p.id === id) || null;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const dataToSave = {
      ...product,
      createdAt: serverTimestamp(),
    };
    
    // Remove undefined fields
    Object.keys(dataToSave).forEach(key => {
      if ((dataToSave as any)[key] === undefined) {
        delete (dataToSave as any)[key];
      }
    });

    const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const dataToUpdate = {
      ...product,
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

export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
};

export const seedProducts = async () => {
  try {
    for (const product of SAMPLE_PRODUCTS) {
      await setDoc(doc(db, COLLECTION_NAME, product.id), {
        ...product,
        createdAt: serverTimestamp()
      });
    }
    console.log('Database seeded successfully');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};
