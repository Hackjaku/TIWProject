import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'private',
    loadChildren: () => import('./private/private-module').then(m => m.PrivateModule),
    canActivate: [AuthGuard]
  }
];
