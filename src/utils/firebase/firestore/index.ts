import { getFirestore, Firestore } from 'firebase/firestore'
import { app } from '../firebase'

export const db: Firestore | null = app ? getFirestore(app) : null
