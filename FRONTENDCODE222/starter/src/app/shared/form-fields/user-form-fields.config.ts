import { Validators } from "@angular/forms";
import { Role } from "@core/models/role";
import { ReloadService } from "@shared/services/reload.service";






export function getUserFormFields(reloadService: ReloadService) {
    return [
        {
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          validators: [Validators.required, Validators.pattern('[a-zA-Z]+')],
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'dropdown',
          options: ['Male', 'Female'],
          validators: [Validators.required],
        },
        {
          name: 'phoneNumber',
          label: 'Phone Number',
          type: 'text',
          validators: [Validators.required],
        },
        {
          name: 'role',
          label: 'Role',
          type: 'dropdown',
          options: Object.values(Role),
          validators: [Validators.required],
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          validators: [Validators.required],
        },
        {
          name: 'conformPassword',
          label: 'Re-Enter Password',
          type: 'password',
          validators: [Validators.required,reloadService.confirmPasswordValidator], // You can add confirm logic later
        },
        {
          name: 'address',
          label: 'Address',
          type: 'textarea',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'text',
          validators: [Validators.required, Validators.email, Validators.minLength(5)],
        },
        {
          name: 'dateOfBirth',
          label: 'Date Of Birth',
          type: 'date',
          validators: [Validators.required],
        },
        {
          name: 'uploadFile',
          label: 'Upload',
          type: 'file',
        },
      ];

}

