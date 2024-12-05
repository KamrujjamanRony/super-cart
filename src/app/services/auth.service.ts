import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  // private firestore = inject(Firestore);
  public currentUser: any = null;

  getUser(data: any) {
    this.auth.onAuthStateChanged((user) => {
      data = user;
      console.log(user)
    });
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  registerWithEmail(email: any, password: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signInWithEmail(email: any, password: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  
  signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  
  forgotPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
  
  logout() {
    return signOut(this.auth);
  }
  
}
