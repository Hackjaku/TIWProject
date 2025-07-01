import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./public/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./private/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AuthGuard]
  },
  // fallback route if you want:
  { path: '**', redirectTo: 'login' }
];
