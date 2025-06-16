import { Validators } from "@angular/forms";
import { genericFormField } from "@core/models/genericformfields.interface";
import { ReloadService } from "@shared/shared-services/reload.service";
import { QualificationService } from "app/qualificaton/qualification.service";
import { SpecializationService } from "app/specialization/specialization.service";
import { getUserFormFields } from "./user-form-fields.config";

export function getDoctorFormFields(
    qualificationService: QualificationService,
    specializationService: SpecializationService,
    reloadService: ReloadService,
    isEditMode: boolean = false
  ): genericFormField[] {
    return [
     
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
    {
            name: 'personalDetails',  // Nested group for user fields
            label: 'Personal Details',
            type: 'group',
            fields: getUserFormFields(reloadService, isEditMode),
        },
    ];
  }