import { Validators } from "@angular/forms";
import { DepartmentService } from "app/department/department.service";
import { map } from "rxjs";



export function getSpecializationFormFields(departmentService:DepartmentService, isEditMode: boolean = false) {
  return [
    {
      name: 'specializationName',
      label: 'Specialization Name',
      type: 'text',
      validators: [Validators.required],
    },
    {
      name: 'departmentId',
      label: 'Department',
      type: 'autocomplete',
      validators: [Validators.required],
      autoOptions: (search: string) => departmentService.getDepartments({ searchValue : search }).pipe(
        map(result => result.items.map(item => ({
          label: item.departmentName,
          value: item.id
        })))
      ),
    },
    
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      validators: [],
    },
    
  ];
}