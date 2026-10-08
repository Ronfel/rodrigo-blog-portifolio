import { Injectable } from '@angular/core';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from '../firebase/firebase-app';

export interface NewProject {
  published: boolean;
  order: number;
  number: string;
  name: string;
  description: string;
  technologies: string[];
}

export interface NewPost {
  published: boolean;
  order: number;
  category: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
}

@Injectable({ providedIn: 'root' })
export class FirestoreAdminService {
  private readonly firestore = getFirestore(getFirebaseApp());

  async createProject(project: NewProject): Promise<void> {
    await addDoc(collection(this.firestore, 'projects'), project);
  }

  async createPost(post: NewPost): Promise<void> {
    await addDoc(collection(this.firestore, 'posts'), post);
  }
}
