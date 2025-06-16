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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { Router } from '@angular/router';
import { ReloadService } from '@shared/shared-services/reload.service';
import { genericFormField } from '@core/models/genericformfields.interface';
import { debounceTime, distinctUntilChanged, map, of, startWith, Subject, switchMap, tap } from 'rxjs';


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
    FileUploadComponent,
    MatAutocompleteModule
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
  private searchTextSubjects: { [key: string]: Subject<string> } = {};
  filteredOptions: { [key: string]: any } = {}; // already defined, keep it for observables
  

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
  if(this.formValue){
    debugger;
    this.docForm.patchValue(this.formValue)
  }
  

   // Now bind all autocomplete logic
   this.buildAutocompleteLogic(this.formFields);

  }
 
  buildAutocompleteLogic(fields: genericFormField[], parentPath: string = '') {
    
    fields.forEach(field => {
      const controlPath = parentPath ? `${parentPath}.${field.name}` : field.name;
  
      if (field.type === 'autocomplete' && typeof field.autoOptions === 'function') {
        const optionsFn = field.autoOptions;
        const control = this.docForm.get(controlPath);
  
        this.searchTextSubjects[controlPath] = new Subject<string>();
  
        this.filteredOptions[controlPath] = this.searchTextSubjects[controlPath].pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(searchText => optionsFn(searchText).pipe(
            map((response:any) => response.items || [])
          )),
        );
  
        // Trigger initial fetch
        this.searchTextSubjects[controlPath].next('');
  
        // Handle patching logic when an option is selected
        control?.valueChanges.pipe(distinctUntilChanged()).subscribe(selectedOption => {
          if (selectedOption && field.patchto && field.valueToPatch) {
            const patchControlPath = field.patchto;
            const patchControl = this.docForm.get(patchControlPath);
            if (patchControl && selectedOption[field.valueToPatch] !== undefined) {
              patchControl.patchValue(selectedOption[field.valueToPatch]);
            } else {
              console.warn(`FormControl ${patchControlPath} not found or valueToPatch is invalid.`);
            }
          }
        });
        
      }
  
      // Recursively process nested groups
      if (field.type === 'group' && Array.isArray(field.fields)) {
        const nextPath = parentPath ? `${parentPath}.${field.name}` : field.name;
        this.buildAutocompleteLogic(field.fields, nextPath);
      }
    });
  }


  


  onSearchTextChanged(controlPath: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.searchTextSubjects[controlPath]) {
      this.searchTextSubjects[controlPath].next(input.value);
    } else {
      console.warn(`No subject found for path: ${controlPath}`);
    }
  }
  
 


  getErrorMessage(controlName: string): string | null {
    
    const control = this.docForm.get(controlName);
    if (!control || !control.errors) {
      return null; // no error or not touched yet
    }
    if (control.hasError('required')) 
      return 'This field is required';

    if (control.hasError('emailExists')) {
      return 'Email already exists';
    }
    if (control.hasError('notSelectedFromDropdown')) {
      return 'Only values from options are allowed';
    }
    if (control.hasError('email')) 
      return 'Please enter a valid email address';
  
    if (control.hasError('passwordMismatch')) 
      return 'Passwords do not match';
  
    return null;
  }

  onSubmit() {
    
    if(this.docForm.invalid)
      return;
    this.formFields.forEach(field => {
      if (field.type === 'autocomplete') {
        const control = this.docForm.get(field.name);
        if (control) control.setValue(null);
      }
    });
    this.formemitter.emit(this.docForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without any action
  }

  displayFnFactory(fieldPath: string, valueToShow: string): (option: any) => string {
    return (option: any) => {
      if (!option) return '';
      let abc = option
       return option[valueToShow] ?? '';
    };
  }
  


  findFieldByPath(path: string, fields: genericFormField[]): genericFormField | undefined {
    const parts = path.split('.');
    let currentFields = fields;
    let foundField: genericFormField | undefined;
  
    for (const part of parts) {
      foundField = currentFields.find(f => f.name === part);
      if (!foundField) return undefined;
      if (foundField.type === 'group' && foundField.fields) {
        currentFields = foundField.fields;
      } else {
        break;
      }
    }
  
    return foundField;
  }
  
  
  

}
