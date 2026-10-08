import { Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { firstValueFrom, Observable, take } from 'rxjs';
import { getFirebaseApp } from '../firebase/firebase-app';

export const ADMIN_EMAIL = 'ronfelara@gmail.com';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly auth: Auth = getAuth(getFirebaseApp());

  observeUser(): Observable<User | null> {
    return new Observable((subscriber) =>
      onAuthStateChanged(
        this.auth,
        (user) => subscriber.next(user),
        (error) => subscriber.error(error),
      ),
    );
  }

  async waitForUser(): Promise<User | null> {
    return firstValueFrom(this.observeUser().pipe(take(1)));
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email.trim(), password);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  isAdmin(user: User | null): boolean {
    return user?.email?.toLowerCase() === ADMIN_EMAIL && user.emailVerified;
  }
}
