import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctors } from '@core/models/doctor';
import { AddUser } from '@core/models/user';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'assets/data/doctors.json';

  constructor(private http: HttpClient) { }

  getusers(paginationRequest: any) {
    return this.http.post("http://localhost:5068/api/Users/getusers", paginationRequest);
  }

  adduser(user:AddUser){
    return this.http.post("http://localhost:5068/api/Users/addorupdateuser", user);
  }
  


}
