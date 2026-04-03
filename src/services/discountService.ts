import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { Discount } from '../types';

const COLLECTION_NAME = 'discounts';

export const getDiscounts = async (onlyActive = false): Promise<Discount[]> => {
  try {
    let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    if (onlyActive) {
      q = query(q, where('isActive', '==', true));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Discount[];
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

export const addDiscount = async (discount: Omit<Discount, 'id' | 'createdAt' | 'usageCount'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...discount,
      usageCount: 0,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding discount:", error);
    throw error;
  }
};

export const updateDiscount = async (id: string, discount: Partial<Discount>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, discount);
  } catch (error) {
    console.error("Error updating discount:", error);
    throw error;
  }
};

export const deleteDiscount = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting discount:", error);
    throw error;
  }
};

export const validateDiscount = async (code: string, cartTotal: number): Promise<Discount | null> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('code', '==', code.toUpperCase()),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const discount = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Discount;
    
    // Check dates
    const now = new Date();
    if (new Date(discount.startDate) > now) return null;
    if (discount.endDate && new Date(discount.endDate) < now) return null;
    
    // Check usage limit
    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) return null;
    
    // Check min purchase
    if (discount.minPurchase && cartTotal < discount.minPurchase) return null;
    
    return discount;
  } catch (error) {
    console.error("Error validating discount:", error);
    return null;
  }
};
