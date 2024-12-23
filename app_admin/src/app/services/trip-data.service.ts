import { Trip } from './../models/trip';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})

export class TripDataService {

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tokenService: TokenService 
  ) {}
  url = 'http://localhost:3000/api/trips';

  getTrips() : Observable<Trip[]> { 
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip): Observable<Trip> {
    const token = this.tokenService.getToken(); // Retrieve the token
    console.log('Authorization Header: Bearer', token); // Debugging log
    return this.http.post<Trip>(this.url, formData, {
      headers: { Authorization: `Bearer ${token}` }, // Add the Authorization header
    });
  }  

  getTrip(tripCode: string): Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }
  
  updateTrip(formData: Trip): Observable<Trip> {
    const token = this.tokenService.getToken(); // Get the token
    console.log('Authorization Header: Bearer', token); // Debugging
    return this.http.put<Trip>(this.url + '/' + formData.code, formData, {
      headers: { Authorization: `Bearer ${token}` }, // Attach the token
    });
  }
  
  
  deleteTrip(tripCode: string): Observable<any> {
    const url = `${this.url}/${tripCode}`;
    console.log('DELETE request URL:', url);
    const token = this.tokenService.getToken();
    return this.http.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  

  // Call to /login endpoint, returns JWT
  login(user: User, passwd: string): Observable<AuthResponse> {
    // Corrected the URL to match your backend route
    return this.http.post<AuthResponse>('http://localhost:3000/api/login', {
      name: user.name,
      email: user.email,
      password: passwd,
    });
  }

  // Call to /register endpoint, creates user and returns JWT
  register(user: User, passwd: string): Observable<AuthResponse> {
    // console.log('Inside TripDataService:register');
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Helper method to process both login and register methods
  private handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    // console.log('Inside TripDataService:handleAuthAPICall');
    let formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(`${this.url}/${endpoint}`, formData);
  }

}
