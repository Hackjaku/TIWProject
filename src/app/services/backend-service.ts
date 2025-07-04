import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private readonly baseUrl = 'http://localhost:8091/api/v1'; // or environment.apiUrl

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) { }

  private createAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  get<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}/${endpoint}`, { headers: this.createAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers: this.createAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.httpClient.put<T>(`${this.baseUrl}/${endpoint}`, body, { headers: this.createAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}/${endpoint}`, { headers: this.createAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  public getNotificationUrl(): string {
    return `http://localhost:8091/notificationhub`;
  }

  private handleError(error: any) {
    console.error('API error:', error);
    // Customize your error handling here
    return throwError(() => new Error(error.message || 'Server error'));
  }

}
