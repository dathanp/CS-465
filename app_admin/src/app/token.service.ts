import { Injectable, Inject } from '@angular/core';
import { BROWSER_STORAGE } from './storage';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(@Inject(BROWSER_STORAGE) private storage: Storage) {}

  public getToken(): string {
    return this.storage.getItem('travlr-token') || ''; // Fallback to empty string if null
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public removeToken(): void {
    this.storage.removeItem('travlr-token');
  }
}
