import { Injectable } from '@angular/core';
import { LoginResponse } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get getLoggedUser(): LoginResponse | null {
    const storedData = localStorage.getItem('loggedUser');
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      return null;
    }
  }

  setLoggedUser(data: LoginResponse): void {
    localStorage.setItem('loggedUser', JSON.stringify(data));
  }

  removeLoggedUser(): void {
    localStorage.removeItem('loggedUser');
  }

  getToken(): string | null {
    const user = this.getLoggedUser;
    return user ? user.Token : null;
  }

  getUserId(): number | null {
    const user = this.getLoggedUser;
    return user ? user.UserId : null;
  }

  getUsername(): string | null {
    const user = this.getLoggedUser;
    return user ? user.Username : null;
  }

}
