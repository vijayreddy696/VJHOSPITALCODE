import { Validators } from "@angular/forms";
import { genericFormField } from "@core/models/genericformfields.interface";
import { ReloadService } from "@shared/shared-services/reload.service";
import { DepartmentService } from "app/department/department.service";
import { map } from "rxjs";



export function getSpecializationFormFields(departmentService:DepartmentService,reloadService:ReloadService, isEditMode: boolean = false):genericFormField[] {
  return [
    {
      name: 'specializationName',
      label: 'Specialization Name',
      type: 'text',
      validators: [Validators.required],
    },
   

    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      validators: [],
    },
    {
      name: 'departmentId',
      label: 'DepartmentId',
      type: 'text',
      validators: [Validators.required],
    },
    {
      name: 'department',
      label: 'Department Name',
      type: 'autocomplete',
      validators: [Validators.required,reloadService.requireAutocompleteObject],
      autoOptions: (search: string) => departmentService.getDepartments({ searchValue : search }),
      patchto:'departmentId',
      valuetoShow: 'departmentName',
      valueToPatch: 'id'
    },
    

    // {
    //   name: 'department',
    //   label: 'Department',
    //   type: 'group',
    //   fields:[
    //     {
    //       name: 'departmentName',
    //       label: 'Department Name',
    //       type: 'autocomplete',
    //       validators: [Validators.required,reloadService.requireAutocompleteObject],
    //       autoOptions: (search: string) => departmentService.getDepartments({ searchValue : search }),
    //       patchto:'departmentId',
    //       valuetoShow: 'departmentName',
    //       valueToPatch: 'id'
    //     },
      
      
    //   ]
    // },
    
  ];
}

