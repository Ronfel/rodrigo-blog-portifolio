import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
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

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await new Promise<UserCredential>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        reject(
          new FirebaseError(
            'auth/sign-in-timeout',
            'Google sign-in did not complete within the allowed time.',
          ),
        );
      }, 15000);

      void signInWithPopup(this.auth, provider).then(resolve, reject).finally(() => {
        window.clearTimeout(timeoutId);
      });
    });
    return credential.user;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  isAdmin(user: User | null): boolean {
    return user?.email?.toLowerCase() === ADMIN_EMAIL && user.emailVerified;
  }
}
