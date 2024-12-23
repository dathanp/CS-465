import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent implements OnInit{
  public user = {
    name: '',
    email: '',
    password: ''
  };

  public errorMessage = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AdminRegisterComponent loaded');
  }
  public register(): void {
    this.authService.registerAdmin(this.user).subscribe({
        next: () => {
            this.router.navigate(['/login']); // Redirect to login after success
        },
        error: (err) => {
            this.errorMessage = err.error.message || 'Failed to register admin. Please try again.';
        },
    });
}
}
