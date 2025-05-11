import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  authForm!: UntypedFormGroup;
  hide = true;
  hideConfirm = true;
  error = 'hiii';
  loading = false;
  RememberMe:any;

constructor(
  private formBuilder: UntypedFormBuilder,
  private authService: AuthService,
  private router: Router
){
}



  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['vijju7259@gmail.com', Validators.required],
      password: ['Vijayreddy696@', Validators.required],
      confirmPassword: ['Vijayreddy696@', Validators.required],
    });
  }
  onSubmit() {
    
    if (this.authForm.invalid) return;

    this.loading = true;

    const loginData = {
      email: this.authForm.value.email,
      password: this.authForm.value.password,
      hospitalId: 6,
    };

    this.authService.login(loginData).subscribe({
      next: (res) => {
        
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }




}
