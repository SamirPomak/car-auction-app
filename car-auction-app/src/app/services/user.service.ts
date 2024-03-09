import { Injectable } from '@angular/core';
import {
  Auth,
  user,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { firstValueFrom, shareReplay } from 'rxjs';

type UserCredentials = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = user(this.auth).pipe(shareReplay(1));
  constructor(private auth: Auth) {}

  getUserObservable() {
    return this.user;
  }

  getUser() {
    return firstValueFrom(this.user);
  }

  register(credentials: UserCredentials) {
    return createUserWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    );
  }

  login(credentials: UserCredentials) {
    return signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    );
  }

  signOut() {
    return signOut(this.auth);
  }
}
