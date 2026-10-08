import { Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { firstValueFrom, Observable, take } from 'rxjs';
import { getFirebaseApp } from '../firebase/firebase-app';

export const ADMIN_EMAIL = 'rodrigonflara@gmail.com';

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

  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email.trim(), password);
    return credential.user;
  }

  async sendVerificationEmail(user: User): Promise<void> {
    await sendEmailVerification(user);
  }

  async refreshUser(user: User): Promise<User> {
    await reload(user);
    return user;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  isAdmin(user: User | null): boolean {
    return user?.email?.toLowerCase() === ADMIN_EMAIL && user.emailVerified;
  }
}
