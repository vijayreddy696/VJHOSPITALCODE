import { Component } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '../user.service';
import { Role } from '@core/models/role';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    FileUploadComponent,
    MatButtonModule,
    MatProgressSpinnerModule
],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})



export class AddUserComponent {
  loading:boolean =false;
  docForm: UntypedFormGroup;
  roles!:string[] ;
  constructor(private fb: UntypedFormBuilder,private userservice:UserService,private router:Router) {
    debugger;
this.roles = Object.values(Role)
    this.docForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      gender: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      conformPassword: ['', [Validators.required,this.confirmPasswordValidator]],
      role: [''],
      address: [null],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      dateOfBirth: ['', [Validators.required]],
      uploadFile: [null],
    });
  }

 
  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.parent) {
      return null;
    }
  
    const password = control.parent.get('password')?.value;
    const confirmPassword = control.value;
  
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
  
    return null;
  }


  getErrorMessage(controlName: string): string | null {
    const control = this.docForm.get(controlName);
    if (!control || !control.errors) {
      return null; // no error or not touched yet
    }
  
    if (control.hasError('required')) 
          return 'This field is required';
  
    if (controlName === 'email' && control.hasError('email')) 
      return 'Please enter a valid email address';
  
    if (controlName === 'conformPassword' && control.hasError('passwordMismatch')) 
      return 'Passwords do not match';
  
    return null;
  }
  
  



  onSubmit() {

    if(this.docForm.invalid)
      return;
    this.loading = true;
    console.log('Form Value', this.docForm.value);
    this.userservice.adduser(this.docForm.value).subscribe({
      next:(response)=>{
        console.log(response)
        this.loading = false;
        this.router.navigate(["/user/userslist"]);
      },
      error:(error)=>{
        console.log(error)
        this.loading = false;
      }
      
    }
     
    )
  }

}

