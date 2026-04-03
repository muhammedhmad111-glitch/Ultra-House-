import { collection, getDocs, query, doc, setDoc, deleteDoc, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Testimonial } from '../types';

const COLLECTION_NAME = 'testimonials';

export const getTestimonials = async (onlyActive = false) => {
  try {
    let q = query(collection(db, COLLECTION_NAME));
    if (onlyActive) {
      q = query(collection(db, COLLECTION_NAME), where('isActive', '==', true));
    }
    const querySnapshot = await getDocs(q);
    const testimonials: Testimonial[] = [];
    
    querySnapshot.forEach((doc) => {
      testimonials.push({ ...doc.data() as Testimonial, id: doc.id });
    });
    
    return testimonials;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
  try {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const id = docRef.id;
    
    const dataToSave = {
      ...testimonial,
      id,
      createdAt: serverTimestamp()
    };
    
    await setDoc(docRef, dataToSave);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...testimonial,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }
};

export const deleteTestimonial = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
};

export const seedTestimonials = async () => {
  const testimonials = [
    { name: 'Sarah J.', role: 'Interior Designer', text: 'UltraHouse has completely transformed my client projects. The quality of the furniture is unmatched at this price point.', isActive: true },
    { name: 'Ahmed M.', role: 'Home Owner', text: 'Fast delivery to Riyadh and the packaging was excellent. The minimalist sofa looks even better in person!', isActive: true },
    { name: 'Elena R.', role: 'Lifestyle Blogger', text: 'I love the curated selection. Every piece feels like it was chosen with care. Highly recommend their lighting collection.', isActive: true }
  ];

  for (const testimonial of testimonials) {
    await addTestimonial(testimonial);
  }
};
