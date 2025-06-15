import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '@core/models/doctor.interface';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  
    addDoctor(doctor:Doctor)
    {
      return this.http.post("http://localhost:5068/api/Doctors/addorupdatedoctor", doctor);
    }
  
    deleteDoctor(id:number)
    {
      return this.http.delete(`http://localhost:5068/api/Doctors/deletedoctorbyid/${id}`);
    }
    
    getDoctors(paginationRequest: PagedRequest): Observable<PagedResult<Doctor>> 
    {
      return this.http.post<PagedResult<Doctor>>('http://localhost:5068/api/Doctors/getdoctors',paginationRequest);
    }
  
    deletemanyDoctors(ids: number[]) {
      return this.http.post(`http://localhost:5068/api/Doctors/deletemultipledoctors`,ids);
    }
}
