import { Component } from '@angular/core';
import { Department } from '@core/models/department';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { map, Observable } from 'rxjs';
import { DepartmentService } from '../department.service';
import { getDepartmentFormFields } from '@shared/form-fields/department-form-fields.config';
import { CommonTableComponent } from '@shared/components/common-table/common-table.component';

@Component({
  selector: 'app-departments-list',
  imports: [CommonTableComponent],
  templateUrl: './departments-list.component.html',
  styleUrl: './departments-list.component.scss'
})
export class DepartmentsListComponent {

  readonly formFields = (params: any) => getDepartmentFormFields(params);

  readonly columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'departmentName', label: 'Department Name', type: 'text', visible: true },
    { def: 'departmentHeadName', label: 'Head Name', type: 'text', visible: true },
    { def: 'departmentHeadEmail', label: 'Head Email', type: 'email', visible: true },
    { def: 'departmentHeadPhoneNumber', label: 'Head Phone', type: 'phone', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  readonly title = "Department";

  constructor(private departmentService:DepartmentService){}

  

  loadData(paginationRequest: PagedRequest): Observable<PagedResult<Department>> {
      return this.departmentService.getDepartments(paginationRequest).pipe(
        map(data => ({
          ...data,
          items: (data.items || []).map((department: Department) => ({
            ...department,
            img: 'assets/images/user/doctor.jpg'
          }))
        }))
      );
    }

    addData(formData: any): Observable<any> {
      return this.departmentService.addDepartment(formData);
    }
    
    deleteData(id: number): Observable<any> {
      return this.departmentService.deleteDeartment(id);
    }

    deleteManyData(ids: number[]) {
      return this.departmentService.deletemanyDepartments(ids);
    }

    getDataById(id: number): Observable<any> {
          return this.departmentService.getDeartmentById(id);
      }

}
