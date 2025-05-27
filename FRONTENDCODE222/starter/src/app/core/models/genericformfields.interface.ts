import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

export interface genericFormField {
  name: string;
  label: string;
  type: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  options?: string[];
  blur?: boolean;
  fields?: genericFormField[];
}
