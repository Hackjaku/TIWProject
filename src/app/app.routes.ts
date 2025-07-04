import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { Private } from './private/private';
import { LoginGuard } from './guards/login-guard';

const loadGallery = () => import('./public/gallery/gallery').then(m => m.Gallery);

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./public/login/login').then(m => m.Login)
  },
  {
    path: 'gallery',
    loadComponent: loadGallery
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
        path: 'currencies',
        loadComponent: () => import('./private/currencies/currencies').then(m => m.Currencies)
      },
      {
        path: 'gallery',
        loadComponent: loadGallery
      },
      {
        path: 'nfts',
        loadComponent: () => import('./private/nfts/nfts').then(m => m.Nfts)
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
