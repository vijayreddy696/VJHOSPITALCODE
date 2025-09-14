import { Component } from '@angular/core';
import { getQualificationFormFields } from '@shared/form-fields/qualification-form-fields.config';
import { QualificationService } from '../qualification.service';
import { PagedRequest } from '@core/models/pagedrequest';
import { Observable } from 'rxjs';
import { PagedResult } from '@core/models/pagedresult';
import { Qualification } from '@core/models/qualification.interface';
import { CommonTableComponent } from '@shared/components/common-table/common-table.component';

@Component({
  selector: 'app-qualifications-list',
  imports: [CommonTableComponent],
  templateUrl: './qualifications-list.component.html',
  styleUrl: './qualifications-list.component.scss'
})
export class QualificationsListComponent {


  constructor(private qualificationService:QualificationService){}
  
    readonly columnDefinitions = [
      { def: 'select', label: 'Checkbox', type: 'check', visible: true },
      { def: 'code', label: 'Code', type: 'text', visible: true },
      { def: 'fullForm', label: 'Full Form', type: 'text', visible: true },
      { def: 'modifiedDate', label: 'Last Modified ON', type: 'date', visible: true },
      { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
    ];
    readonly title = "Qualification";
    readonly formFields = (params: any) => getQualificationFormFields(params);

    loadData(paginationRequest: PagedRequest): Observable<PagedResult<Qualification>> {
      return this.qualificationService.getQualifications(paginationRequest);
    }

    addData(formData: any): Observable<any> {
      return this.qualificationService.addQualification(formData);
    }
    
    deleteData(id: number): Observable<any> {
      return this.qualificationService.deleteQualification(id);
    }

    deleteManyData(ids: number[]) {
      return this.qualificationService.deletemanyQualifications(ids);
    }

     getDataById(id: number): Observable<any> {
        return this.qualificationService.GetQualificationById(id);
    }

}
