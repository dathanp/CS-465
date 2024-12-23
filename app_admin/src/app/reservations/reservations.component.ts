import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    const token = localStorage.getItem('token'); // Replace with actual token storage
    const headers = { Authorization: `Bearer ${token}` };
  
    this.http.get<any[]>('http://localhost:3000/api/reservations/all', { headers, withCredentials: true })
      .subscribe({
        next: (data) => { this.reservations = data; },
        error: (err) => { console.error(err); this.errorMessage = 'Unauthorized'; },
      });
  }
  
  

  cancelReservation(reservationId: string): void {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      this.http.delete(`http://localhost:3000/api/reservations/${reservationId}`).subscribe({
        next: () => {
          this.reservations = this.reservations.filter((res) => res._id !== reservationId);
          alert('Reservation canceled successfully.');
        },
        error: (error) => {
          console.error('Error canceling reservation:', error);
          alert('Could not cancel the reservation. Please try again.');
        },
      });
    }
  }

}