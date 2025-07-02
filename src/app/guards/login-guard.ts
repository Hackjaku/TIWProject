import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { StorageService } from "../services/storage-service";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private storageService: StorageService,
  ) { }

  canActivate(): boolean | UrlTree {
    const isLoggedIn = !!this.storageService.getToken();
    return isLoggedIn ? this.router.parseUrl('/private/dashboard') : true;
  }
}
