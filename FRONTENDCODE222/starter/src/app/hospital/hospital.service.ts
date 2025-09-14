import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddHospital } from '@core/models/hospital';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  addHospital(hospital:AddHospital)
  {
    return this.http.post("http://localhost:5068/api/Hospitals/addorupdatehospital", hospital);
  }

  deleteHospital(id:number)
  {
    return this.http.delete(`http://localhost:5068/api/Hospitals/harddeletehospitalbyid/${id}`);
  }

  getHospitals(paginationRequest: PagedRequest): Observable<PagedResult<AddHospital>> 
  {
    return this.http.post<PagedResult<AddHospital>>('http://localhost:5068/api/Hospitals/gethospitals',paginationRequest);
  }

  getHospitalById(id:number)
    {
    return this.http.get(`http://localhost:5068/api/Hospitals/gethospitalbyid/${id}`);
    }
    
}
