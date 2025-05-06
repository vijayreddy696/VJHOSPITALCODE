import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

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
  private formBuilder: UntypedFormBuilder
){

}



  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['admin@hospital.org', Validators.required],
      password: ['admin@123', Validators.required],
      confirmPassword: ['admin@', Validators.required],
    });
  }



  adminSet(){

  }

  doctorSet(){
    
  }
  patientSet(){
    
  }

  onSubmit(){

  }

}
