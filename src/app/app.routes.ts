import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { Private } from './private/private';
import { LoginGuard } from './guards/login-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./public/login/login').then(m => m.Login)
  },
  {
    path: 'private',
    component: Private,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./private/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'wallets',
        loadComponent: () => import('./private/wallets/wallets').then(m => m.Wallets)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
