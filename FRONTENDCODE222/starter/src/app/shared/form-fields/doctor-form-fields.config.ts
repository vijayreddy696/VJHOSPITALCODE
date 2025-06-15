import { Validators } from "@angular/forms";
import { genericFormField } from "@core/models/genericformfields.interface";
import { ReloadService } from "@shared/shared-services/reload.service";
import { QualificationService } from "app/qualificaton/qualification.service";
import { SpecializationService } from "app/specialization/specialization.service";

export function getDoctorFormFields(
    qualificationService: QualificationService,
    specializationService: SpecializationService,
    reloadService: ReloadService,
  ): genericFormField[] {
    return [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        validators: [Validators.required],
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        validators: [Validators.required, Validators.email],
      },
      {
        name: 'phoneNumber',
        label: 'Phone Number',
        type: 'text',
        validators: [Validators.required],
      },
        {
            name: 'gender',
            label: 'Gender',
            type: 'dropdown',
            options: ['Male', 'Female'],
            validators: [Validators.required],
        },
      {
        name: 'qualification',
        label: 'Qualification',
        type: 'autocomplete',
        autoOptions: (search: string) => qualificationService.getQualifications({ searchValue: search }),
        validators: [Validators.required, reloadService.requireAutocompleteObject],
        patchto: 'qualificationId',
        valuetoShow: 'code',
        valueToPatch: 'id',
      },
      {
        name: 'specialization',
        label: 'Specialization',
        type: 'autocomplete',
        autoOptions: (search: string) => specializationService.getSpecializations({ searchValue: search }),
        validators: [Validators.required, reloadService.requireAutocompleteObject],
        patchto: 'specializationId',
        valuetoShow: 'specializationName',
        valueToPatch: 'id',
      },
      {
        name: 'experience',
        label: 'Experience (Years)',
        type: 'text',
        validators: [Validators.min(0)],
      },
      {
        name: 'qualificationId',
        label: 'Qualification Id',
        type: 'text',
        hidden: true,
        validators: [Validators.required],
      },
      {
        name: 'specializationId',
        label: 'Specialization Id',
        type: 'text',
        hidden: true,
        validators: [Validators.required],
      },
    ];
  }