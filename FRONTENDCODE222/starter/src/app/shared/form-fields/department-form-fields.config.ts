import { Validators } from "@angular/forms";

export function getDepartmentFormFields(isEditMode: boolean = false) {
    return [
      {
        name: 'departmentName',
        label: 'Department Name',
        type: 'text',
        validators: [Validators.required],
      },
     
      {
        name: 'departmentHeadName',
        label: 'Department Head Name',
        type: 'text',
        validators: [Validators.required, Validators.pattern('[a-zA-Z ]+')],
      },
      {
        name: 'departmentHeadEmail',
        label: 'Department Head Email',
        type: 'text',
        validators: [Validators.required, Validators.email],
      },
      {
        name: 'departmentHeadPhoneNumber',
        label: 'Department Head Phone Number',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
      },
    ];
  }
  