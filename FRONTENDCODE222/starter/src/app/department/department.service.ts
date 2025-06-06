import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '@core/models/department';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  addDepartment(department:Department)
  {
    return this.http.post("http://localhost:5068/api/Departments/addorupdatedepartment", department);
  }

  deleteDeartment(id:number)
  {
    return this.http.delete(`http://localhost:5068/api/Departments/deletedepartmentbyid/${id}`);
  }
  
  getDepartments(paginationRequest: PagedRequest): Observable<PagedResult<Department>> 
  {
    return this.http.post<PagedResult<Department>>('http://localhost:5068/api/Departments/getdepartments',paginationRequest);
  }

  deletemanyDepartments(ids: number[]) {
    return this.http.post(`http://localhost:5068/api/Departments/deletemultipledepartments`,ids);
  }
}
