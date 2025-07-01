import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { LoginRequest, LoginResponse } from '../interfaces/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private backendService: BackendService
  ) { }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      Username: username,
      Password: password
    };
    return this.backendService.post('User/login', loginRequest);
  }
}
