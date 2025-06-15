import { Validators } from '@angular/forms';

export function getQualificationFormFields(isEditMode: boolean = false) {
  return [
    {
      name: 'code',
      label: 'Qualification Code',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(10)],
    },
    {
      name: 'fullForm',
      label: 'Qualification Full Form',
      type: 'text',
      validators: [Validators.required, Validators.maxLength(100)],
    }
  ];
}
