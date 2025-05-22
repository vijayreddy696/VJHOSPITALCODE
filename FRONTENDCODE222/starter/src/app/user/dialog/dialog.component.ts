import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogContent, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Doctors } from '@core/models/doctor';
import { UserService } from '../user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Role } from '@core/models/role';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';


export interface DialogData {
  id: number;
  action: string;
  doctors: Doctors;
}

@Component({
  selector: 'app-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogClose,
    MatProgressSpinnerModule,
    FileUploadComponent
],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  roles!:string[] ;

  action: string;
  dialogTitle: string;
  docForm: UntypedFormGroup;
  loading:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public userservice: UserService,
    private fb: UntypedFormBuilder
  ) {
    this.roles = Object.values(Role)

    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.doctors.name : 'New Doctor';
    // this.doctors = this.action === 'edit' ? data.doctors : new Doctors({}); // Create a blank object
    this.docForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
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

  submit() {
   
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without any action
  }

}
