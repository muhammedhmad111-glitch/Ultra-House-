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
      products.push({ ...doc.data() as Product, id: doc.id });
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
      return { ...docSnap.data() as Product, id: docSnap.id };
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
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp(),
    });
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
