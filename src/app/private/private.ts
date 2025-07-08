import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StorageService } from '../services/storage-service';

@Component({
  selector: 'app-private',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './private.html',
  styleUrl: './private.scss'
})
export class Private implements OnInit{

  loggedUser: string | null = null;

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.storageService.getUsername(); // Retrieve logged user from storage
    if (!this.loggedUser) {
      this.router.navigate(['/login']); // Redirect to login if no user is logged in
    }
  }

  logout() {
    this.storageService.removeLoggedUser(); // Clear stored user data
    this.router.navigate(['/login']); // Redirect to login page
  }
}
