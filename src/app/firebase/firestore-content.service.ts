import { inject, Injectable } from '@angular/core';
import type { DocumentData, Firestore, Unsubscribe } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { firebaseConfig } from './firebase.config';

export interface Project {
  id: string;
  order: number;
  number: string;
  name: string;
  description: string;
  technologies: string[];
}

export interface BlogPost {
  id: string;
  order: number;
  category: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
}

export interface ContentState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

const EMPTY_STATE: ContentState<never> = {
  items: [],
  loading: true,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class FirestoreContentService {
  private firestorePromise: Promise<Firestore> | undefined;

  watchProjects(): Observable<ContentState<Project>> {
    return this.watchCollection('projects', (id, data) => this.toProject(id, data));
  }

  watchPosts(): Observable<ContentState<BlogPost>> {
    return this.watchCollection('posts', (id, data) => this.toBlogPost(id, data));
  }

  private watchCollection<T>(
    collectionName: string,
    parseDocument: (id: string, data: DocumentData) => T,
  ): Observable<ContentState<T>> {
    return new Observable((subscriber) => {
      subscriber.next(EMPTY_STATE);
      let unsubscribe: Unsubscribe | undefined;
      let cancelled = false;

      void this.getFirestore()
        .then(async (firestore) => {
          if (cancelled) {
            return;
          }

          const { collection, onSnapshot, query, where } = await import('firebase/firestore');
          if (cancelled) {
            return;
          }

          const publishedItems = query(
            collection(firestore, collectionName),
            where('published', '==', true),
          );

          unsubscribe = onSnapshot(
            publishedItems,
            (snapshot) => {
              try {
                const items = snapshot.docs
                  .map((document) => parseDocument(document.id, document.data()))
                  .sort((first, second) => this.getOrder(first) - this.getOrder(second));

                subscriber.next({ items, loading: false, error: null });
              } catch (error) {
                console.error(`Invalid document in Firestore collection "${collectionName}".`, error);
                subscriber.next({
                  items: [],
                  loading: false,
                  error: 'Há um documento publicado com formato inválido no Firestore.',
                });
              }
            },
            (error: Error) => {
              console.error(`Could not read Firestore collection "${collectionName}".`, error);
              subscriber.next({
                items: [],
                loading: false,
                error: 'Não foi possível carregar o conteúdo. Verifique a conexão e as regras do Firestore.',
              });
            },
          );
        })
        .catch((error: unknown) => {
          if (cancelled) {
            return;
          }
          console.error(`Could not initialize Firestore collection "${collectionName}".`, error);
          subscriber.next({
            items: [],
            loading: false,
            error: 'Não foi possível conectar ao Firebase. Verifique a configuração do projeto.',
          });
        });

      return () => {
        cancelled = true;
        unsubscribe?.();
      };
    });
  }

  private getFirestore(): Promise<Firestore> {
    if (!this.firestorePromise) {
      this.firestorePromise = Promise.resolve().then(async () => {
        const { getApps, initializeApp } = await import('firebase/app');
        const app = getApps().find((firebaseApp) => firebaseApp.name === '[DEFAULT]')
          ?? initializeApp(firebaseConfig);
        const { getFirestore } = await import('firebase/firestore');
        return getFirestore(app);
      });
    }

    return this.firestorePromise;
  }

  private toProject(id: string, data: DocumentData): Project {
    return {
      id,
      order: this.readOrder(id, data),
      number: this.readString(id, data, 'number'),
      name: this.readString(id, data, 'name'),
      description: this.readString(id, data, 'description'),
      technologies: this.readStringArray(id, data, 'technologies'),
    };
  }

  private toBlogPost(id: string, data: DocumentData): BlogPost {
    return {
      id,
      order: this.readOrder(id, data),
      category: this.readString(id, data, 'category'),
      title: this.readString(id, data, 'title'),
      description: this.readString(id, data, 'description'),
      date: this.readString(id, data, 'date'),
      readingTime: this.readString(id, data, 'readingTime'),
    };
  }

  private readString(id: string, data: DocumentData, field: string): string {
    const value: unknown = data[field];
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`Document "${id}" must contain a non-empty "${field}" string.`);
    }
    return value;
  }

  private readStringArray(id: string, data: DocumentData, field: string): string[] {
    const value: unknown = data[field];
    if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
      throw new Error(`Document "${id}" must contain a "${field}" array of strings.`);
    }
    return value;
  }

  private readOrder(id: string, data: DocumentData): number {
    const value: unknown = data['order'];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`Document "${id}" must contain a numeric "order" field.`);
    }
    return value;
  }

  private getOrder(value: unknown): number {
    if (
      typeof value === 'object' &&
      value !== null &&
      'order' in value &&
      typeof value.order === 'number'
    ) {
      return value.order;
    }
    return 0;
  }
}
