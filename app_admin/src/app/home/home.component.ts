import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public currentUser: User | null = null;
  public isAdminUser: boolean = false;

  // Define admin options
  public adminOptions = [
    { title: 'Travel', route: 'list-trips', icon: '✈️' },
    { title: 'Reservations', route: 'reservations', icon: '📅' },
    { title: 'Users', route: '/users', icon: '👥' },
    { title: 'Settings', route: '/settings', icon: '⚙️' },
    { title: 'User Site', route: 'http://localhost:3000', isExternal: true}
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in
    if (this.authenticationService.isLoggedIn()) {
      this.currentUser = this.authenticationService.getCurrentUser();
      this.isAdminUser = this.authenticationService.isAdmin();
    }
  }

  navigateTo(route: string, isExternal = false): void {
    if (isExternal) {
      window.open(route, '_self'); // Open external links
    } else {
      this.router.navigate([route]); // Navigate within the app
    }
  }

  navigateToUserSite(): void {
    window.location.href = 'http://localhost:3000'; // Replace with your user site's URL
  }

}
