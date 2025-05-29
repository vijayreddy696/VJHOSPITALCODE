import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Observable } from 'rxjs';
import { ReloadService } from '@shared/services/reload.service';
import { Router } from '@angular/router';
import { genericFormField } from '@core/models/genericformfields.interface';

@Component({
  selector: 'app-sharedforms',
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
  templateUrl: './sharedforms.component.html',
  styleUrl: './sharedforms.component.scss'
})
export class SharedformsComponent implements OnInit{
  @Input() loading:boolean =false;
  @Input() formFields:genericFormField[]  = [];
  @Input() title:any;
  @Input() navigateUrl!: string;


  docForm!: FormGroup;


  @Input() onSubmitFn!: (formData: any) => Observable<any>;

  constructor(private fb: UntypedFormBuilder,private reloadService:ReloadService,private router:Router)
  {

  } 
  ngOnInit(): void {
    this.docForm = this.fb.group({});
  
    // this.formFields.forEach(field => {
    //   if (field?.name === 'id') 
    //     this.docForm.addControl(field.name, new FormControl(0));
    //   else {
    //     const controlOptions: any = {
    //       validators: field.validators || [],
    //       asyncValidators: field.asyncValidators || [],
    //     };
  
    //     //  Only add `updateOn: 'blur'` if field.blur === true
    //     if (field.blur) {
    //       controlOptions.updateOn = 'blur';
    //     }
    //     this.docForm.addControl(field.name, new FormControl('', controlOptions));
    //   }
    // });

   

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
  }
  


  getErrorMessage(controlPath: string): string | null {
    const control = this.docForm.get(controlPath);
    if (!control || !control.errors) {
      return null; // no error or not touched yet
    }
  
    if (control.hasError('emailExists')) {
      return 'Email already exists';
    }
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (controlPath.endsWith('email') && control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (controlPath.endsWith('conformPassword') && control.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return null;
  }
  
 


  onSubmit() {
    if (this.docForm.invalid) return;
  
    this.loading = true;
    const formValue = this.docForm.value;
  
    this.onSubmitFn(formValue).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.loading = false;
        this.reloadService.showNotification(
          'snackbar-success',
          this.title + ' Added Successfully...!!!'
        );
        this.router.navigate([this.navigateUrl]);
      },
      error: (error) => {
        console.error('Error:', error);
        this.reloadService.showNotification(
          'snackbar-danger',
          'Error IN adding '+this.title +'...!!!'
        );
        this.loading = false;
      }
    });
  }
  
}
