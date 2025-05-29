import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl, ValidationErrors, FormControl, FormGroup } from '@angular/forms';
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
import { genericFormField } from '@core/models/genericformfields.interface';


export interface DialogData {
  formFieldsFn: (param: any) => genericFormField[],
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
export class DialogComponent implements OnInit {

  action: string;
  dialogTitle: string;
  docForm: UntypedFormGroup;
  formValue:any;
  @Input() loading: boolean = false;
  title!:string;
  @Output() formemitter = new EventEmitter<any>();
  formFields :genericFormField[]=[];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public userservice: UserService,private reloadservice:ReloadService,
    private fb: UntypedFormBuilder,private router:Router
  ) {
    this.action = data.action;
    this.formValue = data.data;
    this.title = data.title;
    this.dialogTitle = this.action === 'edit' ? 'Update '+this.title : 'New '+this.title;
    this.docForm = this.fb.group({});
    this.docForm.addControl(
      'id',
      new FormControl(0) // Add validators here manually if needed
    );
    
   
  }
  ngOnInit(): void {
    this.formFields = this.data.formFieldsFn(this.action === 'edit');
   
    const addControls = (fields: any[], formGroup: FormGroup, isNested = false) => {
      let idAdded = false;
    
      fields.forEach((field: any) => {
        if (field.type === 'group' && field.fields) {
          // Create nested FormGroup recursively
          const nestedGroup = new FormGroup({});
          
          // Add 'id' with default 0 in the group first
          nestedGroup.addControl('id', new FormControl(0));
    
          // Recursively add remaining fields
          addControls(field.fields, nestedGroup, true);
    
          formGroup.addControl(field.name, nestedGroup);
        } else {
          // For non-group, add 'id' once at the beginning
          if (!isNested && !idAdded) {
            formGroup.addControl('id', new FormControl(0));
            idAdded = true;
          }
    
          // Skip adding 'id' again if it's in fields
          if (field.name === 'id') return;
    
          const controlOptions: any = {
            validators: field.validators || [],
            asyncValidators: field.asyncValidators || [],
          };
    
          if (field.blur) {
            controlOptions.updateOn = 'blur';
          }
    
          formGroup.addControl(field.name, new FormControl('', controlOptions));
        }
      });
    };

    addControls(this.formFields, this.docForm);
  if(this.formValue)
    this.docForm.patchValue(this.formValue)

  }

  
 


  getErrorMessage(controlName: string): string | null {
    const control = this.docForm.get(controlName);
    if (!control || !control.errors) {
      return null; // no error or not touched yet
    }
    if (control.hasError('emailExists')) {
      return 'Email already exists';
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
