import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogContent, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { Router } from '@angular/router';
import { ReloadService } from '@shared/services/reload.service';


export interface DialogData {
  formFields:[],
  title:string,
  action: 'add' | 'edit';
  data:any;
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

  action: string;
  dialogTitle: string;
  docForm: UntypedFormGroup;
  formValue:any;
  @Input() loading: boolean = false;
  title!:string;
  @Output() formemitter = new EventEmitter<any>();
  formFields :any;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public userservice: UserService,private reloadservice:ReloadService,
    private fb: UntypedFormBuilder,private router:Router
  ) {
    this.action = data.action;
    this.formValue = data.data;
    this.title = data.title;
    this.formFields = data.formFields;
    this.dialogTitle = this.action === 'edit' ? 'Update '+this.title : 'New '+this.title;
    this.docForm = this.fb.group({});
    this.docForm.addControl(
      'id',
      new FormControl(0) // Add validators here manually if needed
    );
    this.formFields.forEach((field:any) => {
        this.docForm.addControl(field?.name, new FormControl('', field.validators || []));
    });
    if(this.formValue)
      this.docForm.patchValue(this.formValue)
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
    this.formemitter.emit(this.docForm.value);
    console.log('Form Value', this.docForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without any action
  }

}
