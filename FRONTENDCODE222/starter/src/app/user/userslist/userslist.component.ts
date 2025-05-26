import { Component } from '@angular/core';
import { rowsAnimation } from '@shared';
import { UserService } from '../user.service';
import { map, Observable, Subject } from 'rxjs';
import { User } from '@core/models/user';
import { PagedRequest } from '@core/models/pagedrequest';
import { PagedResult } from '@core/models/pagedresult';
import { ReloadService } from '@shared/services/reload.service';
import { getUserFormFields } from '@shared/form-fields/user-form-fields.config';
import { CommonTableComponent } from '@shared/components/common-table/common-table.component';


@Component({
  selector: 'app-userslist',
  imports: [
    CommonTableComponent
  ],
  templateUrl: './userslist.component.html',
  styleUrl: './userslist.component.scss',
  animations: [rowsAnimation],

})


export class UserslistComponent {

 

  readonly columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'fullName', label: 'Full Name', type: 'fullName', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'phoneNumber', label: 'Phone Number', type: 'phone', visible: true },
    { def: 'role', label: 'Role', type: 'text', visible: true },
    { def: 'gender', label: 'Gender', type: 'gender', visible: true },
    { def: 'modifiedDate', label: 'Last Modified ON', type: 'date', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  readonly title = "User";

  readonly formFields = (params: any) => getUserFormFields(this.reloadService, params);

  
  
  constructor(private userservice:UserService,private reloadService:ReloadService ){ }
 
  loadUsers(paginationRequest: PagedRequest): Observable<PagedResult<User>> {
    return this.userservice.getUsers(paginationRequest).pipe(
      map(data => ({
        ...data,
        items: (data.items || []).map((user: User) => ({
          ...user,
          img: 'assets/images/user/doctor.jpg'
        }))
      }))
    );
  }
  
  addUser(formData: any): Observable<any> {
    return this.userservice.addUser(formData);
  }


  deleteUser(id: number): Observable<any> {
    return this.userservice.deleteUser(id);
  }
  
 
}
