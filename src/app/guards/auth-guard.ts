import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { StorageService } from "../services/storage-service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  canActivate(): boolean | UrlTree {
    const isLoggedIn = !!this.storageService.getToken();
    if (!isLoggedIn) {
      console.log('AuthGuard: User is not authenticated, redirecting to login');
      return this.router.parseUrl('/login');  // <-- return UrlTree to redirect
    }
    console.log('AuthGuard: User is authenticated');
    return true;
  }
}
