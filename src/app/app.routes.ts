import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { Private } from './private/private';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
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
      // {
      //   path: 'settings',
      //   loadComponent: () => import('./private/settings.component').then(m => m.SettingsComponent)
      // },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
