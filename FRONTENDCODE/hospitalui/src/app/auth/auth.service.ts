import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5068/api'; // Update with your API

  constructor(private http: HttpClient, private router: Router) {}



  login(credentials: { email: string, password: string,hospitalId:number}) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/Auth/login`, credentials);
  }

  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
