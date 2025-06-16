import { Component } from '@angular/core';
import { DoctorService } from '../doctor.service';
import { PagedRequest } from '@core/models/pagedrequest';
import { map, Observable } from 'rxjs';
import { Doctor } from '@core/models/doctor.interface';
import { PagedResult } from '@core/models/pagedresult';
import { CommonTableComponent } from '@shared/components/common-table/common-table.component';
import { getDoctorFormFields } from '@shared/form-fields/doctor-form-fields.config';
import { QualificationService } from 'app/qualificaton/qualification.service';
import { SpecializationService } from 'app/specialization/specialization.service';
import { ReloadService } from '@shared/shared-services/reload.service';

@Component({
  selector: 'app-doctors-list',
  imports: [CommonTableComponent],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.scss'
})
export class DoctorsListComponent {

  readonly title = "Doctor";
  
  readonly formFields = (params: any) => getDoctorFormFields(this.qualificationService,this.specializationService,this.reloadService,params);

  readonly columnDefinitions = [
    { def: 'personalDetails.fullName', label: 'Doctor Name', type: 'fullName', visible: true },
    { def: 'personalDetails.email', label: 'Email', type: 'email', visible: true },
    { def: 'qualification.code', label: 'Qualification', type: 'text', visible: true },
    { def: 'specialization.specializationName', label: 'Specialization', type: 'text', visible: true },
    { def: 'specialization.department.departmentName', label: 'Department', type: 'text', visible: true },
    { def: 'createdDate', label: 'Created Date', type: 'date', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  
   
  constructor(private doctorService:DoctorService,private qualificationService:QualificationService,private specializationService:SpecializationService,private reloadService: ReloadService){}
  loadData(paginationRequest: PagedRequest): Observable<PagedResult<Doctor>> {
        return this.doctorService.getDoctors(paginationRequest).pipe(
          map(data => ({
            ...data,
            items: (data.items || []).map((doctor: Doctor) => ({
              ...doctor,
              img: 'assets/images/user/doctor.jpg'
            }))
          }))
        );
      }
  
      addData(formData: any): Observable<any> {
        return this.doctorService.addDoctor(formData);
      }
      
      deleteData(id: number): Observable<any> {
        return this.doctorService.deleteDoctor(id);
      }

      getDataById(id: number): Observable<any> {
        return this.doctorService.getDoctorById(id);
      }
  
      deleteManyData(ids: number[]) {
        return this.doctorService.deletemanyDoctors(ids);
      }

}
