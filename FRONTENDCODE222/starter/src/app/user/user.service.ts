import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctors } from '@core/models/doctor';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { AddUser, User } from '@core/models/user';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(paginationRequest: PagedRequest): Observable<PagedResult<User>> {
    return this.http.post<PagedResult<User>>('http://localhost:5068/api/Users/getusers',paginationRequest);}
  

  addUser(user:AddUser){
    return this.http.post("http://localhost:5068/api/Users/addorupdateuser", user);
  }

  
  deleteUser(id: number) {
    return this.http.delete(`http://localhost:5068/api/Users/deleteuserbyid/${id}`);
  }

  activateUser(id: number) {
    return this.http.put(`http://localhost:5068/api/Users/activateuserbyid/${id}`,{});
  }

  getUserById(id: number) {
    return this.http.get(`http://localhost:5068/api/Users/getuserbyid/${id}`);
  }
  
  deletemanyUsers(ids: number[]) {
    return this.http.post(`http://localhost:5068/api/Users/deletemultipleusers`,ids);
  }
  
  


}
