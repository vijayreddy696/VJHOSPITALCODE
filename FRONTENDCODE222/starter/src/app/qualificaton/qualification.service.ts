import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { Qualification } from '@core/models/qualification.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  constructor(private http: HttpClient) { }
  
    addQualification(qualification:Qualification)
    {
      return this.http.post("http://localhost:5068/api/Qualifications/addorupdatequalification", qualification);
    }
  
    deleteQualification(id:number)
    {
      return this.http.delete(`http://localhost:5068/api/Qualifications/deletequalificationbyid/${id}`);
    }
    
    getQualifications(paginationRequest: PagedRequest): Observable<PagedResult<Qualification>> 
    {
      return this.http.post<PagedResult<Qualification>>('http://localhost:5068/api/Qualifications/getqualifications',paginationRequest);
    }
  
    deletemanyQualifications(ids: number[]) {
      return this.http.post(`http://localhost:5068/api/Qualifications/deletemultiplequalifications`,ids);
    }

    
}
