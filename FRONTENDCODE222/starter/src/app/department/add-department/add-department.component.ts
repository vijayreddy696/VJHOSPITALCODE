import { Component } from '@angular/core';
import { getDepartmentFormFields } from '@shared/form-fields/department-form-fields.config';
import { DepartmentService } from '../department.service';
import { Observable } from 'rxjs';
import { SharedformsComponent } from '@shared/components/sharedforms/sharedforms.component';

@Component({
  selector: 'app-add-department',
  imports: [SharedformsComponent],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent {
  readonly title:string = "Department";
    readonly formFields = getDepartmentFormFields();

    constructor(private departmentService:DepartmentService){}

    addDepartment(formData: any): Observable<any> {
        return this.departmentService.addDepartment(formData);
      }


}
