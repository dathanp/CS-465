import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  submitted = false;

  credentials = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.formError = '';
    if (
      !this.credentials.email ||
      !this.credentials.password ||
      !this.credentials.name
    ) {
      this.formError = 'All fields are required, please try again.';
      this.router.navigateByUrl('#'); // Return to login page
    } else {
      this.doLogin();
    }
  }

  public navigateToAdminRegister(): void {
    console.log('Navigating to Admin Register');
    this.router.navigate(['/admin-register']).then((success) => {
      console.log('Navigation successful:', success);
    }).catch((error) => {
      console.error('Navigation failed:', error);
    });
  }

  private doLogin(): void {
    let newUser = {
      name: this.credentials.name,
      email: this.credentials.email,
    } as User;

    this.authenticationService.login(newUser, this.credentials.password);

    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['']);
    } else {
      var timer = setTimeout(() => {
        if (this.authenticationService.isLoggedIn()) {
          this.router.navigate(['']);
        }
      }, 3000);
    }
  }
}