import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { Role } from '@core/models/role';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

 

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, hospitalId: number = 6): Observable<User> {
    const loginPayload = { hospitalId, email, password };
  
    return this.http.post<{ token: string }>("http://localhost:5068/api/Auth/login", loginPayload).pipe(
      map(response => {
        const token = response.token;
  
        // decode JWT token (using jwt-decode library)
        const decoded: any = jwtDecode(token);
  
        // Create user object from claims in decoded token
        const user: User = {
          id: decoded.id,
          email: decoded.email,
          phoneNumber:decoded.phoneNumber,
          fullName: decoded.fullName,
          role: decoded.role,
          token: token,
          lastModifiedDate:decoded.lastModifiedDate,
          img: "assets/images/hospitallogos/vj_hospitals_logo.jpg", // helper method to assign user image if needed
        };
  
        // Store user info with token in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
  
        // update current user observable
        this.currentUserSubject.next(user);
  
        return user;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }
  

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
