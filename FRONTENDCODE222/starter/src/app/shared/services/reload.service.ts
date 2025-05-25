import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  constructor( private snackBar: MatSnackBar) { }

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

}
