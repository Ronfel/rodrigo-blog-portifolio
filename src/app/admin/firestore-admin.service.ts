import { Injectable } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from '../firebase/firebase-app';

const WRITE_CONFIRMATION_TIMEOUT_MS = 20_000;

export class FirestoreWriteTimeoutError extends Error {
  constructor() {
    super('Firestore did not confirm the write before the timeout.');
    this.name = 'FirestoreWriteTimeoutError';
  }
}

export function getFirestoreWriteErrorMessage(error: unknown, contentType: string): string {
  if (error instanceof FirestoreWriteTimeoutError) {
    return `O Firebase não confirmou o cadastro de ${contentType} em 20 segundos. A gravação ainda pode ser concluída. Confira a coleção no Firestore antes de tentar novamente; o formulário ficará bloqueado para evitar duplicatas.`;
  }

  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return `O Firestore recusou o cadastro de ${contentType}. Confira se você entrou com ronfelara@gmail.com e se as regras publicadas permitem os dados informados; a lista de tecnologias aceita nas regras também pode estar desatualizada.`;
    }
    if (error.code === 'unauthenticated') {
      return 'Sua sessão expirou. Entre novamente antes de salvar.';
    }
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
      return `O Firebase está indisponível no momento e não confirmou o cadastro de ${contentType}. Confira a conexão e verifique a coleção antes de tentar novamente.`;
    }
    return `Falha ao cadastrar ${contentType} (Firebase: ${error.code}).`;
  }

  if (error instanceof Error) {
    return `Não foi possível cadastrar ${contentType}: ${error.message}`;
  }

  return `Não foi possível cadastrar ${contentType}. O erro não retornou detalhes.`;
}

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
    await this.waitForConfirmation(addDoc(collection(this.firestore, 'projects'), project));
  }

  async createPost(post: NewPost): Promise<void> {
    await this.waitForConfirmation(addDoc(collection(this.firestore, 'posts'), post));
  }

  private async waitForConfirmation(write: Promise<unknown>): Promise<void> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new FirestoreWriteTimeoutError()),
        WRITE_CONFIRMATION_TIMEOUT_MS,
      );
    });

    try {
      await Promise.race([write, timeout]);
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }
}
