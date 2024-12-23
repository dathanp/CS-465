import { Inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { TripDataService } from '../services/trip-data.service';
import { firstValueFrom, Observable } from 'rxjs'; // Converts Observable to Promise
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(
    private tokenService: TokenService,
    private tripDataService: TripDataService,
    private http:HttpClient
  ) {}

  public getToken(): string {
    return this.tokenService.getToken(); // Fallback to empty string if null
  }

  public saveToken(token: string): void {
    this.tokenService.saveToken(token);
  }

  public async login(user: User, password: string): Promise<void> {
    const authResp: AuthResponse = await firstValueFrom(
      this.tripDataService.login(user, password)
    );
    this.saveToken(authResp.token);
  }

  public async register(user: User, password: string): Promise<void> {
    const authResp: AuthResponse = await firstValueFrom(
      this.tripDataService.register(user, password)
    );
    this.saveToken(authResp.token);
  }

  public registerAdmin(user: { name: string; email: string; password: string }): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/admin/register';
    const token = this.getToken();
    return this.http.post(apiUrl, user, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in the header
    });
}

  public logout(): void {
    this.tokenService.removeToken();
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    }
    return false;
  }  

  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
      const token: string = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
    return null;
  }
  
}
