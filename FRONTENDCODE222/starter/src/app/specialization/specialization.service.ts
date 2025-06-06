import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { Specialization } from '@core/models/specialization';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {

  constructor(private http: HttpClient) { }

  getSpecializations(paginationRequest: PagedRequest): Observable<PagedResult<Specialization>> {
    return this.http.post<PagedResult<Specialization>>('http://localhost:5068/api/Specializations/getspecializations',paginationRequest);}

  addSpecialization(user:Specialization){
    return this.http.post("http://localhost:5068/api/Specializations/addorupdatespecialization", user);
  }
  
  deleteSpecialization(id: number) {
    return this.http.delete(`http://localhost:5068/api/Specializations/deletespecializationbyid/${id}`);
  }

  getSpecialization(id: number) {
    return this.http.get(`http://localhost:5068/api/Specializations/getspecializationbyid/${id}`);
  }

  getSpecializationByDepartment(id: number) {
    return this.http.get(`http://localhost:5068/api/Specializations/getspecializationbydepartmentid/${id}`);
  }

  deletemanySpecialization(ids: number[]) {
    return this.http.post(`http://localhost:5068/api/Specializations/deletemultiplespecializations`,ids);
  }

}
