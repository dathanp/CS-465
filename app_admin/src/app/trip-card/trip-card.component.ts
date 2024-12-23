import { TripDataService } from './../services/trip-data.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})

export class TripCardComponent implements OnInit{
  @Input('trip') trip: any;
  @Output() tripDeleted = new EventEmitter<void>();

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public editTrip(trip: Trip){
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public deleteTrip(tripCode: string): void {
    if (!tripCode) {
        console.error('Trip code is missing.');
        alert('Trip code is missing.');
        return;
    }
    if (confirm('Are you sure you want to delete this trip?')) {
        console.log(`Deleting trip with code: ${tripCode}`);
        this.tripDataService.deleteTrip(tripCode).subscribe({
            next: () => {
                alert('Trip deleted successfully.');
                this.tripDeleted.emit(); // Notify parent to refresh the trip list
            },
            error: (err) => {
                console.error('Error deleting trip:', err);
                alert('Failed to delete the trip.');
            },
        });
    }
}
  
}
