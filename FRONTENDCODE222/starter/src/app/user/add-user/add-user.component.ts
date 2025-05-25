import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { SharedformsComponent } from '@shared/components/sharedforms/sharedforms.component';
import { ReloadService } from '@shared/services/reload.service';
import { getUserFormFields } from '@shared/form-fields/user-form-fields.config';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-user',
  imports: [
    SharedformsComponent
],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})



export class AddUserComponent {
  roles!:string[] ;
  readonly title:string = "User";
  readonly formFields = getUserFormFields(this.reloadService);
  
  constructor(private userservice:UserService,private reloadService:ReloadService) {

  }

  addUser(formData: any): Observable<any> {
    return this.userservice.adduser(formData);
  }

}

