import { Component } from '@angular/core';
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
export class Private {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  logout() {
    this.storageService.removeLoggedUser(); // Clear stored user data
    this.router.navigate(['/login']); // Redirect to login page
  }
}
