import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { catchError, first, map, Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  constructor( private snackBar: MatSnackBar,private http:HttpClient) { }

  private reloadUsersList = new Subject<void>();

  reloadUsersList$ = this.reloadUsersList.asObservable();

  triggerUsersListReload() {
    this.reloadUsersList.next();
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

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition='top',
    placementAlign: MatSnackBarHorizontalPosition='center'
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ emailExists: boolean } | null> => {
      const email = control.value;
      if (!email) return of(null);

      return this.http.get<boolean>(`http://localhost:5068/api/Users/getuserbyemail/${email}`).pipe(
        map((exists) => (exists ? { emailExists: true } : null)),
        catchError(() => of(null)), // Fail silently
        first()
      );
    };
  }

   requireAutocompleteObject(control: AbstractControl): ValidationErrors | null {
      const value = control.value;
      // If value is a string (not an object), it's invalid
      if (typeof value === 'string' || !value) {
        return { notSelectedFromDropdown: true };
      }
      return null;
  }


  

}
