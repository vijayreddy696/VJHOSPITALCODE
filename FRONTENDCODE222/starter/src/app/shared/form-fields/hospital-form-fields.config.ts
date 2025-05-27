import { Validators } from "@angular/forms";
import { ReloadService } from "@shared/services/reload.service";
import { getUserFormFields } from "./user-form-fields.config";




export function getHospitalFormFields(reloadService: ReloadService, isEditMode: boolean = false) {
    return [
      {
        name: 'hospitalName',
        label: 'Hospital Name',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'hospitalEmail',
        label: 'Hospital Email',
        type: 'text',
        validators: [Validators.required, Validators.email],
      },
      {
        name: 'hospitalAddress',
        label: 'Hospital Address',
        type: 'textarea',
        validators: [Validators.required],
      },
     
      {
        name: 'ownerDetails',  // Nested group for user fields
        label: 'Owner Details',
        type: 'group',
        fields: getUserFormFields(reloadService, isEditMode),
      },
    ];
  }