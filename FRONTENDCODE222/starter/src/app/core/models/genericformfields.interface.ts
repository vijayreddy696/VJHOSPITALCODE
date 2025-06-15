import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export interface genericFormField {
  name: string;
  label: string;
  type: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  options?: string[];
  autoOptions?: ((search: string) => Observable<any>); // <-- fixed
  patchto?:string;
  valuetoShow?: string;
  valueToPatch?:string
  blur?: boolean;
  fields?: genericFormField[];
  linkField?:string;
  isreadonly?:boolean;
  hidden?: boolean, // always hidden
}


