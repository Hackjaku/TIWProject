import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { BackendService } from "../services/backend-service";
import { catchError, map, Observable, of } from "rxjs";
import { StorageService } from "../services/storage-service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private backendService: BackendService,
    private storageService: StorageService
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.backendService.get('User/checkauth').pipe(
      map(() => true),
      catchError(() => of(this.redirectToLogin()))
    )
  }

  private redirectToLogin(): UrlTree {
    this.storageService.removeLoggedUser(); // Clear any stored user data
    return this.router.parseUrl('/login');
  }
}
