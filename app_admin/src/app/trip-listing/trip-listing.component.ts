import { TripDataService } from '../services/trip-data.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { Trip } from '../models/trip';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service'; // Import the service

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  providers: [TripDataService],
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css']
})
export class TripListingComponent implements OnInit {

  trips: Trip[] = []; // Initialize trips as an empty array
  message: string = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService // Inject the service here
  ) {
    console.log('TripListingComponent constructor');
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public get isAdmin(): boolean {
    return this.authenticationService.isAdmin(); // Use the isAdmin method from AuthenticationService
  }

  fetchTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (data) => {
        this.trips = data;
      },
      error: (err) => {
        console.error('Error fetching trips:', err);
      }
    });
  }

  private getStuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (trips: Trip[]) => { // Properly type the response
          this.trips = trips;
          if (trips.length > 0) {
            this.message = `There are ${trips.length} trips available.`;
          } else {
            this.message = 'There were no trips retrieved from the database.';
          }
          console.log(this.message);
        },
        error: (error: any) => {
          this.message = 'Failed to load trips. Please try again later.';
          console.error('Error fetching trips:', error);
        }
      });
  }

  ngOnInit(): void {
    console.log('TripListingComponent ngOnInit');
    this.getStuff();
  }
}
