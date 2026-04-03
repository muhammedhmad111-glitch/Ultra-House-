import { collection, getDocs, query, where, doc, deleteDoc, orderBy, collectionGroup } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Review } from '../types';

const COLLECTION_NAME = 'reviews';

export const getAllReviews = async () => {
  try {
    // Using collectionGroup to get all reviews across all products
    const q = query(collectionGroup(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt;
      reviews.push({ ...data as Review, id: doc.id, createdAt });
    });
    
    return reviews;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
};

export const deleteReview = async (productId: string, reviewId: string) => {
  try {
    const docRef = doc(db, 'products', productId, COLLECTION_NAME, reviewId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${productId}/reviews/${reviewId}`);
  }
};
