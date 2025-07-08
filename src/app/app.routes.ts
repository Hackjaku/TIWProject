import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { Private } from './private/private';
import { LoginGuard } from './guards/login-guard';
import { Public } from './public/public';


export const routes: Routes = [
  { path: '', redirectTo: 'public/login', pathMatch: 'full' },

  {
    path: 'public',
    component: Public, // ← NEW public layout component
    children: [
      {
        path: 'login',
        canActivate: [LoginGuard],
        loadComponent: () => import('./public/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./public/register/register').then(m => m.Register)
      },
      {
        path: 'gallery',
        loadComponent: () => import('./public/gallery/gallery').then(m => m.Gallery)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      }
    ]
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
        loadComponent: () => import('./public/gallery/gallery').then(m => m.Gallery)
      },
      {
        path: 'nfts',
        loadComponent: () => import('./private/nfts/nfts').then(m => m.Nfts)
      },
      {
        path: 'marketplace',
        loadComponent: () => import('./private/marketplace/marketplace').then(m => m.Marketplace)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },

  { path: '**', redirectTo: 'public/login' }
];
