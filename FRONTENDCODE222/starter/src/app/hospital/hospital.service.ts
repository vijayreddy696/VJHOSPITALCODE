import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddHospital } from '@core/models/hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

   addHospital(hospital:AddHospital){
      return this.http.post("http://localhost:5068/api/Hospitals/addorupdatehospital", hospital);
    }
}
