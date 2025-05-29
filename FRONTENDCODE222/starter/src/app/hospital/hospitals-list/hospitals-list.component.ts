import { Component } from '@angular/core';
import { AddHospital } from '@core/models/hospital';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { ReloadService } from '@shared/services/reload.service';
import { map, Observable } from 'rxjs';
import { HospitalService } from '../hospital.service';
import { CommonTableComponent } from '@shared/components/common-table/common-table.component';

@Component({
  selector: 'app-hospitals-list',
  imports: [CommonTableComponent],
  templateUrl: './hospitals-list.component.html',
  styleUrl: './hospitals-list.component.scss'
})
export class HospitalsListComponent {

  readonly title = "Hospital";

  readonly columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'ownerDetails.fullName', label: 'Full Name', type: 'fullName', visible: true },
    { def: 'hospitalName', label: 'Hospital Name', type: 'text', visible: true },
    { def: 'ownerDetails.email', label: 'Email', type: 'email', visible: true },
    { def: 'ownerDetails.phoneNumber', label: 'Phone Number', type: 'phone', visible: true },
    { def: 'ownerDetails.role', label: 'Role', type: 'text', visible: true },
    { def: 'ownerDetails.gender', label: 'Gender', type: 'gender', visible: true },
    { def: 'modifiedDate', label: 'Last Modified ON', type: 'date', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  

  constructor(private reloadService:ReloadService,private hospitalService:HospitalService) { }
  

  loadHospitals(paginationRequest: PagedRequest): Observable<PagedResult<AddHospital>> {
      return this.hospitalService.getHospitals(paginationRequest).pipe(
        map(data => ({
          ...data,
          items: (data.items || []).map((hospital: AddHospital) => ({
            ...hospital,
            img: 'assets/images/user/doctor.jpg'
          }))
        }))
      );
    }
    

}
