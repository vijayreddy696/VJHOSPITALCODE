import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthService, Role } from '@core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReloadService } from '@shared/shared-services/reload.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    imports: [
      CommonModule,
        RouterLink,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
    ]
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private reloadService:ReloadService

  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['vijju7259@gmail.com', Validators.required],
      password: ['Vijayreddy696@', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  adminSet() {
    this.authForm.get('email')?.setValue('admin@hospital.org');
    this.authForm.get('password')?.setValue('admin@123');
  }
  doctorSet() {
    this.authForm.get('email')?.setValue('doctor@hospital.org');
    this.authForm.get('password')?.setValue('doctor@123');
  }
  patientSet() {
    this.authForm.get('email')?.setValue('patient@hospital.org');
    this.authForm.get('password')?.setValue('patient@123');
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'email and Password not valid !';
      return;
    } else {
      this.subs.sink = this.authService
        .login(this.f['email'].value, this.f['password'].value)
        .subscribe({
          next: (res) => {
            if (res) {
              setTimeout(() => {
                const role = this.authService.currentUserValue.role;
                if (role === Role.SuperAdmin || role === Role.Admin) {
                  this.router.navigate(['/admin/dashboard/main']);
                } else if (role === Role.Doctor) {
                  this.router.navigate(['/doctor/dashboard']);
                } else if (role === Role.Patient) {
                  this.router.navigate(['/patient/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
                this.loading = false;
              }, 1000);
            } else {
              this.error = 'Invalid Login';
            }
          },
          error: (error) => {
        if (error.status === 401) {
           this.reloadService.showNotification(
          'snackbar-danger',
          'Invalid credentials. Try again..');
        }
            this.error = error;
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }
 
}
