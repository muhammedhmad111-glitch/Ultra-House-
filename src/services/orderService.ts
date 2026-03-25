import { collection, addDoc, serverTimestamp, doc, setDoc, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order } from '../types';

const COLLECTION_NAME = 'orders';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  try {
    const orderRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...orderData,
      createdAt: serverTimestamp()
    });
    
    // Update the order with its ID
    await setDoc(doc(db, COLLECTION_NAME, orderRef.id), { id: orderRef.id }, { merge: true });
    
    return orderRef.id;
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
      orders.push({ ...doc.data() as Order, id: doc.id });
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
