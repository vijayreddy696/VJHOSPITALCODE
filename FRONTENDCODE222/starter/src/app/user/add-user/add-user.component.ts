import { Component } from '@angular/core';
import { AbstractControl,ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Role } from '@core/models/role';
import { Router } from '@angular/router';
import { SharedformsComponent } from '@shared/components/sharedforms/sharedforms.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ReloadService } from '@shared/services/reload.service';
import { getUserFormFields } from '@shared/form-fields/user-form-fields.config';


@Component({
  selector: 'app-add-user',
  imports: [
    SharedformsComponent
],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})



export class AddUserComponent {
  loading:boolean =false;
  roles!:string[] ;
  
  constructor(private userservice:UserService,private router:Router,private reloadService:ReloadService,
    private snackBar: MatSnackBar,

  ) {

  }
  formFields = getUserFormFields(this.reloadService);

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  onSubmit(formValue:any) {
    this.loading = true;
    console.log('Form Value', formValue);
    this.userservice.adduser(formValue).subscribe({
      next:(response)=>{
        console.log(response)
        this.loading = false;
        this.showNotification(
          'snackbar-success',
          'Added Record Successfully...!!!',
          'top',
          'center'
        );
        this.router.navigate(["/user/userslist"]);
      },
      error:(error)=>{
        this.showNotification(
          'snackbar-danger',
          'Error IN adding...!!!',
          'top',
          'center'
        );
        console.log(error)
        this.loading = false;
      }
      
    }
     
    )
  }

}

