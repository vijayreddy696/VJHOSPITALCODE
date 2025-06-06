import { Component } from '@angular/core';
import { getSpecializationFormFields } from '@shared/form-fields/specialization-form-fields.config';
import { SpecializationService } from '../specialization.service';
import { DepartmentService } from 'app/department/department.service';
import { PagedRequest } from '@core/models/pagedrequest';
import { map, Observable } from 'rxjs';
import { PagedResult } from '@core/models/pagedresult';
import { Specialization } from '@core/models/specialization';
import { CommonTableComponent } from '@shared/components/common-table/common-table.component';

@Component({
  selector: 'app-specializations-list',
  imports: [CommonTableComponent],
  templateUrl: './specializations-list.component.html',
  styleUrl: './specializations-list.component.scss'
})
export class SpecializationsListComponent {
  readonly columnDefinitions = [
      { def: 'select', label: 'Checkbox', type: 'check', visible: true },
      { def: 'specializationName', label: 'Specialization', type: 'text', visible: true },
      { def: 'department.departmentName', label: 'Department Name', type: 'text', visible: true },
      { def: 'modifiedDate', label: 'Last Modified ON', type: 'date', visible: true },
      { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
    ];
    readonly title = "Specialization";
    readonly formFields = (params: any) => getSpecializationFormFields(this.departmentService, params);
    
    constructor(private specializationService:SpecializationService,private departmentService:DepartmentService ){ }
   
    loadData(paginationRequest: PagedRequest): Observable<PagedResult<Specialization>> {
      return this.specializationService.getSpecializations(paginationRequest);
    }
    
    addData(formData: any): Observable<any> {
      return this.specializationService.addSpecialization(formData);
    }
  
    deleteData(id: number): Observable<any> {
      return this.specializationService.deleteSpecialization(id);
    }
    
    getByDepartmentID(id: number): Observable<any> {
      return this.specializationService.getSpecializationByDepartment(id);
    }
  
    deleteManyData(ids: number[]): Observable<any> {
      return this.specializationService.deletemanySpecialization(ids);
    }

}
