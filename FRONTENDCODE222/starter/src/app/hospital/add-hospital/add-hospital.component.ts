import { Component } from '@angular/core';
import { SharedformsComponent } from '@shared/components/sharedforms/sharedforms.component';
import { getHospitalFormFields } from '@shared/form-fields/hospital-form-fields.config';
import { ReloadService } from '@shared/shared-services/reload.service';
import { HospitalService } from '../hospital.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-hospital',
  imports: [SharedformsComponent],
  templateUrl: './add-hospital.component.html',
  styleUrl: './add-hospital.component.scss'
})
export class AddHospitalComponent {
readonly title:string = "Hospital";
readonly formFields = getHospitalFormFields(this.reloadService);

    constructor(private reloadService:ReloadService,private hospitalService:HospitalService) { }

    addHospital(formData: any): Observable<any> {
        return this.hospitalService.addHospital(formData);
      }
  
}
