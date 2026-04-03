import { collection, serverTimestamp, doc, setDoc, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order } from '../types';

const COLLECTION_NAME = 'orders';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  try {
    const orderRef = doc(collection(db, COLLECTION_NAME));
    const id = orderRef.id;
    
    // Remove undefined fields to prevent Firestore errors (e.g., userId for guest checkouts)
    const dataToSave = {
      ...orderData,
      id,
      createdAt: serverTimestamp()
    };
    
    Object.keys(dataToSave).forEach(key => {
      if ((dataToSave as any)[key] === undefined) {
        delete (dataToSave as any)[key];
      }
    });
    
    await setDoc(orderRef, dataToSave);
    
    // 3. Notify Backend (Email/Google Sheets)
    try {
      await fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: dataToSave })
      });
    } catch (notifyError) {
      console.error('Failed to send order notification:', notifyError);
      // Don't fail the order if notification fails
    }
    
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const getOrders = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firebase Timestamp to ISO string if it exists
      const createdAt = data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt;
      orders.push({ ...data as Order, id: doc.id, createdAt });
    });
    
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  try {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${orderId}`);
  }
};
