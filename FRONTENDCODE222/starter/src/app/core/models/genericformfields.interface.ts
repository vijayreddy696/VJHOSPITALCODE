import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export interface genericFormField {
  name: string;
  label: string;
  type: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  options?: string[];
  autoOptions?: ((search: string) => Observable<AutoOptions[]>); // <-- fixed
  blur?: boolean;
  fields?: genericFormField[];
}

export interface AutoOptions {
  label: string;
  value: any;
}
