import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  constructor() { }

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
}
