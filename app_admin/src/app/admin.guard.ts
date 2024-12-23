import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Check if the user is logged in and has an admin role
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true; // Allow access
    }

    // Redirect to login if the user is not an admin
    this.router.navigate(['/login']);
    return false;
  }
}
